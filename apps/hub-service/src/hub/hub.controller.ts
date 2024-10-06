import { Controller } from '@nestjs/common';
import { HubService } from './hub.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  CreateHubDto,
  HubPermissionDto,
  MemberDto,
  QueryDto,
  QueryWithoutSearchDto,
} from '@app/common';

@Controller()
export class HubController {
  constructor(private readonly hubService: HubService) {}

  @MessagePattern('create_hub')
  async createHub(
    @Payload() data: { userId: string; data: CreateHubDto },
    @Ctx() context: RmqContext,
  ) {
    return await this.hubService.createHub(data.userId, data.data, context);
  }

  @MessagePattern('update_hub')
  async updateHub(
    @Payload() data: { userId: string; hubId: string; data: CreateHubDto },
    @Ctx() context: RmqContext,
  ) {
    return await this.hubService.updateHub(
      data.userId,
      data.data,
      data.hubId,
      context,
    );
  }

  @MessagePattern('get_hubs')
  async getHubs(
    @Payload() data: { query: QueryWithoutSearchDto },
    @Ctx() context: RmqContext,
  ) {
    return await this.hubService.getHubs(data.query, context);
  }

  @MessagePattern('get_my_hubs')
  async getMyHubs(
    @Payload() data: { query: QueryWithoutSearchDto; userId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.hubService.getMyHubs(data.query, data.userId, context);
  }

  @MessagePattern('get_hub')
  async getHub(@Payload() data: { hubId: string }, @Ctx() context: RmqContext) {
    return await this.hubService.getHub(data.hubId, context);
  }

  @MessagePattern('join_hub')
  async joinHub(
    @Payload() data: { hubId: string; userId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.hubService.joinHub(data.hubId, data.userId, context);
  }

  @MessagePattern('leave_hub')
  async leaveHub(
    @Payload() data: { hubId: string; userId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.hubService.leaveHub(data.hubId, data.userId, context);
  }

  @MessagePattern('delete_hub')
  async deleteHub(
    @Payload() data: { hubId: string; userId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.hubService.deleteHub(data.hubId, data.userId, context);
  }

  @MessagePattern('get_hub_members')
  async getHubMember(
    @Payload() data: { hubId: string; query: QueryWithoutSearchDto },
    @Ctx() context: RmqContext,
  ) {
    return await this.hubService.getHubMember(data.hubId, data.query, context);
  }

  @MessagePattern('kick_hub_member')
  async kickHubMember(
    @Payload() data: { hubId: string; data: MemberDto; userId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.hubService.kickHubMember(
      data.hubId,
      data.data,
      data.userId,
      context,
    );
  }

  @MessagePattern('hub_permission_update')
  async hubPermissionUpdate(
    @Payload() data: { hubId: string; data: HubPermissionDto; userId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.hubService.hubPermissionUpdate(
      data.hubId,
      data.data,
      data.userId,
      context,
    );
  }

  @MessagePattern('transfer_hub_ownership')
  async transferHubOwnerShip(
    @Payload() data: { hubId: string; data: MemberDto; userId: string },
    @Ctx() context: RmqContext,
  ) {
    return await this.hubService.transferHubOwnerShip(
      data.hubId,
      data.data,
      data.userId,
      context,
    );
  }
}
