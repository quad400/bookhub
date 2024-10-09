import { Module } from '@nestjs/common';
import { ChatServiceController } from './chat-service.controller';
import { ChatServiceService } from './chat-service.service';
import { ChatModule } from './chat/chat.module';
import { AppConfigModule, AuthGuard, RmqModule, USER_SERVICE } from '@app/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ChatConfigModule } from '../config/chat-config.module';

@Module({
  imports: [
    ChatModule,
    AppConfigModule,
    ChatConfigModule,
  ],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class ChatServiceModule {}
