import { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '../../../src/lib/middleware/adminAuth';
import prisma from '../../../lib/prisma';

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, suspended: true } });
    return res.json(users);
  } else if (req.method === 'POST') {
    const { userId, suspend } = req.body;
    await prisma.user.update({ where: { id: userId }, data: { suspended: suspend } });
    return res.status(200).end();
  }
  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end();
});
