const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { Reaction } = require('../models');
const router = express.Router();

router.post('/:id/reactions', authMiddleware, async (req, res) => {
  const { id: post_id } = req.params;
  const { type } = req.body;

  try {
    const reaction = await Reaction.create({
      user_id: req.user.id,
      post_id,
      type,
    });

    res.status(201).json({ message: 'Reaction added successfully', reaction });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id/reactions', async (req, res) => {
  const { id: post_id } = req.params;

  try {
    const reactions = await Reaction.findAll({ where: { post_id } });
    res.status(200).json(reactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
