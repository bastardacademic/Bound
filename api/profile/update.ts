import { router } from '@/lib/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/middleware/auth';

router.patch('/api/profile', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const {
    displayName,
    pronouns,
    bio,
    location,
    visibility,
    flair,
    linkedAccounts
  } = req.body;

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (user.isCommercial) {
    const allowed = ['Merchant', 'Model'];
    if (!allowed.includes(flair)) {
      return res.status(400).json({ error: 'Commercial accounts must choose Merchant or Model as flair.' });
    }
  }

  const updated = await db.user.update({
    where: { id: userId },
    data: {
      displayName,
      pronouns,
      bio,
      location,
      visibility,
      flair,
      linkedAccounts
    },
  });

  res.json({ updated });
});
