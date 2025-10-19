import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Resource } from './interface/resource.interface';
import { Prisma } from 'generated/prisma';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ResourceService {
  private readonly defaultTTL = 86400;
  private readonly resourceTTL = 3600;

  constructor(
    private readonly redisClient: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  getCachedResourceKey(id: number): string {
    return `resource:${id}`;
  }

  getAllCachedResourceKey(): string {
    return `resource:all`;
  }

  async findAll(): Promise<Resource[]> {
    const cachedResourcesKey = this.getAllCachedResourceKey();

    const cachedResources =
      await this.redisClient.getJsonArr<Resource>(cachedResourcesKey);

    if (cachedResources) return cachedResources;

    const resources = await this.prisma.resource.findMany();

    if (resources) {
      this.redisClient.setJson<Resource>(
        this.getAllCachedResourceKey(),
        resources,
        this.resourceTTL,
      );
    }

    return resources;
  }

  async findOne(resourceId: number): Promise<Resource | null> {
    const cachedResourceKey = this.getCachedResourceKey(resourceId);

    const cachedResource =
      this.redisClient.getJson<Resource>(cachedResourceKey);

    if (cachedResource) return cachedResource;

    const resource = await this.prisma.resource.findUnique({
      where: {
        id: resourceId,
      },
    });

    if (resource)
      this.redisClient.setJson<Resource>(
        cachedResourceKey,
        resource,
        this.resourceTTL,
      );

    return resource;
  }

  async create(resourceData: Prisma.ResourceCreateInput): Promise<Resource> {
    const createdResource = await this.prisma.resource.create({
      data: {
        ...resourceData,
        createdAt: new Date(),
      },
    });

    await this.redisClient.setJson<Resource>(
      this.getCachedResourceKey(createdResource.id),
      createdResource,
      this.defaultTTL,
    );

    return createdResource;
  }

  async update(
    resourceId: number,
    resourceUpdateData: Prisma.ResourceUpdateInput,
  ): Promise<Resource> {
    return this.prisma.resource.update({
      where: {
        id: resourceId,
      },
      data: resourceUpdateData,
    });
  }

  async delete(resourceId: number) {
    await this.redisClient.delete([this.getCachedResourceKey(resourceId)]);
    return this.prisma.resource.delete({
      where: {
        id: resourceId,
      },
    });
  }
}
