import { NextApiRequest, NextApiResponse } from 'next';
import emitter from '../../src/lib/eventEmitter';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end();
  }
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  const onPost = (data: any) => {
    res.write(data: \n\n);
  };
  emitter.on('post.created', onPost);
  req.on('close', () => {
    emitter.off('post.created', onPost);
    res.end();
  });
}
