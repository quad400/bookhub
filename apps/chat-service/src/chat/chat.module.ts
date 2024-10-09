import { Logger, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { JwtService } from '@nestjs/jwt';
import { HUB_SERVICE, RmqModule, USER_SERVICE } from '@app/common';

@Module({
  imports: [
    RmqModule.register({ name: USER_SERVICE }),
    RmqModule.register({ name: HUB_SERVICE }),
  ],
  providers: [ChatGateway, ChatService, JwtService],
})
export class ChatModule {}
