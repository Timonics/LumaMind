import { Logger, Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/constants/redis.constants';

export type RedisClient = Redis;

export const redisProvider: Provider = {
  useFactory: (): RedisClient => {
    const logger = new Logger('REDIS PROVIDER');

    const redisConnect = new Redis({
      host: 'localhost',
      port: 6379,
    });

    redisConnect.on('connect', () => {
      logger.log('Redis Successfully connected');
      return;
    });

    redisConnect.on('error', (err) => {
      logger.error('Error connecting to Redis', err);
      return;
    });

    return redisConnect;
  },
  provide: REDIS_CLIENT,
};
