import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from '../user/repository/user.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenRepository } from '../user/repository/token.repository';
import { ProfileRepository } from '../user/repository/profile.repository';
import { BullModule } from '@nestjs/bull';
import { RmqModule, RmqService, SEND_EMAIL_QUEUE, USER_SERVICE } from '@app/common';
import { UserConfigModule } from 'apps/user-service/config/user-config.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService]
    }),
    BullModule.registerQueue({
      name: SEND_EMAIL_QUEUE,
      // defaultJobOptions: {
      //   removeOnComplete: true,
      //   attempts: 5,
      //   removeOnFail: true,
      // },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    TokenRepository,
    ProfileRepository,
    RmqService
  ],
})
export class AuthModule {}
