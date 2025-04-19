import { router } from '@/lib/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-helpers';

router.get('/api/profile/:username', async (req, res) => {
  const viewer = await getSessionUser(req);
  const { username } = req.params;

  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      pronouns: true,
      flair: true,
      role: true,
      isCommercial: true,
      bio: true,
      location: true,
      visibility: true,
      verified: true,
      linkedAccounts: true,
      createdAt: true
    },
  });

  if (!user) return res.status(404).json({ error: 'User not found' });

  let relationship = 'none';
  if (viewer?.id === user.id) relationship = 'self';
  else if (viewer) {
    const friend = await db.friend.findFirst({
      where: {
        userId: viewer.id,
        friendId: user.id,
      },
    });
    if (friend) relationship = 'friend';
  }

  res.json({ ...user, relationship });
});
