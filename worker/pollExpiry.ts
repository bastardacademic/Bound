import { initTracing } from '../src/lib/telemetry';
initTracing();
import { Worker } from 'bullmq';
import { connection } from '../src/lib/queue';
import prisma from '../backend/lib/prisma';

new Worker('pollExpiry', async job => {
  const { pollId } = job.data;
  // mark poll expired
  await prisma.pollPost.update({ where: { id: pollId }, data: { expires: true } });
  // tally or send event
}, { connection });

