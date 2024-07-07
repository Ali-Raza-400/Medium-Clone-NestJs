import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  console.log('data😉😉😉😉', request.user);

  if (!request.user) {
    null;
  }
  if (data) {
    return request.user[data];
  }
  return request.user;
});
