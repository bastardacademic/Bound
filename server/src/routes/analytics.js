const express = require("express");
const router = express.Router();
const { PlatformAnalytics } = require("../models");

// Get analytics summary for a specific date
router.get("/", async (req, res) => {
  const { date } = req.query;

  try {
    const analytics = await PlatformAnalytics.findOne({ where: { date } });
    if (!analytics) {
      return res.status(404).json({ message: "No analytics data found for the specified date." });
    }

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get aggregated analytics (e.g., monthly summary)
router.get("/summary", async (req, res) => {
  const { start_date, end_date } = req.query;

  try {
    const analytics = await PlatformAnalytics.findAll({
      where: {
        date: {
          [Op.between]: [start_date, end_date],
        },
      },
    });

    const summary = {
      total_users: analytics.reduce((sum, record) => sum + record.total_users, 0),
      active_users: analytics.reduce((sum, record) => sum + record.active_users, 0),
      total_posts: analytics.reduce((sum, record) => sum + record.total_posts, 0),
      total_comments: analytics.reduce((sum, record) => sum + record.total_comments, 0),
      total_events: analytics.reduce((sum, record) => sum + record.total_events, 0),
      total_reports: analytics.reduce((sum, record) => sum + record.total_reports, 0),
    };

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
