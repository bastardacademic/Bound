const express = require("express");
const router = express.Router();
const { Report } = require("../models");

// Submit a report
router.post("/", async (req, res) => {
  const { content_id, content_type, reason } = req.body;

  try {
    const report = await Report.create({
      reported_by: req.user.id,
      content_id,
      content_type,
      reason,
    });
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all reports for moderation
router.get("/", async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
