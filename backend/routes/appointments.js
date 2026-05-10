const express = require("express");
const router = express.Router();
const { body, param, query, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const Slot = require("../models/Slot");
const Branch = require("../models/Branch");
const Employee = require("../models/Employee");
const { sendBookingConfirmation } = require("../services/mailer");

// In the seed, each "physical" branch is duplicated once per service
// (e.g. there are 6 documents named "مركز خدمات الجيزة"). For the
// employee workflow they are the same location, so we resolve a branch
// to all branches that share its name.
async function resolveSameNamedBranchIds(branchId) {
  const branch = await Branch.findById(branchId);
  if (!branch) return [];
  const peers = await Branch.find({ name: branch.name }).select("_id");
  return peers.map((b) => b._id);
}

const STATUS_VALUES = ["confirmed", "verified", "completed", "cancelled"];

// Helper: build a [start, end) day window in the server's local timezone.
// Accepts "YYYY-MM-DD" (treated as local midnight) or undefined (today).
function dayWindow(dateStr) {
  let start;
  if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(Number);
    start = new Date(y, m - 1, d, 0, 0, 0, 0);
  } else if (dateStr) {
    start = new Date(dateStr);
    start.setHours(0, 0, 0, 0);
  } else {
    start = new Date();
    start.setHours(0, 0, 0, 0);
  }
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

// ---------------- POST /api/appointments ----------------
router.post(
  "/",
  [
    body("serviceId").isMongoId().withMessage("Valid service ID is required"),
    body("branchId").isMongoId().withMessage("Valid branch ID is required"),
    body("slotId").isMongoId().withMessage("Valid slot ID is required"),
    body("citizenName")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters")
      .escape(),
    body("citizenEmail")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail()
      .isLength({ max: 254 })
      .withMessage("Email is too long"),
    body("citizenPhone")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required")
      .matches(/^01[0125]\d{8}$/)
      .withMessage("Please enter a valid Egyptian phone number (e.g. 01012345678)"),
    body("nationalId")
      .trim()
      .notEmpty()
      .withMessage("National ID is required")
      .matches(/^\d{14}$/)
      .withMessage("National ID must be exactly 14 digits"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { serviceId, branchId, slotId, citizenName, citizenEmail, citizenPhone, nationalId } =
        req.body;

      // Pre-check existence + duplicate booking before touching the slot
      const slot = await Slot.findById(slotId);
      if (!slot) return res.status(404).json({ success: false, message: "Slot not found" });
      if (!slot.isActive) {
        return res.status(410).json({ success: false, message: "This slot is no longer active" });
      }

      const existingBooking = await Appointment.findOne({
        slotId,
        nationalId,
        status: "confirmed",
      });
      if (existingBooking) {
        return res
          .status(409)
          .json({ success: false, message: "You already have a booking for this time slot" });
      }

      // Atomic capacity-check + increment. $expr lets us compare two fields server-side
      // so two concurrent bookings cannot both pass the < check.
      const reserved = await Slot.findOneAndUpdate(
        {
          _id: slotId,
          isActive: true,
          $expr: { $lt: ["$bookedCount", "$capacity"] },
        },
        { $inc: { bookedCount: 1 } },
        { new: true }
      );

      if (!reserved) {
        return res
          .status(409)
          .json({ success: false, message: "This time slot is no longer available" });
      }

      // Create appointment; on failure, release the reservation we just took.
      let appointment;
      try {
        appointment = await Appointment.create({
          serviceId,
          branchId,
          slotId,
          citizenName,
          citizenEmail,
          citizenPhone,
          nationalId,
        });
      } catch (createErr) {
        await Slot.findByIdAndUpdate(slotId, { $inc: { bookedCount: -1 } });
        throw createErr;
      }

      const populatedAppointment = await Appointment.findById(appointment._id)
        .populate("serviceId", "name")
        .populate("branchId", "name address city")
        .populate("slotId", "date startTime endTime");

      sendBookingConfirmation(populatedAppointment).catch((e) =>
        console.error("[mailer] uncaught:", e.message)
      );

      res.status(201).json({
        success: true,
        message: "Booking confirmed successfully",
        data: populatedAppointment,
      });
    } catch (error) {
      console.error("Booking error:", error.message);
      res.status(500).json({ success: false, message: "Booking failed. Please try again." });
    }
  }
);

// ---------------- GET /api/appointments/user?nationalId=XXXX ----------------
// Returns all appointments for a given citizen national ID (sorted newest first)
router.get(
  "/user",
  [
    query("nationalId")
      .trim()
      .notEmpty()
      .withMessage("National ID is required")
      .matches(/^\d{14}$/)
      .withMessage("National ID must be exactly 14 digits"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { nationalId } = req.query;

      const appointments = await Appointment.find({ nationalId })
        .populate("serviceId", "name")
        .populate("branchId", "name address city")
        .populate("slotId", "date startTime endTime")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        count: appointments.length,
        data: appointments,
      });
    } catch (error) {
      console.error("Fetch user appointments error:", error.message);
      res
        .status(500)
        .json({ success: false, message: "Could not fetch your appointments. Please try again." });
    }
  }
);

