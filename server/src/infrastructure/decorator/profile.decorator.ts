import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentProfileId = createParamDecorator(async (data: any, ctx: ExecutionContext) => {
  const headers = ctx.switchToHttp().getRequest().headers;
  return Number(headers['profile_id']);
});
