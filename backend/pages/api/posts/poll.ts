// pages/api/posts/poll.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import { z } from 'zod';
import { rateLimit } from '../../../lib/rateLimit';
import { EventEmitter } from 'events';

const events = new EventEmitter();

// Zod schema for poll posts
const PollSchema = z.object({
  question: z.string().min(1, 'Question is required').max(500),
  options: z
    .array(z.string().min(1, 'Option text cannot be empty'))
    .min(2, 'At least two options required'),
  tags: z.array(z.string()).optional(),
  expiresAt: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), 'Invalid expiration date'),
  privacy: z.enum([
    'PRIVATE', 'SHARED', 'PUBLIC', 'EROTICA', 'FRIENDS', 'CONSTELLATION',
  ]),
});

// Transactional creation of a poll post
async function createPollPost(
  data: z.infer<typeof PollSchema>,
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
        type: 'poll',
        privacy: data.privacy,
        tags: { connectOrCreate: tagOps },
        pollMeta: {
          create: {
            question: data.question,
            expiresAt: new Date(data.expiresAt),
            options: { create: data.options.map(opt => ({ text: opt })) },
          },
        },
      },
      include: { tags: true, pollMeta: { include: { options: true } } },
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

  const parse = PollSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.format() });
  }

  try {
    const post = await createPollPost(parse.data, session.user.id as number);
    events.emit('post.created', { postId: post.id, type: 'poll' });
    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating poll post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
