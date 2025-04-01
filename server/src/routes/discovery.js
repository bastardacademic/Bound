const express = require("express");
const router = express.Router();
const { Post, User, Tag } = require("../models");

// Sizzling feed (most liked posts)
router.get("/sizzling", async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [["likes_count", "DESC"]],
      limit: 10,
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// New feed (latest posts)
router.get("/new", async (req, res) => {
  try {
    const posts = await Post.findAll({ order: [["createdAt", "DESC"]], limit: 10 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Perv-sonal feed (based on user preferences)
router.get("/perv-sonal", async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { include: { model: Tag } });
    const tags = user.Tags.map((tag) => tag.id);

    const posts = await Post.findAll({
      include: { model: Tag, where: { id: tags } },
      limit: 10,
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
