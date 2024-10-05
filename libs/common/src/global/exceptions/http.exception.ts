import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { BaseResponse } from '../base.response';
import { BusinessCode, BusinessDescription } from '../../enum';
import { JsonWebTokenError } from '@nestjs/jwt';

export class ValidationException extends HttpException {
  name = 'ValidationException';
}

@Catch()
export class HttpExceptions implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let responseBody: BaseResponse<any>;
    switch (true) {
      case exception instanceof ValidationException:
        const exceptionResponse = exception.getResponse();

        responseBody = BaseResponse.error({
          businessCode: BusinessCode.UNPROCESSED_ENTITY,
          businessDescription: BusinessDescription.UNPROCESSED_ENTITY,
          errors: exceptionResponse,
        });
        break;
      case exception instanceof BadRequestException:
        responseBody = BaseResponse.error({
          businessCode: BusinessCode.BAD_REQUEST,
          businessDescription: BusinessDescription.BAD_REQUEST,
          errors: exception.message,
        });
        break;

      case exception instanceof UnauthorizedException:
        responseBody = BaseResponse.error({
          businessCode: BusinessCode.UNAUTHORIZED,
          businessDescription: BusinessDescription.UNAUTHORIZED,
          errors: exception.message,
        });
        break;

      case exception instanceof ConflictException:
        responseBody = BaseResponse.error({
          businessCode: BusinessCode.CONFLICT,
          businessDescription: BusinessDescription.CONFLICT,
          errors: exception.message,
        });
        break;

      case exception instanceof NotFoundException:
        responseBody = BaseResponse.error({
          businessDescription: BusinessDescription.NOT_FOUND,
          errors: exception.message,
          businessCode: BusinessCode.NOT_FOUND,
        });
        break;

      case exception instanceof JsonWebTokenError:
        responseBody = BaseResponse.error({
          businessDescription: BusinessDescription.UNAUTHORIZED,
          errors: 'Invalid Authentication Token',
          businessCode: BusinessCode.UNAUTHORIZED,
        });
        break;

      default:
        responseBody = BaseResponse.error({
          businessCode: BusinessCode.INTERNAL_SERVER_ERROR,
          businessDescription: BusinessDescription.INTERNAL_SERVER_ERROR,
          errors: exception.message,
        });
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
