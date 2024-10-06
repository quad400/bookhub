import { BadRequestException, Injectable } from '@nestjs/common';
import { HubRepository } from './repos/hub.repo';
import { HubProfileRepository } from './repos/hub-profile.repo';
import {
  BaseResponse,
  BusinessCode,
  CreateHubDto,
  CustomError,
  Hub,
  HUB_QUEUE,
  HubPermissionDto,
  HubRoleEnum,
  MemberDto,
  QueryWithoutSearchDto,
  RmqService,
} from '@app/common';
import { RmqContext } from '@nestjs/microservices';
import { MemberRepository } from './repos/member.repo';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class HubService {
  constructor(
    private hubRepo: HubRepository,
    private hubProfileRepo: HubProfileRepository,
    private memberRepo: MemberRepository,
    private rmqService: RmqService,
    @InjectQueue('audio') private hubQueue: Queue,
  ) {}

  async createHub(userId: string, data: CreateHubDto, context: RmqContext) {
    try {
      await this.hubProfileRepo.checkUnique(data, 'name');
      const hub = (await this.hubRepo.create({
        created_by: userId,
      })) as Hub;

      const hubProfile = await this.hubProfileRepo.create({
        hub: hub,
        ...data,
      });

      hub.hub_profile = hubProfile._id;

      hub.save();

      await this.hubQueue.add({ userId: 'hello', hubId: 'hi' });

      await this.memberRepo.create({
        hub: hub._id,
        user: userId,
        role: HubRoleEnum.ADMIN,
      });
      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.CREATED,
        businessDescription: 'Hub Successfully Created',
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async updateHub(
    userId: string,
    data: CreateHubDto,
    hubId: string,
    context: RmqContext,
  ) {
    try {
      await this.hubProfileRepo.checkUnique(data, 'name');
      await this.hubRepo.findOne({
        created_by: userId,
        _id: hubId,
      });

      await this.hubProfileRepo.findOneAndUpdate({ hub: hubId }, data);

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Hub Successfully Updated',
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async getHubs(query: QueryWithoutSearchDto, context: RmqContext) {
    try {
      const hubResults = await this.hubRepo.findPaginated({
        query,
      });

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Hub Successfully Retrieved',
        data: hubResults,
      });
    } catch (error) {
      console.log(error);
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async getMyHubs(
    query: QueryWithoutSearchDto,
    userId: string,
    context: RmqContext,
  ) {
    try {
      const hubResults = await this.hubRepo.findPaginated({
        query,
        filterQuery: { created_by: userId },
      });

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Hub Successfully Retrieved',
        data: hubResults,
      });
    } catch (error) {
      console.log(error);
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async getHub(hubId: string, context: RmqContext) {
    try {
      const hub = await (
        await this.hubRepo.findOne({
          _id: hubId,
        })
      ).populate('hub_profile');
      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Hub Successfully Retrieved',
        data: hub,
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async joinHub(hubId: string, userId: string, context: RmqContext) {
    try {
      const hub = await this.hubRepo.findById(hubId);

      const member = await this.memberRepo.findOne(
        { user: userId, hub: hub._id },
        true,
      );

      if (member) {
        throw new BadRequestException('You are already a member of this hub');
      }

      await this.memberRepo.create({
        hub: hubId,
        user: userId,
      });

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Hub Joined Successfully',
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async leaveHub(hubId: string, userId: string, context: RmqContext) {
    try {
      const hub = await this.hubRepo.findById(hubId);
      const member = await this.memberRepo.findOne(
        { user: userId, hub: hub._id },
        true,
      );

      if (hub.created_by === userId) {
        throw new BadRequestException(
          'Hub creator cannot leave the hub, you can transfer ownership to another user',
        );
      }

      if (!member) {
        throw new BadRequestException('You are not a member of this hub');
      }

      await this.memberRepo.delete({
        hub: hubId,
        user: userId,
      });

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Hub Left Successfully',
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async deleteHub(hubId: string, userId: string, context: RmqContext) {
    try {
      const hub = await this.hubRepo.findOne(
        {
          created_by: userId,
          _id: hubId,
        },
        true,
      );

      if (!hub) {
        throw new BadRequestException(
          'You do not have permission to delete this hub',
        );
      }

      await this.hubRepo.softDelete({
        _id: hub._id,
      });

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Hub Deleted Successfully',
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async getHubMember(
    hubId: string,
    query: QueryWithoutSearchDto,
    context: RmqContext,
  ) {
    try {
      const members = await this.memberRepo.findPaginated({
        query,
        filterQuery: { hub: hubId },
      });

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Hub Members Retrieved Successfully',
        data: members,
      });
    } catch (error) {
      console.log(error);
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async kickHubMember(
    hubId: string,
    data: MemberDto,
    userId: string,
    context: RmqContext,
  ) {
    try {
      const hub = await this.hubRepo.findById(hubId);

      const isMemberAdmin = await this.memberRepo.findOne(
        {
          hub: hub._id,
          user: userId,
          role: HubRoleEnum.ADMIN,
        },
        true,
      );

      if (!isMemberAdmin) {
        throw new BadRequestException(
          'Member does not have permission to kick others from the hub',
        );
      }

      const member = await this.memberRepo.findOne(
        { _id: data.memberId, hub: hub._id },
        true,
      );

      if (hub.created_by === member.user) {
        throw new BadRequestException(
          'You cannot kick hub creator, you can transfer ownership to another user',
        );
      }

      await this.memberRepo.delete({ _id: data.memberId });

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Members Kicked from Hub Successfully',
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async hubPermissionUpdate(
    hubId: string,
    data: HubPermissionDto,
    userId: string,
    context: RmqContext,
  ) {
    try {
      const hub = await this.hubRepo.findById(hubId);
      const isMember = await this.memberRepo.findOne(
        {
          hub: hubId,
          user: userId,
        },
        true,
      );

      if (isMember.role === HubRoleEnum.USER) {
        throw new BadRequestException(
          'Member does not have permission to update members permissions',
        );
      }

      const creatorMembership = await this.memberRepo.findOne(
        {
          hub: hubId,
          user: hub.created_by,
        },
        true,
      );

      if (data.memberId === creatorMembership._id) {
        throw new BadRequestException(
          'You cannot remove hub creator from being an admin of this hub',
        );
      }

      await this.memberRepo.findOneAndUpdate(
        { _id: data.memberId },
        { role: data.role },
      );

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Members Permission Updated Successfully',
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async transferHubOwnerShip(
    hubId: string,
    data: MemberDto,
    userId: string,
    context: RmqContext,
  ) {
    try {
      const hub = await this.hubRepo.findOne({
        _id: hubId,
        created_by: userId,
      });

      const member = await this.memberRepo.findOneAndUpdate(
        {
          hub: hubId,
          _id: data.memberId,
        },
        { role: HubRoleEnum.ADMIN },
      );

      await this.hubRepo.findOneAndUpdate(
        { _id: hub._id },
        { created_by: member.user },
      );

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Hub Account Trasfered Successfully',
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }
}
