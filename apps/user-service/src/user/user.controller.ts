import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto,UpdateSocketConnectionDto } from './dto/user.dto';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('update')
  async updateMe(
    @Payload()
    data: {
      body: UpdateUserDto;
      userId: string;
    },
    @Ctx() context: RmqContext,
  ) {
    const { body, userId } = data;
    return await this.userService.updateMe(body, userId, context);
  }

  @EventPattern('update_socket_connection')
  async updateSocketConnection(
    @Payload()
    data: {
      body: UpdateSocketConnectionDto;
      userId: string;
    },
    @Ctx() context: RmqContext,
  ) {
    const { body, userId } = data;
    return await this.userService.updateSocketConnection(body, userId, context);
  }

  @MessagePattern('get_me')
  async getMe(@Payload() data: { userId: string }, @Ctx() context: RmqContext) {
    return await this.userService.getMe(data.userId, context);
  }

  @MessagePattern('validate_user')
  async validateUser(@Payload() data: { userId: string }, @Ctx() context: RmqContext) {
    return await this.userService.validateUser(data.userId, context);
  }

  @MessagePattern('block_unblock_user_accouunt')
  async blockUnblockUserAccount(
    @Payload() userId: string,
    @Ctx() context: RmqContext,
  ) {
    return await this.userService.blockUnblockUserAccount(userId, context);
  }
}
