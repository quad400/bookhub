import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import {
  AuthGuard,
  BOOK_SERVICE,
  DatabaseModule,
  RmqModule,
  USER_SERVICE,
} from '@app/common';
import { AuthController } from './user-service/auth.controller';
import { UserController } from './user-service/user.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { BookController } from './book-service/book.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        REDIS_URL: Joi.string().required(),
      }),
      envFilePath: './apps//.env',
    }),

    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        isGlobal: true,
        store: redisStore,
        url: configService.get<string>('REDIS_URL'),
        ttl: 30000,
        max: 10,
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    RmqModule.register({
      name: USER_SERVICE,
    }),
    RmqModule.register({
      name: BOOK_SERVICE,
    }),
  ],
  controllers: [AppController, AuthController, UserController, BookController],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
