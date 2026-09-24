import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedSocket } from '../types/authenticated-socket';

export const CurrentUserId = createParamDecorator(
  (_data: never, ctx: ExecutionContext): string | undefined => {
    if (ctx.getType() === 'ws') {
      const client = ctx.switchToWs().getClient<AuthenticatedSocket>();
      return client.user?.sub;
    }
    const request = ctx.switchToHttp().getRequest();
    return request.user?.sub;
  },
);