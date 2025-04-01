const express = require("express");
const router = express.Router();
const { Tag, Post } = require("../models");

// Get all tags
router.get("/", async (req, res) => {
  try {
    const tags = await Tag.findAll();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add tags to a post
router.post("/:post_id", async (req, res) => {
  const { tags } = req.body;

  try {
    const post = await Post.findByPk(req.params.post_id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const tagInstances = await Promise.all(
      tags.map((tag) => Tag.findOrCreate({ where: { name: tag } }))
    );

    await post.addTags(tagInstances.map(([tag]) => tag));
    res.status(201).json({ message: "Tags added to post" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
