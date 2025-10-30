import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResourceService } from 'src/resource/resource.service';
import { UserResource } from './interfaces/user_resource.interface';
import { ProgressService } from 'src/progress/progress.service';
import { UserRepository } from 'src/users/user.repository';

@Injectable()
export class UserResourceService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly resourceService: ResourceService,
    private readonly userRepo: UserRepository,
    private readonly progressService: ProgressService,
  ) {}

  async createUserResource(
    userId: number,
    resourceId: number,
    notes?: string,
  ): Promise<UserResource> {
    const user = await this.userRepo.findOne(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const resource = await this.resourceService.findOne(resourceId);
    if (!resource) {
      throw new BadRequestException('Resource does not exist');
    }

    await this.progressService.create(userId, resourceId);

    return await this.prismaService.userResource.create({
      data: {
        userId: userId,
        resourceId: resourceId,
        startedAt: new Date(),
        completedAt: null,
        notes: notes ? notes : null,
      },
    });
  }

  async findAllUserResource(userId: number) {
    return await this.prismaService.userResource.findMany({
      where: { userId: userId },
    });
  }

  async findOneUserResource(resourceId: number, userId: number) {
    return await this.prismaService.userResource.findFirst({
      where: {
        resourceId: resourceId,
        userId: userId,
      },
    });
  }
}
