import { Logger } from '@nestjs/common';
import { RedisClient } from './types/redis-client';
import Redis from 'ioredis';
import { REDIS_CONFIG } from 'src/constants/redis.constants';

export class RedisClientFactory {
  private static clientInstance: RedisClient | null = null;

  static create(): RedisClient {
    if (RedisClientFactory.clientInstance) {
      return RedisClientFactory.clientInstance;
    }

    const logger = new Logger(RedisClientFactory.name);

    const redisClient = new Redis({
      host: REDIS_CONFIG.host,
      port: REDIS_CONFIG.port,
    });

    redisClient.on('connect', () => {
      logger.log('Redis Successfully Connected');
    });

    redisClient.on('error', (err) => {
      logger.error('Error connecting to Redis', err);
    });

    RedisClientFactory.clientInstance = redisClient;

    return RedisClientFactory.clientInstance;
  }
}
