const express = require("express");
const router = express.Router();
const { Feedback } = require("../models");

// Submit feedback
router.post("/", async (req, res) => {
  const { category, message } = req.body;
  const user_id = req.user ? req.user.id : null;

  try {
    const feedback = await Feedback.create({ user_id, category, message });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all feedback (admin only)
router.get("/", async (req, res) => {
  try {
    const feedback = await Feedback.findAll();
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
