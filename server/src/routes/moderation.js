const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { Report } = require("../models");

router.use(authMiddleware);

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

// Get all reports for moderation — moderators/admins only, not every logged-in user
router.get("/", async (req, res) => {
  if (req.user.role !== "moderator" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const reports = await Report.findAll();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
