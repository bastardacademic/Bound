import { NextApiRequest, NextApiResponse } from 'next';
import webpush from 'web-push';
import prisma from '../../../lib/prisma';

webpush.setVapidDetails(
  'mailto:admin@bound.app',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { title, body } = req.body;
  const subs = await prisma.pushSubscription.findMany();
  await Promise.all(subs.map(s =>
    webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, JSON.stringify({ title, body }))
      .catch(console.error)
  ));
  res.status(200).end();
}
