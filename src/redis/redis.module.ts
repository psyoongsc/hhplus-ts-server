import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { DistributedLockService } from './redisDistributedLock.service';

@Module({
  providers: [
    RedisService,
    DistributedLockService,
  ],
  exports: [
    RedisService,
    DistributedLockService,
  ],
})
export class RedisModule {}
