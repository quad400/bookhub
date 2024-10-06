import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import {
  AppConfigModule,
  AuthGuard,
  BOOK_SERVICE,
  DatabaseModule,
  HUB_SERVICE,
  RmqModule,
  USER_SERVICE,
} from '@app/common';
import { AuthController } from './user-service/auth.controller';
import { UserController } from './user-service/user.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { BookController } from './book-service/book.controller';
import { HistoryController } from './book-service/history.controller';
import { FeedbackController } from './book-service/feedback.controller';
import { HubController } from './hub-service/hub.controller';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    RmqModule.register({
      name: USER_SERVICE,
    }),
    RmqModule.register({
      name: BOOK_SERVICE,
    }),
    RmqModule.register({
      name: HUB_SERVICE,
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    BookController,
    HistoryController,
    FeedbackController,
    HubController
  ],
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
