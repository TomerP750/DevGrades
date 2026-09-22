import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (_data: never, ctx: ExecutionContext): string | undefined => {
    if (ctx.getType() == 'ws') {
      const client = ctx.switchToWs().getClient();
      return client._data.user.sub;
    }
    const request = ctx.switchToHttp().getRequest();
    return request.user?.sub;
  },
);