import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL!);
export const pollQueue = new Queue('pollExpiry', { connection });
export { connection };
