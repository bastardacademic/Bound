const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const router = express.Router();

// @route POST /api/auth/request-password-reset
// @desc Request a password reset link
router.post('/request-password-reset', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 3600000;

    user.password_reset_token = token;
    user.password_reset_expires = new Date(expires);
    await user.save();

    res.status(200).json({ message: 'Password reset link sent', token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/auth/reset-password
// @desc Reset the password using the token
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      where: { password_reset_token: token, password_reset_expires: { [Op.gt]: Date.now() } },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.password_reset_token = null;
    user.password_reset_expires = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
