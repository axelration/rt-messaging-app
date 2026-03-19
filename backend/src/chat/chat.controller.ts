/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
  Res,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @All('/')
  getHello(@Res({ passthrough: true }) res) {
    return res.status(405).json({ code: 405, message: 'Method not allowed' });
  }

  @Get('/conversations')
  @UseGuards(JwtAuthGuard)
  async getConversations(@Res({ passthrough: true }) res, @Req() req) {
    const conversations = await this.chatService.getUserConversations(
      req.user.userId,
    );
    return res.status(conversations.code).send(conversations);
  }

  @Post('/conversations')
  @UseGuards(JwtAuthGuard)
  async createConversation(
    @Res({ passthrough: true }) res,
    @Req() req,
    @Body() dto: CreateConversationDto,
  ) {
    const conversation = await this.chatService.createConversation(
      req.user.userId,
      dto.participantIds,
    );

    const statusCode =
      typeof conversation === 'object' && conversation.code
        ? conversation.code.toString()
          ? 200
          : conversation.code
        : 500;
    return res.status(statusCode).send(conversation);
  }
}
