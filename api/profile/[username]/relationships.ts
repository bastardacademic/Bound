import { router } from '@/lib/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware/auth';

router.get('/api/profile/:username/relationships', requireAuth, async (req, res) => {
  const viewerId = req.user.id;
  const { username } = req.params;

  const target = await db.user.findUnique({ where: { username }, select: { id: true } });
  if (!target) return res.status(404).json({ error: 'User not found' });

  const targetId = target.id;

  const [youFollowThem, theyFollowYou, isFriend, mutualCount] = await Promise.all([
    db.follower.findFirst({ where: { followerId: viewerId, followingId: targetId } }),
    db.follower.findFirst({ where: { followerId: targetId, followingId: viewerId } }),
    db.friend.findFirst({ where: { userId: viewerId, friendId: targetId } }),
    db.friend.count({
      where: {
        userId: viewerId,
        friend: {
          friendOf: {
            some: { userId: targetId },
          },
        },
      },
    })
  ]);

  res.json({
    isFriend: !!isFriend,
    youFollowThem: !!youFollowThem,
    theyFollowYou: !!theyFollowYou,
    isMutual: !!youFollowThem && !!theyFollowYou,
    mutualFriends: mutualCount || 0
  });
});
