import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { USER_SERVICE } from '../constants';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
    @Inject(USER_SERVICE) private userClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = this.getAuthentication(context);

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const user = await lastValueFrom(
        this.userClient.send('validate_user', {
          userId: payload.sub,
        }),
      );

      if (user.sucess === false) {
        throw new UnauthorizedException(user.errors);
      }

      request['user'] = user;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid Authentication Token');
      } else {
        throw new UnauthorizedException(error);
      }
    }
    return true;
  }

  private getAuthentication(context: ExecutionContext) {
    let authentication: string;
    if (context.getType() === 'rpc') {
      authentication = context.switchToRpc().getData().authentication;
    } else if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      authentication = this.extractTokenFromHeader(request);
    }
    if (!authentication) {
      throw new UnauthorizedException('Authorization header missing');
    }

    return authentication;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
