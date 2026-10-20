import {
    Injectable,
    OnModuleDestroy,
    OnModuleInit,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import Redis from 'ioredis';
  
  @Injectable()
  export class RedisService implements OnModuleInit, OnModuleDestroy {
    readonly client: Redis;
  
    constructor(configService: ConfigService) {
      this.client = new Redis({
        host: configService.getOrThrow<string>('REDIS_HOST'),
        port: Number(configService.getOrThrow('REDIS_PORT')),
        lazyConnect: true,
        maxRetriesPerRequest: 3,
      });
    }
  
    async onModuleInit(): Promise<void> {
      await this.client.connect();
    }
  
    async onModuleDestroy(): Promise<void> {
      await this.client.quit();
    }
  }