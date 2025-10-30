import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.producers';
import { QueueConfigFactory } from './factories/queue-config.factory';
import { QUEUE_NAMES } from 'src/constants/queue.constants';
import { QueueProducerFactory } from './factories/queue-producer.factory';

@Module({
  imports: [
    BullModule.registerQueue(
      QueueConfigFactory.createQueueConfig(QUEUE_NAMES.DUE_REVIEWS),
      QueueConfigFactory.createQueueConfig(QUEUE_NAMES.EMAIL_QUEUE),
    ),
  ],
  providers: [QueueService, QueueProducerFactory],
  exports: [QueueService],
})
export class QueueModule {}
