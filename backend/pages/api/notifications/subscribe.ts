import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { subscription } = req.body;
  // store subscription per user
  // TODO: associate with session user
  await prisma.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    update: { keys: subscription.keys },
    create: { endpoint: subscription.endpoint, keys: subscription.keys }
  });
  res.status(201).end();
}
