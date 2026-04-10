import { NextApiRequest, NextApiResponse } from 'next';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL!);
const queue = new Queue('pollExpiry', { connection });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only admins
  // TODO: verify admin session

  const jobs = await queue.getJobs(['waiting','failed','active']);
  res.json(jobs.map(j => ({ id: j.id, name: j.name, data: j.data, state: j.state })));  
}
