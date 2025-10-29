import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.producers';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'due-reviews' }, { name: 'email-queue' }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
