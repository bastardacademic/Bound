import { router } from '@/lib/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware/auth';

router.get('/api/chat/dm/:partnerId', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { partnerId } = req.params;

  if (userId === partnerId) {
    return res.status(400).json({ error: 'Cannot start a DM with yourself.' });
  }

  const existing = await db.thread.findFirst({
    where: {
      isPrivate: true,
      members: {
        every: {
          userId: { in: [userId, partnerId] },
        },
      },
    },
    include: {
      members: true,
    },
  });

  if (existing) return res.json({ thread: existing });

  const thread = await db.thread.create({
    data: {
      isPrivate: true,
      members: {
        create: [
          { userId },
          { userId: partnerId },
        ],
      },
    },
    include: {
      members: true,
    },
  });

  res.json({ thread });
});
