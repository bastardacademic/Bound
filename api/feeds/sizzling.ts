import { router } from '@/lib/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-helpers';
import { subDays } from 'date-fns';

router.get('/api/feeds/sizzling', async (req, res) => {
  const viewer = await getSessionUser(req);
  const { limit = 20 } = req.query;

  const since = subDays(new Date(), 2);

  const posts = await db.post.findMany({
    where: {
      visibility: 'public',
      likes: {
        some: {
          createdAt: { gte: since },
        },
      },
    },
    orderBy: [
      { likes: { _count: 'desc' } },
      { createdAt: 'desc' },
    ],
    take: Number(limit),
    include: { _count: { select: { likes: true } } },
  });

  res.json({ posts });
});
