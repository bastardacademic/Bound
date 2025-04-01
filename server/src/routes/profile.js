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

// @route GET /api/profile/:id
// @desc Fetch user profile
// @access Private
router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: ['username', 'about_me', 'kinks_and_fetishes', 'relationship_preferences'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { privacy_settings } = user;
    const isFriend = req.user.friends.includes(user.id); // Example: Check if the user is a friend.

    // Apply privacy settings
    const filteredUser = {
      username: user.username,
      about_me: privacy_settings?.about_me === 'friends_only' && !isFriend ? null : user.about_me,
      kinks_and_fetishes: privacy_settings?.kinks_and_fetishes === 'private' ? null : user.kinks_and_fetishes,
      relationship_preferences: user.relationship_preferences,
    };

    res.status(200).json(filteredUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
