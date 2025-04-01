const express = require("express");
const router = express.Router();
const { UserPreference } = require("../models");

// Get user preferences
router.get("/", async (req, res) => {
  try {
    const preferences = await UserPreference.findOne({ where: { user_id: req.user.id } });
    if (!preferences) {
      return res.status(404).json({ message: "Preferences not found" });
    }
    res.json(preferences);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user preferences
router.put("/", async (req, res) => {
  const { language, high_contrast_mode, font_size } = req.body;
  try {
    let preferences = await UserPreference.findOne({ where: { user_id: req.user.id } });
    if (!preferences) {
      preferences = await UserPreference.create({
        user_id: req.user.id,
        language,
        high_contrast_mode,
        font_size,
      });
    } else {
      preferences.language = language ?? preferences.language;
      preferences.high_contrast_mode = high_contrast_mode ?? preferences.high_contrast_mode;
      preferences.font_size = font_size ?? preferences.font_size;
      await preferences.save();
    }
    res.json(preferences);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