// ---------------- GET /api/appointments/reference/:ref ----------------
// Lookup a single appointment by booking reference (used by QR confirmation page)
router.get(
  "/reference/:ref",
  [param("ref").trim().notEmpty().withMessage("Reference is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const appointment = await Appointment.findOne({ bookingReference: req.params.ref })
        .populate("serviceId", "name")
        .populate("branchId", "name address city")
        .populate("slotId", "date startTime endTime");

      if (!appointment) {
        return res.status(404).json({ success: false, message: "Appointment not found" });
      }

      res.json({ success: true, data: appointment });
    } catch (error) {
      console.error("Fetch by reference error:", error.message);
      res.status(500).json({ success: false, message: "Could not fetch appointment." });
    }
  }
);

// ---------------- PUT /api/appointments/:id/cancel ----------------
// Cancels an appointment (citizen-initiated). Releases the slot capacity.
router.put(
  "/:id/cancel",
  [
    param("id").isMongoId().withMessage("Valid appointment ID is required"),
    body("nationalId")
      .trim()
      .notEmpty()
      .withMessage("National ID is required")
      .matches(/^\d{14}$/)
      .withMessage("National ID must be exactly 14 digits"),
    body("reason").optional().trim().isLength({ max: 300 }).escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { nationalId, reason } = req.body;

      // Atomic state transition: only flip "confirmed" → "cancelled" once,
      // and only if the requester owns the appointment. The query filter
      // prevents double-cancellation and unauthorised cancels in one step.
      const update = {
        status: "cancelled",
        cancelledAt: new Date(),
      };
      if (reason) update.cancellationReason = reason;

      const cancelled = await Appointment.findOneAndUpdate(
        { _id: id, nationalId, status: "confirmed" },
        update,
        { new: true }
      );

      if (!cancelled) {
        // Distinguish the failure reason for a better message
        const existing = await Appointment.findById(id);
        if (!existing) {
          return res.status(404).json({ success: false, message: "Appointment not found" });
        }
        if (existing.nationalId !== nationalId) {
          return res
            .status(403)
            .json({ success: false, message: "You are not authorized to cancel this appointment" });
        }
        if (existing.status === "cancelled") {
          return res
            .status(409)
            .json({ success: false, message: "This appointment is already cancelled" });
        }
        return res
          .status(409)
          .json({ success: false, message: "Cannot cancel a completed appointment" });
      }

      // Release slot capacity (best-effort, never below zero)
      await Slot.findOneAndUpdate(
        { _id: cancelled.slotId, bookedCount: { $gt: 0 } },
        { $inc: { bookedCount: -1 } }
      );

      const populated = await Appointment.findById(cancelled._id)
        .populate("serviceId", "name")
        .populate("branchId", "name address city")
        .populate("slotId", "date startTime endTime");

      res.json({
        success: true,
        message: "Appointment cancelled successfully",
        data: populated,
      });
    } catch (error) {
      console.error("Cancel appointment error:", error.message);
      res.status(500).json({ success: false, message: "Could not cancel appointment." });
    }
  }
);

// =================== Employee-facing endpoints ===================

// GET /api/appointments/today?branchId=X&date=YYYY-MM-DD
// Returns today's appointments at a given branch (employee daily review).
router.get(
  "/today",
  [
    query("branchId").isMongoId().withMessage("Valid branch ID is required"),
    query("date").optional().isISO8601().withMessage("Invalid date"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { branchId, date } = req.query;
      const { start, end } = dayWindow(date);

      // Resolve to all branches sharing this name (see helper above)
      const branchIds = await resolveSameNamedBranchIds(branchId);
      if (branchIds.length === 0) {
        return res.status(404).json({ success: false, message: "Branch not found" });
      }

      // Find slots that fall in the day window across all peer branches
      const slots = await Slot.find({
        branchId: { $in: branchIds },
        date: { $gte: start, $lt: end },
      }).select("_id");

      const slotIds = slots.map((s) => s._id);

      const appointments = await Appointment.find({
        branchId: { $in: branchIds },
        slotId: { $in: slotIds },
      })
        .populate("serviceId", "name")
        .populate("branchId", "name city")
        .populate("slotId", "date startTime endTime")
        .sort({ "slotId.startTime": 1, createdAt: 1 });

      // Stats for the day
      const stats = appointments.reduce(
        (acc, a) => {
          acc.total += 1;
          if (a.status === "confirmed") acc.pending += 1;
          else if (a.status === "verified") acc.verified += 1;
          else if (a.status === "completed") acc.completed += 1;
          else if (a.status === "cancelled") acc.cancelled += 1;
          return acc;
        },
        { total: 0, pending: 0, verified: 0, completed: 0, cancelled: 0 }
      );

      res.json({
        success: true,
        date: start.toISOString().slice(0, 10),
        stats,
        count: appointments.length,
        data: appointments,
      });
    } catch (error) {
      console.error("Fetch today appointments error:", error.message);
      res
        .status(500)
        .json({ success: false, message: "تعذر جلب حجوزات اليوم. حاول مجدداً." });
    }
  }
);

