const express = require("express");
const router = express.Router();
const { NotificationPreference } = require("../models");

// Get notification preferences for a user
router.get("/", async (req, res) => {
  try {
    const preferences = await NotificationPreference.findAll({ where: { user_id: req.user.id } });
    res.json(preferences);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update notification preferences
router.patch("/", async (req, res) => {
  const { type, in_app, email } = req.body;
  try {
    const preference = await NotificationPreference.findOne({
      where: { user_id: req.user.id, type },
    });

    if (preference) {
      preference.in_app = in_app ?? preference.in_app;
      preference.email = email ?? preference.email;
      await preference.save();
      res.json(preference);
    } else {
      const newPreference = await NotificationPreference.create({
        user_id: req.user.id,
        type,
        in_app,
        email,
      });
      res.json(newPreference);
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
