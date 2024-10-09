import { User, USER_SERVICE } from '@app/common';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { WsException } from '@nestjs/websockets';
import { UpdateSocketConnectionDto } from 'apps/user-service/src/user/dto/user.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
  constructor(
    @Inject(USER_SERVICE) private userClient: ClientProxy,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  create(createChatDto: any) {
    return 'This action adds a new chat';
  }

  async userConnection(userId: string, socketId: string, is_connect = true) {
    if (is_connect) {
      this.userClient.emit('update_socket_connection', {
        userId: userId,
        body: {
          socket_id: socketId,
          is_online: true,
        } as UpdateSocketConnectionDto,
      });
    } else {
      this.userClient.emit('update_socket_connection', {
        userId: userId,
        body: {
          socket_id: null,
          is_online: false,
        },
      });
    }
  }

  async validateUser(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      console.log(payload)
      const user = await lastValueFrom(
        this.userClient.send('validate_user', {
          userId: payload.sub,
        }),
      );

      if (user.sucess === false) {
        throw new WsException(user.errors);
      }
      return user;
    } catch (error) {
      throw new WsException(error);
    }
  }

  async getUser(userId: string): Promise<User> {
    try {
      const user = await lastValueFrom(
        this.userClient.send('validate_user', {
          userId,
        }),
      );

      if (user.sucess === false) {
        throw new WsException(user.errors);
      }

      return user;
    } catch (error) {
      throw new WsException(error);
    }
  }
}
