import {
  CreateHubDto,
  CurrentUser,
  HUB_SERVICE,
  HubPermissionDto,
  MemberDto,
  QueryWithoutSearchDto,
  UpdateHubDto,
  User,
} from '@app/common';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@UseInterceptors(CacheInterceptor)
@ApiTags('Hub')
@ApiBearerAuth()
@Controller('hub')
export class HubController {
  constructor(@Inject(HUB_SERVICE) private hubClient: ClientProxy) {}

  @ApiOperation({ description: 'Create New Hub' })
  @Post('/create-hub')
  async createHub(@CurrentUser() user: User, @Body() data: CreateHubDto) {
    return this.hubClient.send('create_hub', { userId: user._id, data });
  }

  @ApiOperation({ description: 'Update Hub' })
  @Patch('/update-hub/:hubId')
  async updateHub(
    @CurrentUser() user: User,
    @Param('hubId') hubId: string,
    @Body() data: UpdateHubDto,
  ) {
    return this.hubClient.send('update_hub', { userId: user._id, data, hubId });
  }

  @CacheKey('GET_HUBS')
  @ApiOperation({ description: 'Get Hubs' })
  @ApiQuery({
    name: 'page',
    description: 'Page Number',
    required: false,
    schema: { default: 1 },
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limit Number',
    required: false,
    schema: { default: 10 },
  })
  @ApiQuery({
    name: 'sortField',
    description: 'Field to sort',
    required: false,
  })
  @ApiQuery({
    name: 'sortDirection',
    description: 'Direction To Sort ASC | DESC',
    required: false,
  })
  @Get('get-hubs')
  async getHubs(@Query() query: QueryWithoutSearchDto) {
    return this.hubClient.send('get_hubs', { query });
  }

  @CacheKey('GET_MY_HUBS')
  @ApiOperation({ description: 'Get My Hubs' })
  @ApiQuery({
    name: 'page',
    description: 'Page Number',
    required: false,
    schema: { default: 1 },
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limit Number',
    required: false,
    schema: { default: 10 },
  })
  @ApiQuery({
    name: 'sortField',
    description: 'Field to sort',
    required: false,
  })
  @ApiQuery({
    name: 'sortDirection',
    description: 'Direction To Sort ASC | DESC',
    required: false,
  })
  @Get('get-my-hubs')
  async getMyHubs(
    @Query() query: QueryWithoutSearchDto,
    @CurrentUser() user: User,
  ) {
    return this.hubClient.send('get_my_hubs', { query, userId: user._id });
  }

  @ApiOperation({ description: 'Get Hub By Id' })
  @Get('/get-hub/:hubId')
  async getHub(@Param('hubId') hubId: string) {
    return this.hubClient.send('get_hub', { hubId });
  }

  @ApiOperation({ description: 'Join Hub' })
  @Post('join-hub/:hubId')
  async joinHub(@Param('hubId') hubId: string, @CurrentUser() user: User) {
    return this.hubClient.send('join_hub', { hubId, userId: user._id });
  }

  @ApiOperation({ description: 'Leave Hub' })
  @Post('leave-hub/:hubId')
  async leaveHub(@Param('hubId') hubId: string, @CurrentUser() user: User) {
    return this.hubClient.send('leave_hub', { hubId, userId: user._id });
  }

  @ApiOperation({ description: 'Delete Hub' })
  @Delete('delete-hub/:hubId')
  async deleteHub(@Param('hubId') hubId: string, @CurrentUser() user: User) {
    return this.hubClient.send('delete_hub', { hubId, userId: user._id });
  }

  
  @CacheKey('GET_HUB_MEMEBERS')
  @ApiOperation({ description: 'Get Hubs Members' })
  @ApiQuery({
    name: 'page',
    description: 'Page Number',
    required: false,
    schema: { default: 1 },
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limit Number',
    required: false,
    schema: { default: 10 },
  })
  @ApiQuery({
    name: 'sortField',
    description: 'Field to sort',
    required: false,
  })
  @ApiQuery({
    name: 'sortDirection',
    description: 'Direction To Sort ASC | DESC',
    required: false,
  })
  @ApiOperation({ description: 'Get Hub Members' })
  @Get('get-hub-member/:hubId')
  async getHubMember(
    @Param('hubId') hubId: string,
    @Query() query: QueryWithoutSearchDto,
  ) {
    return this.hubClient.send('get_hub_members', { hubId, query });
  }

  @ApiOperation({ description: 'Kick Hub Member' })
  @Put('kick-hub-member/:hubId')
  async kickHubMember(
    @Param('hubId') hubId: string,
    @Body() data: MemberDto,
    @CurrentUser() user: User,
  ) {
    return this.hubClient.send('kick_hub_member', {
      hubId,
      data,
      userId: user._id,
    });
  }

  @ApiOperation({ description: 'Hub Permission Update' })
  @Patch('hub-member-update/:hubId')
  async hubPermissionUpdate(
    @Param('hubId') hubId: string,
    @Body() data: HubPermissionDto,
    @CurrentUser() user: User,
  ) {
    return this.hubClient.send('hub_permission_update', {
      hubId,
      data,
      userId: user._id,
    });
  }

  @ApiOperation({ description: 'Transfer Hub Ownership' })
  @Patch('transfer-hub-ownership/:hubId')
  async transferHubOwnerShip(
    @Param('hubId') hubId: string,
    @Body() data: MemberDto,
    @CurrentUser() user: User,
  ) {
    return this.hubClient.send('transfer_hub_ownership', {
      hubId,
      data,
      userId: user._id,
    });
  }
}
