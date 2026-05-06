const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

// GET /api/services - Return all active services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    console.error("Services fetch error:", error.message);
    res.status(500).json({ success: false, message: "Failed to load services" });
  }
});

module.exports = router;
