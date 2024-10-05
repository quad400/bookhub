import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repository/user.repository';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginUserDto,
  RegenrateOtpDto,
  VerifyUserDto,
} from './dto/auth.dto';
import { BaseResponse, CustomError, MailProps, RmqService, User } from '@app/common';
import { BusinessCode } from '@app/common/enum';
import { JwtService } from '@nestjs/jwt';
import { TokenRepository } from '../user/repository/token.repository';
import { ProfileRepository } from '../user/repository/profile.repository';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly profileRepository: ProfileRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private rmqService: RmqService,

    // @InjectQueue(Config.SEND_EMAIL_QUEUE)
    // private readonly sendEmailQueue: Queue,
  ) {}

  async create(data: CreateUserDto, context: RmqContext) {
    try {
      const salt = await bcrypt.genSalt(10);

      const code = this.generateCode();
      data.password = await bcrypt.hash(data.password, salt);

      await this.userRepository.checkUnique(data, 'username');

      await this.userRepository.checkUnique(data, 'email');

      const user = await this.userRepository.create(data);

      user.profile = await this.profileRepository.create({ user: user._id });

      await user.save();

      await this.tokenRepository.create({
        token: code,
        token_expired_at: new Date(Date.now() + 1000 * 60 * 3),
        user: user.id,
      });

      const mailData: MailProps = {
        to: data.email,
        token: code,
        username: data.username,
      };

      this.rmqService.ack(context);
      // await this.sendEmailQueue.add('welcome', mailData);
      return BaseResponse.success({
        businessCode: BusinessCode.CREATED,
        businessDescription: 'User created successfully',
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async login(data: LoginUserDto, context: RmqContext) {
    let user: User;
    try {
      const { email, username, password } = data;
      if (email) {
        user = await this.userRepository.findOne({ email });
        if (!user.account_verified) {
          throw new BadRequestException('Account not verified');
        }
      } else {
        user = await this.userRepository.findOne({ username });
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw new BadRequestException('Invalid credentials');
      }

      const token = this.jwtService.sign({ sub: user._id });
      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'User successfully login',
        data: token,
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async verify({ email, code, type }: VerifyUserDto, context: RmqContext) {
    try {
      const user = await this.userRepository.findOne({ email });

      const token = await this.tokenRepository.findOne({ user: user.id });

      if (token.token_expired_at < new Date()) {
        throw new BadRequestException('Otp code has expired');
      }

      if (token.token !== code) {
        throw new BadRequestException('Invalid otp code');
      }
      if (type === 'REGISTER') {
        user.account_verified = true;
        await user.save();
      }
      await this.tokenRepository.delete({ _id: token._id });

      const access_token = this.jwtService.sign({ sub: user._id });
      this.rmqService.ack(context);

      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Account Verified Successfully',
        data: access_token,
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async regenerate({ email }: RegenrateOtpDto, context: RmqContext) {
    try {
      const user = await this.userRepository.findOne({ email });
      const token = await this.tokenRepository.findOne(
        { user: user._id },
        true,
      );

      if (token) {
        await this.tokenRepository.delete({ _id: token._id });
      }

      const code = this.generateCode();

      await this.tokenRepository.create({
        token: code,
        token_expired_at: new Date(Date.now() + 1000 * 60 * 3),
        user: user._id,
      });

      const mailData: MailProps = {
        to: user.email,
        token: code,
        username: user.username,
      };

      // await this.sendEmailQueue.add('resend-code', mailData);

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Otp code generated successfully',
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  async changePassword(
    { email, confirm_password, password }: ChangePasswordDto,
    context: RmqContext,
  ) {
    try {
      const user = await this.userRepository.findOne({ email });

      if (password !== confirm_password) {
        throw new BadRequestException('Password Mismatch');
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      this.rmqService.ack(context);
      return BaseResponse.success({
        businessCode: BusinessCode.OK,
        businessDescription: 'Password changed successfully',
      });
    } catch (error) {
      this.rmqService.nack(context);
      return CustomError(error);
    }
  }

  generateCode(): string {
    if (Boolean(this.configService.get('IS_PRODUCTION'))) {
      const min = 1000;
      const max = 9999;
      return Math.floor(Math.random() * (max - min + 1) + min).toString();
    } else {
      // Development environment, use a fixed code
      return '1234';
    }
  }
}
