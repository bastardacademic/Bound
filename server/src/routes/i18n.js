// i18n API Endpoints
const express = require("express");
const { UserPreference } = require("../models");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Get user preferences
router.get("/", authMiddleware, async (req, res) => {
  try {
    const preferences = await UserPreference.findOne({ where: { user_id: req.user.id } });
    if (!preferences) return res.status(404).json({ message: "Preferences not found" });

    res.status(200).json(preferences);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user preferences
router.patch("/", authMiddleware, async (req, res) => {
  const { language, contrast_mode, font_size } = req.body;

  try {
    const preferences = await UserPreference.findOne({ where: { user_id: req.user.id } });

    if (preferences) {
      preferences.language = language || preferences.language;
      preferences.contrast_mode = contrast_mode ?? preferences.contrast_mode;
      preferences.font_size = font_size || preferences.font_size;
      await preferences.save();
    } else {
      await UserPreference.create({
        user_id: req.user.id,
        language,
        contrast_mode,
        font_size
      });
    }

    res.status(200).json({ message: "Preferences updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
