const express = require("express");
const router = express.Router();
const { body, query, validationResult } = require("express-validator");
const Employee = require("../models/Employee");

// POST /api/employees/login
// Lightweight login by employee code (matches the citizen login pattern).
router.post(
  "/login",
  [
    body("employeeCode")
      .trim()
      .notEmpty()
      .withMessage("Employee code is required")
      .isLength({ min: 3, max: 30 })
      .withMessage("Employee code must be between 3 and 30 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const code = String(req.body.employeeCode).trim().toUpperCase();
      const employee = await Employee.findOne({ employeeCode: code, isActive: true })
        .populate("branchId", "name nameEn city cityEn address");

      if (!employee) {
        return res
          .status(404)
          .json({ success: false, message: "كود الموظف غير صحيح أو غير مفعّل" });
      }

      res.json({
        success: true,
        data: {
          _id: employee._id,
          employeeCode: employee.employeeCode,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          branch: employee.branchId,
        },
      });
    } catch (error) {
      console.error("Employee login error:", error.message);
      res.status(500).json({ success: false, message: "تعذر تسجيل الدخول" });
    }
  }
);

// GET /api/employees/:id
// Reload an employee profile (used on app start).
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("branchId", "name nameEn city cityEn address");

    if (!employee || !employee.isActive) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.json({
      success: true,
      data: {
        _id: employee._id,
        employeeCode: employee.employeeCode,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        branch: employee.branchId,
      },
    });
  } catch (error) {
    console.error("Employee fetch error:", error.message);
    res.status(500).json({ success: false, message: "Could not fetch employee" });
  }
});

module.exports = router;
