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
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @All('/')
  getHello(@Res({ passthrough: true }) res) {
    return res.status(405).json({ code: 405, message: 'Method not allowed' });
  }

  @Get('/test')
  test() {
    return { message: 'Chat controller is working!' };
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

  @Post('/messages')
  @UseGuards(JwtAuthGuard)
  async sendMessage(
    @Res({ passthrough: true }) res,
    @Req() req,
    @Body() dto: CreateMessageDto,
  ) {
    const response = await this.chatService.sendMessage(
      req.user.userId,
      dto.conversationId,
      dto.content,
    );
    return res.status(response.code).send(response);
  }

  @Get('conversations/:id/messages')
  @UseGuards(JwtAuthGuard)
  async getMessages(
    @Res({ passthrough: true }) res,
    @Req() req,
    @Param('id') conversationId: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
    @Query('cursor') cursor?: string,
  ) {
    const messages = await this.chatService.getMessages(
      req.user.userId,
      conversationId,
      limit,
      offset,
      cursor,
    );
    return res.status(messages.code).send(messages);
  }
}
