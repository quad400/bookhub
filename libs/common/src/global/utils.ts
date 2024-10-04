import { BusinessCode, BusinessDescription } from '../enum';
import { BaseResponse } from './base.response';

export type MailProps = {
  to: string;
  token: string;
  username: string;
  [key: string]: any;
};

export const CustomError = (error: any) => {
  switch (true) {
    case error.name === 'ConflictException':
      return BaseResponse.error({
        businessCode: BusinessCode.CONFLICT,
        businessDescription: BusinessDescription.CONFLICT,
        errors: error.response.message,
      });
    case error.name === 'NotFoundException':
      return BaseResponse.error({
        businessCode: BusinessCode.NOT_FOUND,
        businessDescription: BusinessDescription.NOT_FOUND,
        errors: error.response.message,
      });
    case error.name === 'UnauthorizedException':
      return BaseResponse.error({
        businessCode: BusinessCode.UNAUTHORIZED,
        businessDescription: BusinessDescription.UNAUTHORIZED,
        errors: error.response.message,
      });
    case error.name === 'BadRequestException':
      return BaseResponse.error({
        businessCode: BusinessCode.BAD_REQUEST,
        businessDescription: BusinessDescription.BAD_REQUEST,
        errors: error.response.message,
      });
    default:
      return BaseResponse.error({
        businessCode: BusinessCode.INTERNAL_SERVER_ERROR,
        businessDescription: BusinessDescription.INTERNAL_SERVER_ERROR,
        errors: error.response.message,
      });
  }
};
