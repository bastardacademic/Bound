const express = require("express");
const router = express.Router();
const { Post, Comment, User, Report } = require("../models");

// Fetch top posts by comments
router.get("/top-posts", async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: Comment }],
      order: [["comments_count", "DESC"]],
      limit: 10,
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch top reported users
router.get("/top-reported-users", async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Report }],
      order: [["reports_count", "DESC"]],
      limit: 10,
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
