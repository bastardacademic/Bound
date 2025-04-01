const express = require("express");
const router = express.Router();
const { Event } = require("../models");

// Create a new event
router.post("/", async (req, res) => {
  const { title, description, location, start_date, end_date, visibility, group_id } = req.body;
  try {
    const event = await Event.create({
      title,
      description,
      location,
      start_date,
      end_date,
      visibility,
      group_id,
      created_by: req.user.id,
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
