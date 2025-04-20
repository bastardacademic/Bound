// pages/api/posts/[type].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import { z } from 'zod';
import { rateLimit } from '../../../lib/rateLimit';
import { EventEmitter } from 'events';

const events = new EventEmitter();

type PostType = 'journal' | 'media' | 'status' | 'poll';

const BasePostSchema = z.object({
  tags: z.array(z.string().min(1)).optional(),
  privacy: z.enum(['PRIVATE','SHARED','PUBLIC','EROTICA','FRIENDS','CONSTELLATION']),
});

const JournalSchema = BasePostSchema.extend({
  text: z.string().min(1).max(5000),
  category: z.enum(['Private','Shared','Erotica','Public']),
});

const schemaMap: Record<PostType, any> = {
  journal: JournalSchema,
  media: z.object({ /* file, tags, privacy, taggedUsers, ageConfirm */ }),
  status: z.object({ text: z.string().min(1), tags: z.array(z.string()).optional() }),
  poll: z.object({ question: z.string().min(1), options: z.array(z.string().min(1)), tags: z.array(z.string()).optional(), expiresAt: z.string().refine(d => !isNaN(Date.parse(d)), 'Invalid date') }),
};

function withErrorHandling(fn: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try { await fn(req,res); }
    catch (e) { console.error(e); res.status(500).json({ error: 'Internal server error' }); }
  };
}

export default withErrorHandling(async function handler(req: NextApiRequest,res: NextApiResponse) {
  await rateLimit(req,res);
  if (req.method !== 'POST') return res.status(405).setHeader('Allow',['POST']).end();
  const session = await getSession({ req });
  if (!session?.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  const type = Array.isArray(req.query.type) ? req.query.type[0] : req.query.type;
  if (!schemaMap[type as PostType]) return res.status(400).json({ error: 'Invalid post type' });

  const parsed = schemaMap[type as PostType].safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data = parsed.data;

  const tagOps = (data.tags||[]).map(t=>({ where:{name:t.trim().toLowerCase()}, create:{name:t.trim().toLowerCase()} }));

  const post = await prisma.post.create({ data: {
    authorId: Number(session.user.id), type, text: (data as any).text, privacy: data.privacy,
    category: (data as any).category, tags:{ connectOrCreate:tagOps }
  }});

  events.emit('post.created',{ postId:post.id, type });
  res.status(201).json(post);
});
