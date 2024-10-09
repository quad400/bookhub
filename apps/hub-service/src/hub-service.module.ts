import { Module } from '@nestjs/common';
import { HubModule } from './hub/hub.module';
import {
  AppConfigModule,
  DatabaseModule,
  RmqModule,
  RmqService,
} from '@app/common';
import { HubConfigModule } from '../config/hub-config.module';
import { ModelModule } from '../config/model.module';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { HubConsumer } from './hub/queue/hub.queue';
import { MemberRepository } from './hub/repos/member.repo';

@Module({
  imports: [
    HubModule,
    HubConfigModule,
    DatabaseModule,
    AppConfigModule,
    ModelModule,
    RmqModule,
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        console.log(
          configService.get('REDIS_HOST'),
          configService.get('REDIS_PORT'),
        );
        return {
          redis: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    RmqService,
    HubConsumer,
    MemberRepository,
  ],
})
export class HubServiceModule {}
