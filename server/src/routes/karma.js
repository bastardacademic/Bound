const express = require("express");
const router = express.Router();
const { KarmaPoints, User } = require("../models");

// Get user karma points
router.get("/:userId", async (req, res) => {
  try {
    const karma = await KarmaPoints.findAll({ where: { user_id: req.params.userId } });
    res.json(karma);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add karma points
router.post("/", async (req, res) => {
  const { user_id, points, reason } = req.body;
  try {
    const karma = await KarmaPoints.create({ user_id, points, reason });
    res.status(201).json(karma);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
