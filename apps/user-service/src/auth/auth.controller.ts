import {
  Body,
  Controller,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginUserDto,
  RegenrateOtpDto,
  VerifyUserDto,
} from './dto/auth.dto';
import {  ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  RmqService,
} from '@app/common';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @MessagePattern('register')
  async register(@Payload() data: CreateUserDto, @Ctx() context: RmqContext) {
    return await this.authService.create(data, context);
  }

  @MessagePattern('login')
  async login(@Payload() data: LoginUserDto, @Ctx() context: RmqContext) {
    return await this.authService.login(data, context);
  }

  @MessagePattern('verify')
  async verify(@Payload() data: VerifyUserDto, @Ctx() context: RmqContext) {
    return await this.authService.verify(data, context);
  }

  @MessagePattern('resend-otp')
  async regenerate(@Payload() data: RegenrateOtpDto, @Ctx() context: RmqContext) {
    return await this.authService.regenerate(data, context);
  }

  @MessagePattern('change-password')
  async changePassword(@Payload() data: ChangePasswordDto, @Ctx() context: RmqContext) {
    return await this.authService.changePassword(data, context);
  }
}
