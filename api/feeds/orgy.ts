import { router } from '@/lib/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware/auth';

router.get('/api/feeds/orgy', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { cursor, limit = 20 } = req.query;

  const groupMemberships = await db.groupMember.findMany({
    where: { userId },
    select: { groupId: true },
  });

  const groupIds = groupMemberships.map(g => g.groupId);

  const posts = await db.post.findMany({
    where: {
      groupId: { in: groupIds },
      visibility: { in: ['group', 'friend', 'mutual', 'constellation', 'public'] },
    },
    orderBy: { createdAt: 'desc' },
    take: Number(limit),
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });

  res.json({ posts });
});
