import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ResourceModule } from './resource/resource.module';
import { ProgressModule } from './progress/progress.module';
import { ReviewModule } from './review/review.module';
import { RedisModule } from './redis/redis.module';
import { UserResourceModule } from './user_resource/user_resource.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { REDIS_CLIENT } from './constants/redis.constants';
import { RedisClient } from 'bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    ResourceModule,
    ProgressModule,
    ReviewModule,
    RedisModule,
    UserResourceModule,
    BullModule.forRootAsync({
      inject: [REDIS_CLIENT],
      imports: [RedisModule],
      useFactory: (connection: RedisClient) => ({ connection }),
    }),
  ],
})
export class AppModule {}
