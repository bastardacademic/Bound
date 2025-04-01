const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { User, Profile } = require('../models');
const router = express.Router();

// @route GET /api/user/me
// @desc Get the current user's profile
// @access Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: Profile,
      attributes: { exclude: ['password', 'refresh_token'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route PUT /api/user/me
// @desc Update the current user's profile
// @access Private
router.put('/me', authMiddleware, async (req, res) => {
  const { bio, location, kinks, relationship_status, looking_for, tags } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (bio) user.bio = bio;
    if (location) user.location = location;
    await user.save();

    let profile = await Profile.findOne({ where: { user_id: req.user.id } });
    if (!profile) {
      profile = await Profile.create({
        user_id: req.user.id,
        kinks,
        relationship_status,
        looking_for,
        tags,
      });
    } else {
      if (kinks) profile.kinks = kinks;
      if (relationship_status) profile.relationship_status = relationship_status;
      if (looking_for) profile.looking_for = looking_for;
      if (tags) profile.tags = tags;
      await profile.save();
    }

    res.status(200).json({ message: 'Profile updated successfully', user, profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/user/:id
// @desc View another user's public profile
// @access Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: Profile,
      attributes: ['id', 'username', 'profile_picture', 'bio', 'location', 'visibility'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.visibility === 'private') {
      return res.status(403).json({ message: 'This profile is private' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
