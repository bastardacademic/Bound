import { router } from '@/lib/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-helpers';

router.get('/api/profile/:username/posts', async (req, res) => {
  const viewer = await getSessionUser(req);
  const { username } = req.params;
  const { type, pinned } = req.query;

  const user = await db.user.findUnique({
    where: { username },
    select: { id: true, visibility: true },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const viewerId = viewer?.id ?? null;
  const isSelf = viewerId === user.id;
  let relationship: 'public' | 'friend' | 'mutual' | 'constellation' = 'public';

  if (viewerId && !isSelf) {
    const friend = await db.friend.findFirst({ where: { userId: viewerId, friendId: user.id } });
    const back = await db.friend.findFirst({ where: { userId: user.id, friendId: viewerId } });
    if (friend && back) relationship = 'mutual';
    else if (friend || back) relationship = 'friend';
  }

  const visibilityFilter = isSelf
    ? {}
    : { visibility: { in: ['public', relationship] } };

  const where: any = {
    authorId: user.id,
    ...(type ? { type } : {}),
    ...(pinned === 'true' ? { pinned: true } : {}),
    ...visibilityFilter,
  };

  const posts = await db.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 25,
  });

  res.json({ posts });
});
