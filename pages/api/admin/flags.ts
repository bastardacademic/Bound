import { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '../../../src/lib/middleware/adminAuth';
import prisma from '../../../lib/prisma';

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // TODO: implement actual flagged logic; stub
    const flags = await prisma.post.findMany({ where: { flagged: true }, include: { author: true } });
    return res.json(flags);
  } else if (req.method === 'POST') {
    const { postId, action } = req.body;
    if (action === 'remove') {
      await prisma.post.update({ where: { id: postId }, data: { flagged: false, removed: true } });
    } else if (action === 'approve') {
      await prisma.post.update({ where: { id: postId }, data: { flagged: false } });
    }
    return res.status(200).end();
  }
  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end();
});
