const express = require("express");
const router = express.Router();
const { query, validationResult } = require("express-validator");
const Slot = require("../models/Slot");

// GET /api/slots?branchId=ID - Return available slots for a branch
router.get(
  "/",
  [query("branchId").isMongoId().withMessage("Valid branch ID is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const slots = await Slot.find({
        branchId: req.query.branchId,
        isActive: true,
        date: { $gte: new Date() }, // Only future slots
      }).sort({ date: 1, startTime: 1 });

      // Filter to only available slots (bookedCount < capacity)
      const availableSlots = slots.filter((slot) => slot.isAvailable);

      res.json({ success: true, data: availableSlots });
    } catch (error) {
      console.error("Slots fetch error:", error.message);
      res.status(500).json({ success: false, message: "Failed to load time slots" });
    }
  }
);

module.exports = router;
