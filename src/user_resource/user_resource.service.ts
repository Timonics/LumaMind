import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResourceService } from 'src/resource/resource.service';
import { UserService } from 'src/users/user.service';
import { UserResource } from './interfaces/user_resource.interface';

@Injectable()
export class UserResourceService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly resourceService: ResourceService,
    private readonly userService: UserService,
  ) {}

  async startResource(
    userId: number,
    resourceId: number,
    notes?: string,
  ): Promise<UserResource> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new Error(); //To Change
    }

    const resource = await this.resourceService.findOne(resourceId);
    if (!resource) {
      throw new Error(); //To Change
    }

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

  async endResource(
    userId_resourceId: Prisma.UserResourceUserIdResourceIdCompoundUniqueInput,
  ): Promise<UserResource> {
    return await this.prismaService.userResource.update({
      where: {
        userId_resourceId: userId_resourceId,
      },
      data: {
        completedAt: new Date(),
      },
    });
  }
}
