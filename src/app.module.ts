import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ResourceModule } from './resource/resource.module';
import { ProgressModule } from './progress/progress.module';
import { ReviewModule } from './review/review.module';
import { RedisModule } from './redis/redis.module';
import { UserResourceModule } from './user_resource/user_resource.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    ResourceModule,
    ProgressModule,
    ReviewModule,
    RedisModule,
    UserResourceModule
  ],
})
export class AppModule {}
