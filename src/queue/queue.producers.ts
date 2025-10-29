import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('due-reviews') private readonly reviewsQueue: Queue,
    @InjectQueue('email-queue') private readonly emailQueue: Queue,
  ) {}

  async findDueReviews(userId: number, resourceId: number, dueDate: Date) {
    await this.reviewsQueue.add(
      'check-reviews',
      {
        userId,
        resourceId,
        dueDate,
      },
      { delay: dueDate.getTime() - Date.now() },
    );
  }

  async sendEmail() {
    await this.emailQueue.add('send-email', {});
  }
}
