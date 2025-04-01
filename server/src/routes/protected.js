const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// @route GET /api/protected
// @desc Example of a protected route
router.get('/', authMiddleware, (req, res) => {
  res.status(200).json({ message: Welcome, ! });
});

module.exports = router;
