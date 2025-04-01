const express = require("express");
const router = express.Router();
const { Poll } = require("../models");

// Create a poll
router.post("/", async (req, res) => {
  const { question, options, is_multiple, visibility } = req.body;

  try {
    const poll = await Poll.create({
      question,
      options,
      is_multiple,
      visibility,
      created_by: req.user.id,
    });
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all polls
router.get("/", async (req, res) => {
  try {
    const polls = await Poll.findAll();
    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
