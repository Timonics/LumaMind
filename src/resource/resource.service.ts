import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Resource, ResourceType } from './interface/resource.interface';
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

  private getCachedResourceKey(id: number): string {
    return `resource:${id}`;
  }

  private getAllCachedResourceKey(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: string,
    type?: ResourceType
  ) {
    return `resources:page=${page}:limit=${limit}:sortBy=${sortBy}:sortOrder=${sortOrder}:type=${type}`;
  }

  async findAll(
    page = 1,
    limit = 10,
    sortBy: keyof Resource = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    type?: ResourceType,
  ): Promise<Resource[]> {
    const offset = (page - 1) * limit;

    const cachedResourcesKey = this.getAllCachedResourceKey(
      page,
      limit,
      sortBy,
      sortOrder,
      type
    );

    const cachedResources =
      await this.redisClient.getJsonArr<Resource>(cachedResourcesKey);

    if (cachedResources) return cachedResources;

    const resources = await this.prisma.resource.findMany({
      where: { type: type ? type : undefined },
      skip: offset,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    if (resources.length > 0) {
      this.redisClient.setJson<Resource>(
        this.getAllCachedResourceKey(page, limit, sortBy, sortOrder, type),
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
