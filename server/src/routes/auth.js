const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const { body, validationResult } = require('express-validator');
const passwordValidator = require('../middleware/passwordValidator');
const { User } = require('../models');
const router = express.Router();

function toSafeUser(user) {
  const { password, totp_secret, ...safe } = user.toJSON();
  return safe;
}

const MIN_AGE = 18;

function isAtLeastMinAge(dateString) {
  const dob = new Date(dateString);
  if (Number.isNaN(dob.getTime())) return false;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;

  return age >= MIN_AGE;
}

// @route POST /api/auth/register
// @desc Register a new user
router.post(
  '/register',
  [
    body('username').isString().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').custom((value) => {
      const result = passwordValidator(value);
      if (!result.valid) throw new Error(result.message);
      return true;
    }),
    body('date_of_birth').isISO8601().withMessage('A valid date of birth is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, date_of_birth } = req.body;

    if (!isAtLeastMinAge(date_of_birth)) {
      return res.status(403).json({ message: `You must be at least ${MIN_AGE} to register.` });
    }

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({ username, email, password: hashedPassword, date_of_birth });
      res.status(201).json({ message: 'User registered successfully', user: toSafeUser(user) });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route POST /api/auth/login
// @desc Log in a user. If the account has 2FA enabled, a request without a
// valid totpToken gets requires2FA: true instead of a session token.
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').exists().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, totpToken } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      if (user.banned_until && new Date(user.banned_until) > new Date()) {
        return res.status(403).json({
          message: `Account suspended until ${new Date(user.banned_until).toISOString()}`,
        });
      }

      if (user.totp_enabled) {
        if (!totpToken) {
          return res.status(200).json({ requires2FA: true });
        }
        const verified = speakeasy.totp.verify({
          secret: user.totp_secret,
          encoding: 'base32',
          token: totpToken,
          window: 1,
        });
        if (!verified) {
          return res.status(400).json({ message: 'Invalid authentication code' });
        }
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ token, user: toSafeUser(user) });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
