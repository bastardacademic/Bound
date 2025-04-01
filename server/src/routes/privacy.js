const express = require("express");
const router = express.Router();
const { User, Post, Comment } = require("../models");

// Export user data
router.get("/export", async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [Post, Comment],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      posts: user.Posts,
      comments: user.Comments,
    };

    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user data (Right to be forgotten)
router.delete("/delete", async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.json({ message: "User data deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
