/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth-test')
export class AuthTestController {
  @UseGuards(JwtAuthGuard)
  @Get('/')
  getAuthTest(@Req() req) {
    return {
      message: 'This is a protected route for testing authentication.',
      user: req.user,
    };
  }
}
