/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Body, Get, Post, Req } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  getHello() {
    return { code: 200, message: 'OK' };
  }

  @Post('sample-unique-code')
  generateUniqueCode(@Req() req) {
    return this.userService.sampleUniqueCode();
  }

  @Post('update')
  updateUser(@Body() dto: UpdateUserDto) {
    return this.userService.updateUser(dto);
  }
}
