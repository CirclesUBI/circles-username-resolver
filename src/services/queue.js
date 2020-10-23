import Queue from 'bull';

const redis = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;

const redisOpts = {
  settings: {
    lockDuration: 30 * SECONDS, // Key expiration time for job locks.
    stalledInterval: 30000, // How often check for stalled jobs (use 0 for never checking).
    maxStalledCount: 1, // Max amount of times a stalled job will be re-processed.
    guardInterval: 5000, // Poll interval for delayed jobs and added jobs.s
    retryProcessDelay: 5000, // delay before processing next job in case of internal error.
  },
};
const redisLongRunningOpts = {
  settings: {
    lockDuration: 30 * MINUTES,
    lockRenewTime: 15000,
    stalledInterval: 60000,
    maxStalledCount: 2,
    guardInterval: 10000,
    retryProcessDelay: 15000,
  },
};

const syncAddress = new Queue('Sync trust graph for address', redis, redisOpts);
const syncFullGraph = new Queue(
  'Sync full trust graph',
  redis,
  redisLongRunningOpts,
);
const nightlyCleanup = new Queue(
  'Clean up the queues',
  redis,
  redisLongRunningOpts,
);

const allQueues = [syncAddress, syncFullGraph, nightlyCleanup];

export {
  syncAddress,
  syncFullGraph,
  nightlyCleanup,
  allQueues,
};
