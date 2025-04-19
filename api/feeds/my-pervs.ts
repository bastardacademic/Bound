import { router } from '@/lib/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware/auth';

router.get('/api/feeds/my-pervs', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { cursor, limit = 20 } = req.query;

  const followedTags = await db.tagFollow.findMany({
    where: { userId },
    select: { tagId: true },
  });

  const likedTags = await db.postLike.findMany({
    where: { userId },
    include: {
      post: { select: { tags: { select: { tagId: true } } } },
    },
  });

  const tagIds = new Set([
    ...followedTags.map(f => f.tagId),
    ...likedTags.flatMap(like => like.post.tags.map(t => t.tagId))
  ]);

  const posts = await db.post.findMany({
    where: {
      tags: {
        some: { tagId: { in: Array.from(tagIds) } },
      },
      visibility: { in: ['public', 'friend', 'mutual', 'constellation'] },
    },
    orderBy: [
      { createdAt: 'desc' },
    ],
    take: Number(limit),
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    include: { tags: true },
  });

  res.json({ posts });
});
