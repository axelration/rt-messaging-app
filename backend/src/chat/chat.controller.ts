/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  All,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @All('/')
  getHello() {
    return { code: 401, message: 'Method not allowed' };
  }

  @Get('/conversations')
  getConversations() {
    return { code: 200, message: 'OK', data: 'pending' };
  }

  @Post('/conversations')
  @UseGuards(JwtAuthGuard)
  createConversation(@Req() req, @Body() dto: CreateConversationDto) {
    return this.chatService.createConversation(
      req.user.userId,
      dto.participantIds,
    );
  }
}
