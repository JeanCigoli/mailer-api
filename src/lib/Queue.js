import Bee from 'bee-queue';
import SendMail from '../app/jobs/SendMail';
import redisConfig from '../config/redis';

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

    console.log(delayHour);

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
    console.log(`Queue ${job.queue.name}: FAILED `, err);
  }
}

export default new Queue();
