import { router } from '@/lib/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-helpers';

router.get('/api/feeds/exhibitionist', async (req, res) => {
  const viewer = await getSessionUser(req);
  const { cursor, limit = 20 } = req.query;

  const posts = await db.post.findMany({
    where: { visibility: 'public' },
    orderBy: { createdAt: 'desc' },
    take: Number(limit),
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });

  res.json({ posts });
});
