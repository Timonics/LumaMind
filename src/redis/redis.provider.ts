import { Provider } from '@nestjs/common';
import { REDIS_CLIENT } from 'src/constants/redis.constants';
import { RedisClient } from './types/redis-client';
import { RedisClientFactory } from './redis-client.factory';

export const redisProvider: Provider = {
  useFactory: (): RedisClient => {
    return RedisClientFactory.create()
  },
  provide: REDIS_CLIENT,
};