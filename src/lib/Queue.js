import Bee from 'bee-queue';
import SendMail from '../app/jobs/SendMail';
import redisConfig from '../config/redis';

const jobs = [SendMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();

    const TIMEOUT = 30 * 1000;

    process.on('uncaughtException', async () => {
      try {
        await this.queues.close(TIMEOUT);
      } catch (err) {
        console.error('bee-queue failed to shut down gracefully', err);
      }
      process.exit(1);
    });
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
          isWorker: true,
          removeOnSuccess: true,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).retries(2).save();
  }

  processQueue() {
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED `, err);
  }
}

export default new Queue();
