const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const models = require("../models");
const { User, Post, Comment } = models;
const { anonymizeAndDeleteUser } = require("../accountDeletion");

router.use(authMiddleware);

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

// Delete user data (Right to be forgotten) — requires re-entering the password,
// since a stolen/reused session token shouldn't be enough to destroy an account.
router.delete("/delete", async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!password || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    await anonymizeAndDeleteUser(user, models);
    res.json({ message: "User data deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
