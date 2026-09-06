const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { Group, Post, User } = require("../models");
const router = express.Router();

router.use(authMiddleware);

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

// Get a single group with its recent posts
router.get("/:id", async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const posts = await Post.findAll({
      where: { group_id: group.id },
      include: { model: User, attributes: ["id", "username", "profile_picture"] },
      order: [["createdAt", "DESC"]],
      limit: 20,
    });

    res.json({ group, posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
