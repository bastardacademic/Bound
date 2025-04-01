const express = require("express");
const router = express.Router();
const { Notification } = require("../models");

// Get all notifications for a user
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.findAll({ where: { user_id: req.user.id } });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Mark a notification as read
router.patch("/:id", async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    notification.is_read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
