const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

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
