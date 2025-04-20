// pages/api/posts/status.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import { z } from 'zod';
import { rateLimit } from '../../../lib/rateLimit';
import { EventEmitter } from 'events';

const events = new EventEmitter();

// Zod schema for status posts
const StatusSchema = z.object({
  text: z.string().min(1, 'Text is required').max(1000),
  tags: z.array(z.string()).optional(),
  privacy: z.enum([
    'PRIVATE', 'SHARED', 'PUBLIC', 'EROTICA', 'FRIENDS', 'CONSTELLATION',
  ]),
});

// Transactional creation of a status post
async function createStatusPost(
  data: z.infer<typeof StatusSchema>,
  userId: number
) {
  return prisma.$transaction(async (tx) => {
    const tagOps = (data.tags ?? []).map((t) => ({
      where: { name: t.trim().toLowerCase() },
      create: { name: t.trim().toLowerCase() },
    }));

    return tx.post.create({
      data: {
        authorId: userId,
        type: 'status',
        privacy: data.privacy,
        text: data.text,
        tags: { connectOrCreate: tagOps },
        statusMeta: { create: { text: data.text } },
      },
      include: { tags: true, statusMeta: true },
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await rateLimit(req, res);

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const parse = StatusSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.format() });
  }

  try {
    const post = await createStatusPost(parse.data, session.user.id as number);
    events.emit('post.created', { postId: post.id, type: 'status' });
    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating status post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
