import { Module } from '@nestjs/common';
import { redisProvider } from './redis.provider';
import { RedisConnectionManager } from './redis-connection-manager.service';
import { RedisService } from './redis.service';

@Module({
  providers: [redisProvider, RedisConnectionManager, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
