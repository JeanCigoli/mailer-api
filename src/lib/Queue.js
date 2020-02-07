import Bee from 'bee-queue';
import SendMail from '../app/jobs/SendMail';
import redisConfig from '../config/redis';
import { writeLog } from '../app/utils/index';

const jobs = [SendMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
          isWorker: true,
          removeOnSuccess: true,
          activateDelayedJobs: true,
        }),
        handle,
      };
    });
  }

  add(queue, job, delay) {
    const delayHour = new Date();

    delayHour.setMinutes(delayHour.getMinutes() + delay);

    return this.queues[queue].bee.createJob(job)
      .retries(2)
      .delayUntil(delayHour)
      .save();
  }

  processQueue() {
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    writeLog(job.queue.name, err.message);
  }
}

export default new Queue();
