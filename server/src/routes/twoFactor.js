const express = require('express');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const authMiddleware = require('../middleware/authMiddleware');
const { User } = require('../models');
const router = express.Router();

router.use(authMiddleware);

// @route POST /api/2fa/setup
// @desc Generate a new TOTP secret for the current user. Not enabled until
// confirmed via /verify — a half-finished setup shouldn't lock anyone out.
router.post('/setup', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const secret = speakeasy.generateSecret({
      name: `Bound (${user.username})`,
    });

    user.totp_secret = secret.base32;
    user.totp_enabled = false;
    await user.save();

    res.status(200).json({ secret: secret.base32, otpauth_url: secret.otpauth_url });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/2fa/verify
// @desc Confirm the pending secret with a real code and turn 2FA on
router.post('/verify', async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user.totp_secret) {
      return res.status(400).json({ message: 'No pending 2FA setup for this account' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.totp_secret,
      encoding: 'base32',
      token,
      window: 1,
    });
    if (!verified) {
      return res.status(400).json({ message: 'Invalid authentication code' });
    }

    user.totp_enabled = true;
    await user.save();
    res.status(200).json({ message: '2FA enabled' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/2fa/disable
// @desc Turn 2FA off — requires the account password, same as account deletion
router.post('/disable', async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    if (!password || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    user.totp_secret = null;
    user.totp_enabled = false;
    await user.save();
    res.status(200).json({ message: '2FA disabled' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
