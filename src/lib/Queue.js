import Bee from 'bee-queue';
import SendMail from '../app/jobs/SendMail';
import redisConfig from '../config/redis';
import { writeLog, writeNotLog } from '../app/utils/index';

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

      bee.on('succeeded', this.handleSuccess);

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleSuccess(job) {
    if (!job.data.element.status) {
      writeLog(job.data, job.data.log);
    }
  }

  handleFailure(job, err) {
    writeNotLog(job.data, err.message, job.data.log);
  }
}

export default new Queue();
