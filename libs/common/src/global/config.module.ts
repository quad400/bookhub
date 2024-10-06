import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import * as Joi from 'joi';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        url: configService.get('REDIS_URL'),
        ttl: 30000,
        max: 10,
      }),
      inject: [ConfigService],
    }),
    // BullModule.forRootAsync({
    //   useFactory: (configService: ConfigService) => {
    //     console.log(
    //       configService.get('REDIS_HOST'),
    //       configService.get('REDIS_PORT'),
    //     );
    //     return {
    //       redis: {
    //         host: configService.get('REDIS_HOST'),
    //         port: configService.get('REDIS_PORT'),
    //       },
    //     };
    //   },
    //   inject: [ConfigService],
    // }),

    ConfigModule.forRoot({
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_BOOK_QUEUE: Joi.string().required(),
        RABBIT_MQ_USER_QUEUE: Joi.string().required(),
        RABBIT_MQ_HUB_QUEUE: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/api-gateway/.env',
    }),
  ],
  exports: [CacheModule, ConfigModule],
})
export class AppConfigModule {}
