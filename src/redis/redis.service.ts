import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from '../constants/redis.constants';
import { RedisClient } from './types/redis-client';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: RedisClient,
  ) {}

  //String Operations
  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    await (ttl
      ? this.redis.set(key, value, 'EX', ttl)
      : this.redis.set(key, value));
  }

  async delete(keys: string[]): Promise<number> {
    return await this.redis.del(keys);
  }

  //JSON Operations
  async getJson<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async getJsonArr<T>(key: string): Promise<T[] | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async setJson<T>(key: string, value: T | T[], ttl?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttl);
  }

  // Sorted Set Operations
  async zadd(key: string, score: number, member: string): Promise<number> {
    return this.redis.zadd(key, score, member);
  }

  async zrangebyscore(
    key: string,
    min: number,
    max: number,
  ): Promise<string[]> {
    return this.redis.zrangebyscore(key, min, max);
  }

  async zrem(key: string, member: string): Promise<number> {
    return this.redis.zrem(key, member);
  }
}
