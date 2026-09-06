const express = require("express");
const { Op } = require("sequelize");
const authMiddleware = require("../middleware/authMiddleware");
const { Message, User } = require("../models");
const { getIO } = require("../socket");
const router = express.Router();

router.use(authMiddleware);

function toDTO(message) {
  return {
    id: message.id,
    senderId: message.sender_id,
    receiverId: message.receiver_id,
    content: message.content,
    isRead: message.is_read,
    isEphemeral: message.is_ephemeral,
    expiresAt: message.expires_at,
    reaction: message.reaction,
    createdAt: message.createdAt,
  };
}

// @route GET /api/messages
// @desc List conversations for the current user, one row per partner
router.get("/", async (req, res) => {
  try {
    const myId = req.user.id;
    const messages = await Message.findAll({
      where: { [Op.or]: [{ sender_id: myId }, { receiver_id: myId }] },
      order: [["createdAt", "DESC"]],
    });

    const conversations = new Map();
    for (const message of messages) {
      const partnerId = message.sender_id === myId ? message.receiver_id : message.sender_id;
      if (!conversations.has(partnerId)) {
        conversations.set(partnerId, { lastMessage: message.content, lastAt: message.createdAt, unread: 0 });
      }
      if (message.receiver_id === myId && !message.is_read) {
        conversations.get(partnerId).unread += 1;
      }
    }

    const partners = await User.findAll({
      where: { id: [...conversations.keys()] },
      attributes: ["id", "username"],
    });

    const result = partners
      .map((user) => ({
        id: user.id,
        name: user.username,
        unread: conversations.get(user.id).unread,
        lastMessage: conversations.get(user.id).lastMessage,
        lastAt: conversations.get(user.id).lastAt,
      }))
      .sort((a, b) => new Date(b.lastAt) - new Date(a.lastAt));

    res.status(200).json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route GET /api/messages/:userId
// @desc Fetch the thread with a specific user, marking their messages as read
router.get("/:userId", async (req, res) => {
  try {
    const myId = req.user.id;
    const partnerId = parseInt(req.params.userId, 10);
    if (Number.isNaN(partnerId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: myId, receiver_id: partnerId },
          { sender_id: partnerId, receiver_id: myId },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    await Message.update(
      { is_read: true },
      { where: { sender_id: partnerId, receiver_id: myId, is_read: false } }
    );

    res.status(200).json(messages.map(toDTO));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route POST /api/messages/:userId
// @desc Send a message to a specific user
router.post("/:userId", async (req, res) => {
  try {
    const myId = req.user.id;
    const partnerId = parseInt(req.params.userId, 10);
    const { content } = req.body;

    if (Number.isNaN(partnerId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    if (partnerId === myId) {
      return res.status(400).json({ message: "You can't message yourself" });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const partner = await User.findByPk(partnerId);
    if (!partner) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    const message = await Message.create({
      sender_id: myId,
      receiver_id: partnerId,
      content: content.trim(),
    });

    const dto = toDTO(message);
    getIO()?.to(`user:${partnerId}`).emit("message:new", dto);

    res.status(201).json(dto);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route POST /api/messages/:userId/:messageId/react
// @desc React to a message in the conversation
router.post("/:userId/:messageId/react", async (req, res) => {
  try {
    const myId = req.user.id;
    const { reaction } = req.body;

    const message = await Message.findByPk(req.params.messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    if (message.sender_id !== myId && message.receiver_id !== myId) {
      return res.status(403).json({ message: "Not part of this conversation" });
    }

    message.reaction = reaction || null;
    await message.save();

    const dto = toDTO(message);
    const otherId = message.sender_id === myId ? message.receiver_id : message.sender_id;
    getIO()?.to(`user:${otherId}`).emit("message:reaction", dto);

    res.status(200).json(dto);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route DELETE /api/messages/:userId/:messageId
// @desc Delete a message you sent
router.delete("/:userId/:messageId", async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    if (message.sender_id !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own messages" });
    }

    const otherId = message.receiver_id;
    const messageId = message.id;
    await message.destroy();

    getIO()?.to(`user:${otherId}`).emit("message:deleted", { id: messageId });
    res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
