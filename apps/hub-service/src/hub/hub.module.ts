import { Module } from '@nestjs/common';
import { HubService } from './hub.service';
import { HubController } from './hub.controller';
import { HubRepository } from './repos/hub.repo';
import { HubProfileRepository } from './repos/hub-profile.repo';
import { HUB_QUEUE, RmqService } from '@app/common';
import { ModelModule } from 'apps/hub-service/config/model.module';
import { MemberRepository } from './repos/member.repo';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ModelModule,
    BullModule.registerQueue({
      name: "audio",
      // defaultJobOptions: {
      //   removeOnComplete: true,
      //   attempts: 5,
      //   removeOnFail: true,
      // },
    }),
  ],
  controllers: [HubController],
  providers: [
    HubService,
    HubRepository,
    HubProfileRepository,
    MemberRepository,
    RmqService,
  ],
})
export class HubModule {}
