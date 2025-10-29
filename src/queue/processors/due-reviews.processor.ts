import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';

@Processor('due-reviews')
export class DueReviews extends WorkerHost {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async process(job: Job): Promise<any> {
    const {userId, resourceId, dueDate} = job.data
  }
}
