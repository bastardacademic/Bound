const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { Post, User } = require('../models');
const { Op } = require('sequelize');
const router = express.Router();

// @route POST /api/posts
// @desc Create a post
// @access Private
router.post('/', authMiddleware, async (req, res) => {
  const { content, media_url, tags, visibility } = req.body;

  try {
    const post = await Post.create({
      author_id: req.user.id,
      content,
      media_url,
      tags,
      visibility,
    });

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/posts
// @desc Fetch posts for discovery feeds
// @access Public
router.get('/', async (req, res) => {
  const { tags, visibility, sort, page = 1, limit = 10 } = req.query;

  try {
    const whereClause = {};

    if (tags) whereClause.tags = { [Op.contains]: tags.split(',') };
    if (visibility) whereClause.visibility = visibility;

    const posts = await Post.findAll({
      where: whereClause,
      include: {
        model: User,
        attributes: ['id', 'username', 'profile_picture'],
      },
      order: sort === 'most_liked' ? [['likes', 'DESC']] : [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    res.status(200).json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/posts/:id
// @desc Fetch a specific post
// @access Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ['id', 'username', 'profile_picture'],
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route DELETE /api/posts/:id
// @desc Delete a post
// @access Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await post.destroy();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
