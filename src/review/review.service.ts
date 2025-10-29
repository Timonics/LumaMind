import { BadRequestException, Injectable } from '@nestjs/common';
import { sm2 } from 'src/common/utils/sm2';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueueService } from 'src/queue/queue.producers';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queueService: QueueService,
  ) {}

  async createReviewIfNotExist(userId: number, resourceId: number, score: number) {
    const existingReview = await this.prismaService.review.findUnique({
      where: {
        userId_resourceId: {
          userId,
          resourceId,
        },
      },
    });

    if (existingReview) {
      return existingReview;
    }

    const review = await this.prismaService.review.create({
      data: {
        userId,
        resourceId,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        interval: 1,
        repetitions: 1,
        lastScore: score,
      },
    });

    await this.queueService.findDueReviews(userId, resourceId, review.dueDate);

    return review;
  }

  async getDueReviews(userId: number) {
    return await this.prismaService.review.findMany({
      where: {
        userId,
        dueDate: {
          lte: new Date(),
        },
      },
      include: {
        resource: true,
      },
    });
  }

  async submitReviewScore(userId: number, resourceId: number, score: number) {
    const review = await this.prismaService.review.findUnique({
      where: {
        userId_resourceId: {
          userId,
          resourceId,
        },
      },
    });

    if (!review) {
      throw new BadRequestException('Review not found');
    }

    let { interval, repetitions, easeFactor } = review;

    const result = sm2({ easeFactor, repetitions, interval }, score);

    const updatedReview = await this.prismaService.review.update({
      where: {
        userId_resourceId: {
          userId,
          resourceId,
        },
      },
      data: {
        easeFactor: result.easeFactor,
        repetitions: result.repetitions,
        interval: result.interval,
        dueDate: result.nextDueDate,
        lastScore: score,
      },
    });

    await this.queueService.findDueReviews(
      userId,
      resourceId,
      updatedReview.dueDate,
    );

    return updatedReview;
  }
}
