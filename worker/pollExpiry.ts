import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import prisma from '../backend/lib/prisma';

const connection = new Redis(process.env.REDIS_URL!);
const queue = new Queue('pollExpiry', { connection });

new Worker('pollExpiry', async job => {
  const { pollMetaId } = job.data;
  // Expire poll: tally votes or emit event
  await prisma.pollPost.update({ where: { id: pollMetaId }, data: { expires: true } });
  // TODO: publish 'poll.expired' event
}, { connection });

// Schedule: check every minute for expired polls
(async () => {
  await queue.add('check', {}, { repeat: { cron: '* * * * *' } });
})();
