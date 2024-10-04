import { Module } from '@nestjs/common';
import { DatabaseModule, RmqModule, RmqService, USER_SERVICE } from '@app/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ModelModule } from '../config/model.module';
import { AppConfigModule } from '@app/common';
import { UserConfigModule } from '../config/user-config.module';

@Module({
  imports: [
    UserConfigModule,
    DatabaseModule,
    AppConfigModule,
    UserModule,
    AuthModule,
    ModelModule,
    RmqModule
  ],
  controllers: [],
  providers: [RmqService],
})
export class UserServiceModule {}
