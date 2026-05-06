const express = require("express");
const router = express.Router();
const { query, validationResult } = require("express-validator");
const Branch = require("../models/Branch");

// GET /api/branches?serviceId=ID - Return branches for a service
router.get(
  "/",
  [query("serviceId").isMongoId().withMessage("Valid service ID is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const branches = await Branch.find({
        serviceId: req.query.serviceId,
        isActive: true,
      }).sort({ city: 1, name: 1 });

      res.json({ success: true, data: branches });
    } catch (error) {
      console.error("Branches fetch error:", error.message);
      res.status(500).json({ success: false, message: "Failed to load branches" });
    }
  }
);

module.exports = router;
