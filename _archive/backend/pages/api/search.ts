import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
export default async function handler(req: NextApiRequest,res: NextApiResponse){
  const { q } = req.query;
  const posts = await prisma.$queryRaw`SELECT * FROM "Post" WHERE to_tsvector(text || ' ' || coalesce((SELECT string_agg(name, ' ') FROM "PostTags" pt JOIN "Tag" t ON pt."tagId"=t.id WHERE pt."postId"=id), '')) @@ plainto_tsquery(${q})`;
  res.json(posts);
}
