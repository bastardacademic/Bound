// SSE endpoint for real-time post events
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });

  const send = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // TODO: subscribe to post.created events
  // e.g., eventEmitter.on('post.created', send);

  req.on('close', () => {
    // TODO: cleanup subscription
    res.end();
  });
}
