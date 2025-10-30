import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JobsOptions, Queue } from 'bullmq';
import { QUEUE_NAMES } from 'src/constants/queue.constants';

@Injectable()
export class QueueProducerFactory {
  constructor(
    @InjectQueue(QUEUE_NAMES.DUE_REVIEWS)
    private readonly dueReviewsQueue: Queue,
    @InjectQueue(QUEUE_NAMES.EMAIL_QUEUE) private readonly emailQueue: Queue,
  ) {}

  private getQueue(queueName: string) {
    switch (queueName) {
      case QUEUE_NAMES.DUE_REVIEWS:
        return this.dueReviewsQueue;
      case QUEUE_NAMES.EMAIL_QUEUE:
        return this.emailQueue;
      default:
        throw new BadRequestException(`Queue ${queueName} not found`);
    }
  }

  async add(queueName: string, jobName: string, data: any, opts: JobsOptions) {
    const queue = this.getQueue(queueName);
    return queue.add(jobName, data, opts);
  }
}
