import {
  CurrentUser,
  UpdateUserDto,
  USER_SERVICE,
  UserTypes,
} from '@app/common';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@UseInterceptors(CacheInterceptor)
@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(@Inject(USER_SERVICE) private userClient: ClientProxy) {}

  @Patch('update')
  @ApiOperation({ summary: 'Update User Information' })
  async updateMe(@Body() data: UpdateUserDto, @CurrentUser() user: UserTypes) {
    return this.userClient.send('update', { data, userId: user._id });
  }

  @CacheKey('GET_USER')
  @Get('me')
  @ApiOperation({ summary: 'Fetch User Information using user token' })
  async getMe(@CurrentUser() user: UserTypes) {
    return this.userClient.send('get_me', { userId: user._id });
  }

  @CacheKey('GET_USER_BY_ID')
  @ApiOperation({ description: 'Fetch User Information using user id' })
  @ApiParam({ name: 'userId', type: String, description: 'User ID' })
  @Get('profile/:userId')
  @ApiOperation({ summary: 'Fetch User Information using user id' })
  async getUserProfile(@Param('userId') userId: string) {
    return this.userClient.send('get_me', {userId});
  }

  @ApiOperation({ description: 'Block Unblock User Account' })
  @ApiParam({ name: 'userId', type: String, description: 'User ID' })
  @Post('block-unblock-account/:userId')
  async blockUnblockUserAccount(@Param('userId') userId: string) {
    return this.userClient.send('block_unblock_user_accouunt', userId);
  }
}
