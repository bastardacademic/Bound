import { router } from '@/lib/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware/auth';

router.post('/api/chat/:threadId/view/:messageId', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { threadId, messageId } = req.params;

  const isMember = await db.threadMember.findFirst({
    where: { threadId, userId },
  });

  if (!isMember) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const message = await db.chatMessage.findUnique({
    where: { id: messageId },
  });

  if (!message || !message.burnOnView) {
    return res.status(400).json({ error: 'Message is not burn-on-view or not found.' });
  }

  const updated = await db.chatMessage.update({
    where: { id: messageId },
    data: { viewedAt: new Date() },
  });

  res.json({ viewedAt: updated.viewedAt });
});
