import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import {
  ClientSocket,
  CurrentUser,
  HUB_SERVICE,
  Member,
  UpdateHubDto,
  User,
  WsBaseException,
  WsValidationPipe,
} from '@app/common';
import { Inject, Logger, UseFilters, UsePipes } from '@nestjs/common';
import { Server } from 'socket.io';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@UseFilters(WsBaseException)
@UsePipes(new WsValidationPipe())
@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(ChatGateway.name);
  @WebSocketServer() server: Server;
  constructor(
    private readonly chatService: ChatService,
    @Inject(HUB_SERVICE) private hubClient: ClientProxy,
  ) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('ChatGateway initialized');
  }

  @SubscribeMessage('update_hub')
  async onUpdateHub(
    @MessageBody(new WsValidationPipe())
    messageBody: { data: UpdateHubDto; hubId: string },
    @ConnectedSocket() client: ClientSocket,
  ) {
    const userId = client.user._id;
    const { data, hubId } = messageBody;

    const hub = await lastValueFrom(
      this.hubClient.send('update_hub', { userId, data, hubId }),
    );
    // console.log(hub);
  }

  // async notificationSystem(members: Member[], event: string, payload: any) {
  //   for (const member of members) {
  //     const user = await this.chatService.getUser(member.user);
  //     if (user) {
  //       await this.emitSocket(user.socket_id, event, payload);
  //     }
  //   }
  // }

  // async emitSocket(
  //   socketId: string,
  //   event: string,
  //   payload: any,
  // ): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     this.server.to(socketId).emit(event, payload, (response: any) => {
  //       if (response && response.error) {
  //         reject(new Error(response.error));
  //       } else {
  //         resolve();
  //       }
  //     });
  //   });
  // }

  async handleConnection(client: ClientSocket) {
    try {
      const authenticate = await this.handleAuthentication(client);

      if (authenticate) {
        await this.chatService.userConnection(client.user._id, client.id);
        this.logger.log(`${client.user?.username} connected`);
      }
    } catch (error) {
      this.handleConnectionError(client, error);
    }
  }

  async handleDisconnect(client: ClientSocket) {
    if (!client.user) return;
    await this.chatService.userConnection(client.user._id, client.id, false);
    this.logger.log(`${client.user?.username || 'Unknown user'} disconnected`);
  }

  private handleConnectionError(client: ClientSocket, error: Error): void {
    this.logger.error(
      `Connection error for socket ${client.id}: ${error.message}`,
    );
    client.emit('exception', 'Authentication error');
    client.disconnect();
  }

  async handleAuthentication(client: ClientSocket) {
    try {
      const authentication = client.handshake.headers.authentication as string;

      if (!authentication) {
        throw new WsException('Authentication Token Not Found');
      }

      if (authentication.split(' ')[0] !== 'Bearer') {
        throw new WsException('Authentication prefix have to you be Bearer');
      }

      if (!authentication.split(' ')[1]) {
        throw new WsException('Authentication Token Not Found');
      }

      const user = await this.chatService.validateUser(
        authentication.split(' ')[1],
      );

      client.user = user;
      return true;
    } catch (error: any) {
      console.log(error.name);
      if (error.name === 'TokenExpiredError') {
        console.log(error.name);
        this.handleConnectionError(client, new WsException('JWT Expired'));
      } else {
        this.handleConnectionError(
          client,
          new WsException('Authentication Failed'),
        );
      }
    }
  }
}
