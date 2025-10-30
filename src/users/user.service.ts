import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { Prisma } from 'generated/prisma';
import { RedisService } from 'src/redis/redis.service';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly defaultTTL = 86400;
  private readonly usersTTL = 3600;

  constructor(
    private userRepo: UserRepository,
    private readonly redisClient: RedisService,
  ) {}

  getCachedKey(userId: number): string {
    return `user:${userId}`;
  }

  async findAll(): Promise<User[]> {
    const cachedUsersKey = 'users:all';
    const cachedUsers = await this.redisClient.getJsonArr<User>(cachedUsersKey);

    if (cachedUsers) return cachedUsers;

    const users = await this.userRepo.findAll();

    if (users) {
      await this.redisClient.setJson<User>(
        cachedUsersKey,
        users,
        this.usersTTL,
      );
    }

    return users;
  }

  async findOne(id: number): Promise<User | null> {
    const cachedUser = await this.redisClient.getJson<User>(
      this.getCachedKey(id),
    );

    if (cachedUser) return cachedUser;

    const user = await this.userRepo.findOne(id);

    if (user)
      this.redisClient.setJson<User>(
        this.getCachedKey(id),
        user,
        this.defaultTTL,
      );

    return user;
  }

  async create(userData: Prisma.UserCreateInput): Promise<User> {
    const createdUser = await this.userRepo.create(userData);

    const cacheKey = this.getCachedKey(createdUser.id);
    await this.redisClient.setJson(cacheKey, createdUser, this.usersTTL);

    return createdUser;
  }

  async delete(id: number) {
    return this.userRepo.delete(id);
  }
}
