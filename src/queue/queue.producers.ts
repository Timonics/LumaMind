import { Injectable } from '@nestjs/common';
import { QueueProducerFactory } from './factories/queue-producer.factory';
import { QUEUE_NAMES } from 'src/constants/queue.constants';

@Injectable()
export class QueueService {
  constructor(private readonly queueProducer: QueueProducerFactory) {}

  async findDueReviews(queueData: {
    userId: number;
    resourceId: number;
    dueDate: Date;
  }) {
    await this.queueProducer.add(
      QUEUE_NAMES.DUE_REVIEWS,
      'check-reviews',
      queueData,
      { delay: queueData.dueDate.getTime() - Date.now() },
    );
  }
}
