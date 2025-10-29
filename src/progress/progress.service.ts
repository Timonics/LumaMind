import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Progress } from './progress.interface';

@Injectable()
export class ProgressService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: number, resourceId: number): Promise<Progress> {
    return await this.prismaService.progress.create({
      data: {
        userId,
        resourceId,
      },
    });
  }
}