// POST /api/appointments/verify-qr
// Body: { qrPayload: { ref, nid, ... }, employeeId }
// Validates the QR, ensures the appointment belongs to the employee's branch,
// and flips status confirmed → verified (i.e. checked-in).
router.post(
  "/verify-qr",
  [
    body("employeeId").isMongoId().withMessage("Valid employee ID is required"),
    body("qrPayload").custom((v) => {
      if (typeof v !== "object" || v === null || !v.ref) {
        throw new Error("QR payload must contain a 'ref' field");
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { employeeId, qrPayload } = req.body;

      const employee = await Employee.findById(employeeId);
      if (!employee || !employee.isActive) {
        return res.status(404).json({ success: false, message: "موظف غير معروف" });
      }

      const appointment = await Appointment.findOne({ bookingReference: qrPayload.ref })
        .populate("serviceId", "name")
        .populate("branchId", "name city")
        .populate("slotId", "date startTime endTime");

      if (!appointment) {
        return res
          .status(404)
          .json({ success: false, code: "NOT_FOUND", message: "الحجز غير موجود — تحقق من الرمز" });
      }

      // Branch scope check — match by branch name so all same-named
      // branches (one per service in the seed) count as one location.
      const peerBranchIds = (await resolveSameNamedBranchIds(employee.branchId)).map((id) =>
        id.toString()
      );
      const apptBranchId =
        appointment.branchId?._id?.toString() || appointment.branchId?.toString();
      if (!peerBranchIds.includes(apptBranchId)) {
        return res.status(403).json({
          success: false,
          code: "WRONG_BRANCH",
          message: "هذا الحجز ليس في فرعك",
          data: appointment,
        });
      }

      // National ID cross-check (defense-in-depth — if QR was tampered with)
      if (qrPayload.nid && qrPayload.nid !== appointment.nationalId) {
        return res.status(409).json({
          success: false,
          code: "MISMATCH",
          message: "بيانات الرمز لا تطابق الحجز",
        });
      }

      if (appointment.status === "cancelled") {
        return res.status(409).json({
          success: false,
          code: "CANCELLED",
          message: "هذا الحجز ملغي ولا يمكن تأكيد الحضور",
          data: appointment,
        });
      }

      if (appointment.status === "verified" || appointment.status === "completed") {
        return res.status(409).json({
          success: false,
          code: "ALREADY_VERIFIED",
          message: "تم تسجيل حضور هذا المواطن مسبقاً",
          data: appointment,
        });
      }

      appointment.status = "verified";
      appointment.verifiedAt = new Date();
      await appointment.save();

      const populated = await Appointment.findById(appointment._id)
        .populate("serviceId", "name")
        .populate("branchId", "name city")
        .populate("slotId", "date startTime endTime");

      res.json({
        success: true,
        message: "تم تأكيد حضور المواطن بنجاح",
        data: populated,
      });
    } catch (error) {
      console.error("Verify QR error:", error.message);
      res.status(500).json({ success: false, message: "تعذر التحقق من الرمز" });
    }
  }
);

// PUT /api/appointments/:id/status
// Body: { employeeId, status }
// Generic employee-driven status transition (e.g. mark completed manually).
router.put(
  "/:id/status",
  [
    param("id").isMongoId().withMessage("Valid appointment ID is required"),
    body("employeeId").isMongoId().withMessage("Valid employee ID is required"),
    body("status")
      .isIn(STATUS_VALUES)
      .withMessage(`Status must be one of: ${STATUS_VALUES.join(", ")}`),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { employeeId, status } = req.body;

      const employee = await Employee.findById(employeeId);
      if (!employee || !employee.isActive) {
        return res.status(404).json({ success: false, message: "موظف غير معروف" });
      }

      const appointment = await Appointment.findById(id);
      if (!appointment) {
        return res.status(404).json({ success: false, message: "الحجز غير موجود" });
      }

      const peerBranchIds = (await resolveSameNamedBranchIds(employee.branchId)).map((id) =>
        id.toString()
      );
      const apptBranchId = appointment.branchId.toString();
      if (!peerBranchIds.includes(apptBranchId)) {
        return res
          .status(403)
          .json({ success: false, message: "هذا الحجز ليس في فرعك" });
      }

      appointment.status = status;
      if (status === "verified" && !appointment.verifiedAt) {
        appointment.verifiedAt = new Date();
      }
      if (status === "cancelled" && !appointment.cancelledAt) {
        appointment.cancelledAt = new Date();
      }
      await appointment.save();

      const populated = await Appointment.findById(appointment._id)
        .populate("serviceId", "name")
        .populate("branchId", "name city")
        .populate("slotId", "date startTime endTime");

      res.json({ success: true, data: populated });
    } catch (error) {
      console.error("Update status error:", error.message);
      res.status(500).json({ success: false, message: "تعذر تحديث الحالة" });
    }
  }
);

module.exports = router;
