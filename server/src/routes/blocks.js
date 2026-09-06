const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { Block, User } = require("../models");

router.use(authMiddleware);

// @route GET /api/blocks
// @desc List users the current user has blocked
router.get("/", async (req, res) => {
  try {
    const blocks = await Block.findAll({
      where: { blocker_id: req.user.id },
      include: { model: User, as: "blocked", attributes: ["id", "username"] },
    });
    res.json(blocks);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route POST /api/blocks
// @desc Block another user
router.post("/", async (req, res) => {
  const blockedId = parseInt(req.body.blocked_id, 10);

  if (Number.isNaN(blockedId)) {
    return res.status(400).json({ message: "blocked_id is required" });
  }
  if (blockedId === req.user.id) {
    return res.status(400).json({ message: "You can't block yourself" });
  }

  try {
    const [block] = await Block.findOrCreate({
      where: { blocker_id: req.user.id, blocked_id: blockedId },
    });
    res.status(201).json(block);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route DELETE /api/blocks/:userId
// @desc Unblock a user
router.delete("/:userId", async (req, res) => {
  try {
    await Block.destroy({
      where: { blocker_id: req.user.id, blocked_id: req.params.userId },
    });
    res.json({ message: "Unblocked" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
