const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { User } = require('../models');
const router = express.Router();

// @route PUT /api/profile
// @desc Update user profile
// @access Private
router.put('/', authMiddleware, async (req, res) => {
  const { about_me, kinks_and_fetishes, privacy_settings, relationship_preferences } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    user.about_me = about_me || user.about_me;
    user.kinks_and_fetishes = kinks_and_fetishes || user.kinks_and_fetishes;
    user.privacy_settings = privacy_settings || user.privacy_settings;
    user.relationship_preferences = relationship_preferences || user.relationship_preferences;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/profile/:username
// @desc Fetch a user's profile, applying their privacy settings
// @access Private
router.get('/:username', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isSelf = req.user.id === user.id;
    const { privacy_settings } = user;

    // No friendship system exists yet, so "friends_only" is treated the same as
    // "private" for anyone other than the profile's own owner.
    const visible = (setting) => isSelf || setting === 'public' || setting === undefined;

    res.status(200).json({
      username: user.username,
      profile_picture: user.profile_picture,
      bio: visible(privacy_settings?.about_me) ? user.bio : null,
      about_me: visible(privacy_settings?.about_me) ? user.about_me : null,
      kinks_and_fetishes: visible(privacy_settings?.kinks_and_fetishes) ? user.kinks_and_fetishes : null,
      relationship_preferences: visible(privacy_settings?.relationship_status)
        ? user.relationship_preferences
        : null,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
