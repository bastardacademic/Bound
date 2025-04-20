// pages/api/posts/media.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import { z } from 'zod';
import { rateLimit } from '../../../lib/rateLimit';
import { EventEmitter } from 'events';

const events = new EventEmitter();

// Zod schema for request body
const MediaSchema = z.object({
  fileUrl: z.string().url(),
  caption: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
  privacy: z.enum([
    'PRIVATE', 'SHARED', 'PUBLIC', 'EROTICA', 'FRIENDS', 'CONSTELLATION'
  ]),
  taggedUsers: z.array(z.number()).optional(),
  ageConfirm: z.boolean().refine(val => val === true, {
    message: 'Age confirmation is required.'
  }),
});

// Transactional creation with nested consent events
async function createMediaPost(data: z.infer<typeof MediaSchema>, userId: number) {
  return prisma.$transaction(async (tx) => {
    // Normalize & upsert tags
    const tagOps = (data.tags ?? []).map((t) => ({
      where: { name: t.trim().toLowerCase() },
      create: { name: t.trim().toLowerCase() }
    }));

    // Create Post and MediaPost
    const post = await tx.post.create({
      data: {
        authorId: userId,
        type: 'media',
        privacy: data.privacy,
        tags: { connectOrCreate: tagOps },
        mediaMeta: {
          create: {
            fileUrl: data.fileUrl,
            caption: data.caption,
            ageConfirm: data.ageConfirm,
            taggedUsers: data.taggedUsers
              ? { connect: Array.from(new Set(data.taggedUsers)).map(id => ({ id })) }
              : undefined,
          }
        }
      },
      include: {
        mediaMeta: { include: { taggedUsers: true, consentEvents: true } },
        tags: true
      }
    });

    // Initialize consent entries for tagged users
    if (data.taggedUsers?.length) {
      const uniqueIds = Array.from(new Set(data.taggedUsers));
      await Promise.all(uniqueIds.map((uid) =>
        tx.consent.create({
          data: { mediaPostId: post.mediaMeta.id, userId: uid, approved: false }
        })
      ));
    }

    return post;
  });
}

// API handler
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

  const parse = MediaSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.format() });
  }

  try {
    const post = await createMediaPost(parse.data, session.user.id as number);
    events.emit('post.created', { postId: post.id, type: 'media' });
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating media post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
