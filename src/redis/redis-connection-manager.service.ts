import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
  Logger,
  Inject,
} from '@nestjs/common';
import { REDIS_CLIENT } from 'src/constants/redis.constants';
import { RedisClient } from './types/redis-client';

@Injectable()
export class RedisConnectionManager
  implements OnApplicationShutdown, OnModuleInit
{
  private readonly logger = new Logger(RedisConnectionManager.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClient) {}

  async onApplicationShutdown(signal?: string) {
    this.logger.warn(`Redis closing because of ${signal}`);
    try {
      await this.redis.quit();
      this.logger.log('Redis Connection successfully closed');
    } catch (err) {
      this.logger.error(`Error closing Redis connection`, err);
    }
  }

  async onModuleInit() {
    try {
      const pong = await this.redis.ping();
      this.logger.log(`Redis is ready: ${pong}`);
    } catch (err) {
      this.logger.error(`Error starting Redis connection`, err);
    }
  }
}
