const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { Comment, User } = require('../models');
const router = express.Router();

router.post('/:id/comments', authMiddleware, async (req, res) => {
  const { id: post_id } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.create({
      user_id: req.user.id,
      post_id,
      content,
    });

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id/comments', async (req, res) => {
  const { id: post_id } = req.params;

  try {
    const comments = await Comment.findAll({
      where: { post_id },
      include: { model: User, attributes: ['id', 'username', 'profile_picture'] },
    });

    res.status(200).json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id/comments/:commentId', authMiddleware, async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }

    await comment.destroy();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
