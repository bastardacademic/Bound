import { router } from '@/lib/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware/auth';

router.post('/api/chat/:threadId/send', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { threadId } = req.params;
  const { content, mediaUrl, burnOnView = false } = req.body;

  if (!content && !mediaUrl) {
    return res.status(400).json({ error: 'Message content or media is required.' });
  }

  const isMember = await db.threadMember.findFirst({
    where: { threadId, userId },
  });

  if (!isMember) {
    return res.status(403).json({ error: 'You are not a participant in this thread.' });
  }

  const message = await db.chatMessage.create({
    data: {
      threadId,
      senderId: userId,
      content,
      mediaUrl,
      burnOnView,
    },
  });

  res.status(201).json({ message });
});
