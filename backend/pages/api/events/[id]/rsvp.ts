import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: 'Auth required' });
  const eventId = parseInt(req.query.id as string, 10);
  if (req.method === 'POST') {
    // Toggle RSVP: if exists, remove; else create
    const existing = await prisma.rsvp.findUnique({ where: { userId_eventId: { userId: session.user.id, eventId } } });
    if (existing) {
      await prisma.rsvp.delete({ where: { id: existing.id } });
      return res.json({ rsvped: false });
    } else {
      await prisma.rsvp.create({ data: { userId: session.user.id, eventId } });
      return res.json({ rsvped: true });
    }
  }
  res.setHeader('Allow', ['POST']);
  res.status(405).end();
}
