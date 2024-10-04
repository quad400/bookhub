import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'rpc') {
      const request = ctx.switchToRpc().getData();
      return request.user;
    } else if (ctx.getType() === 'http') {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    }
  },
);
