import { router } from '@/lib/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware/auth';

router.get('/api/feeds/personal', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { cursor, limit = 20 } = req.query;

  const followingIds = await db.follower.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const friendIds = await db.friend.findMany({
    where: { userId },
    select: { friendId: true },
  });

  const ids = [
    userId,
    ...followingIds.map(f => f.followingId),
    ...friendIds.map(f => f.friendId),
  ];

  const posts = await db.post.findMany({
    where: {
      authorId: { in: ids },
      visibility: { in: ['public', 'friend', 'mutual'] },
    },
    orderBy: { createdAt: 'desc' },
    take: Number(limit),
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });

  res.json({ posts });
});
