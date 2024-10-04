import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';
import { ProfileRepository } from './repository/profile.repository';
import { AppConfigModule, JwtStrategy, RmqService } from '@app/common';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserRepository, ProfileRepository, RmqService, JwtStrategy],
})
export class UserModule {}
