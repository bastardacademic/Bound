const express = require("express");
const router = express.Router();
const { Group } = require("../models");

// Create a new group
router.post("/", async (req, res) => {
  const { name, description, visibility } = req.body;
  try {
    const group = await Group.create({
      name,
      description,
      visibility,
      created_by: req.user.id,
    });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all groups
router.get("/", async (req, res) => {
  try {
    const groups = await Group.findAll();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
