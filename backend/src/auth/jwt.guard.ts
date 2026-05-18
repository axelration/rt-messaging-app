/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): TUser {
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          statusCode: 401,
          message: 'Authentication token expired',
          errorCode: 'TOKEN_EXPIRED',
          error: 'Unauthorized',
        });
      }

      if (info?.message === 'No auth token') {
        throw new UnauthorizedException({
          statusCode: 401,
          message: 'Authentication token required',
          errorCode: 'TOKEN_REQUIRED',
          error: 'Unauthorized',
        });
      }

      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Invalid authentication token',
        errorCode: 'TOKEN_INVALID',
        error: 'Unauthorized',
      });
    }
    return user;
  }
}
