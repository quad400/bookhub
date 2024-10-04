import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  ConflictException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class CustomRpcExceptionFilter implements RpcExceptionFilter<RpcException> {
    catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
      return throwError(() => exception.getError());
    }
}
