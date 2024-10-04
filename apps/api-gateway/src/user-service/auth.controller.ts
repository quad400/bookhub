import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginUserDto,
  RegenrateOtpDto,
  USER_SERVICE,
  VerifyUserDto,
} from '@app/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@ApiTags('Authentication')
@Public()
@Controller('auth')
export class AuthController {
  constructor(@Inject(USER_SERVICE) private authClient: ClientProxy) {}

  @ApiOperation({ summary: 'Create User' })
  @ApiCreatedResponse()
  @Post('register')
  async register(@Body() data: CreateUserDto) {
    return this.authClient.send('register', data)
  }

  @Post('login')
  @ApiBody({
    description: "Authenticate User",
    required: true,
    schema: {
      type: "object",
      properties: {
        username: {
          type: "string",
          example: "tester"
        },
        password: {
          type: "string",
          example: "test1234"
        }
      }
    }
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginUserDto) {
    return this.authClient.send('login',data);
  }
  
  @Post('verify')
  @ApiOperation({ summary: 'Verify User Account' })
  @ApiOkResponse({ status: HttpStatus.OK })
  async verify(@Body() data: VerifyUserDto) {
    return this.authClient.send('verify',data);
  }
  
  @Post('resend-otp')
  @ApiOkResponse({ status: HttpStatus.OK })
  @ApiOperation({ summary: 'Resend Verification Code to User Email' })
  async regenerate(@Body() data: RegenrateOtpDto) {
    return this.authClient.send('resend-otp',data);
  }
  
  @Post('change-password')
  @ApiOkResponse({ status: HttpStatus.OK })
  @ApiOperation({ summary: 'Change User Password' })
  async changePassword(@Body() data: ChangePasswordDto) {
    return this.authClient.send('change-password',data);
  }
}
