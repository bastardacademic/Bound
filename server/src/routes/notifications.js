const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { Notification, PushSubscription } = require("../models");

router.use(authMiddleware);

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

// Register a browser push subscription for the current user
router.post("/subscribe", async (req, res) => {
  const { subscription } = req.body;
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return res.status(400).json({ message: "Invalid push subscription" });
  }

  try {
    const [record] = await PushSubscription.findOrCreate({
      where: { endpoint: subscription.endpoint },
      defaults: {
        user_id: req.user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    });

    // Same endpoint re-subscribing under a different account (e.g. shared browser)
    if (record.user_id !== req.user.id) {
      record.user_id = req.user.id;
      record.p256dh = subscription.keys.p256dh;
      record.auth = subscription.keys.auth;
      await record.save();
    }

    res.status(201).json({ message: "Subscribed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove a browser push subscription
router.delete("/subscribe", async (req, res) => {
  const { endpoint } = req.body;
  if (!endpoint) {
    return res.status(400).json({ message: "endpoint is required" });
  }

  try {
    await PushSubscription.destroy({ where: { endpoint, user_id: req.user.id } });
    res.status(200).json({ message: "Unsubscribed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
