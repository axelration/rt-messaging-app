/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from './chat.service';
@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
    private chatService: ChatService,
  ) {}

  async handleConnection(client: any) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });

      // Attach user identity to socket
      client.data.user = {
        userId: payload.sub,
        email: payload.email,
      };

      // Join coversation rooms based on user ID or other criteria
      const conversations = await this.prisma.conversationMember.findMany({
        where: {
          userId: payload.sub,
          isDeleted: '0',
        },
      });

      conversations.forEach((conv) => {
        client.join(`conversation_${conv.conversationId}`);
      });
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: any, payload: any) {
    try {
      const user = client.data.user;

      // validate payload
      const message = await this.chatService.sendMessage(
        user.userId,
        payload.conversationId,
        payload.content,
      );

      if (message) {
        this.server
          .to(`conversation_${payload.conversationId}`)
          .emit('newMessage', {
            conversationId: payload.conversationId,
            message,
          });
      }
    } catch (error) {
      // Handle error (e.g., log it)
      console.error('Error handling sendMessage:', error);
    }
  }

  handleDisconnect(client: any) {
    // cleanup if needed
  }
}
