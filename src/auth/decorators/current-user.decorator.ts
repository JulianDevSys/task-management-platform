

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUser } from '../interfaces/jwt-user.interface';


export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtUser =>
    context.switchToHttp().getRequest<{ user: JwtUser }>().user,
);