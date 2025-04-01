const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { Message, Sequelize } = require("../models");
const router = express.Router();

// Add endpoints for sending, fetching, reacting, and deleting messages
module.exports = router;
