/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createConversation(creatorId: string, participantIds: string[]) {
    // Response format
    const response: { code: number; data: any; message: string } = {
      code: 201,
      data: null,
      message: '',
    };

    try {
      // Remove duplicate participant IDs
      const uniqueIds = [...new Set(participantIds)];

      // Add creator to the list if not already included
      if (!uniqueIds.includes(creatorId)) {
        uniqueIds.push(creatorId);
      }

      // Validate user existence and not soft deleted
      const users = await this.prisma.user.findMany({
        where: {
          id: { in: uniqueIds },
          isDeleted: '0',
        },
      });

      // Check if all participant IDs are valid
      if (users.length !== uniqueIds.length) {
        response.code = 400;
        response.message = 'One or more members do not exist or are deleted';
        return response;
      }

      // Create the conversation
      await this.prisma.$transaction(async (tx) => {
        // Check if a conversation with the same members already exists
        const existingConversation = await tx.conversation.findFirst({
          where: {
            members: {
              every: {
                userId: { in: uniqueIds },
                isDeleted: '0',
              },
            },
            isDeleted: '0',
          },
        });

        // If an existing conversation is found, return it
        if (existingConversation) {
          response.code = 200;
          response.data = existingConversation;
          response.message = 'Conversation already exists';
          return;
        }

        // Create a new conversation with the specified members
        const newConversation = await this.prisma.conversation.create({
          data: {
            members: {
              create: uniqueIds.map((id) => ({
                userId: id,
              })),
            },
          },
          include: {
            members: true,
          },
        });

        response.code = 201;
        response.data = newConversation;
        response.message = 'Conversation created successfully';
        return;
      });
    } catch (error) {
      response.code = 500;
      response.message = 'Error creating conversation: ' + error.message;
    }

    return response;
  }

  async getUserConversations(userId: string) {
    const response: { code: number; data: any; message: string } = {
      code: 200,
      data: [],
      message: 'OK',
    };

    try {
      const conversations = await this.prisma.conversation.findMany({
        where: {
          isDeleted: '0',
          members: {
            some: {
              userId,
              isDeleted: '0',
            },
          },
        },
        include: {
          members: {
            where: { isDeleted: '0' },
            include: {
              user: { select: { id: true, email: true } },
            },
          },
          messages: {
            where: { isDeleted: '0' },
            orderBy: { createdAt: 'desc' },
            take: 1, // Include only the latest message
          },
        },
      });

      // Sort conversations by the timestamp of the latest message
      const sortedConversations = conversations.sort((a, b) => {
        const aLastMessageTime = a.messages[0]?.createdAt.getTime() || 0;
        const bLastMessageTime = b.messages[0]?.createdAt.getTime() || 0;
        return bLastMessageTime - aLastMessageTime;
      });

      response.data = sortedConversations.map((conv) => ({
        id: conv.id,
        participants: conv.members.map((m) => m.user),
        lastMessage: conv.messages[0] || null,
      }));
    } catch (error) {
      response.code = 500;
      response.message = 'Error retrieving conversations: ' + error.message;
      return response;
    }

    return response;
  }

  async sendMessage(senderId: string, conversationId: string, content: string) {
    const response: { code: number; data: any; message: string } = {
      code: 201,
      data: null,
      message: 'Message is created successfully',
    };

    try {
      // Check if the conversation exists and the sender is a member
      const membership = await this.prisma.conversationMember.findFirst({
        where: {
          userId: senderId,
          conversationId: conversationId,
          isDeleted: '0',
        },
      });

      if (!membership) {
        response.code = 403;
        response.message = 'You are not a member of this conversation';
        return response;
      }

      // Check if the conversation is not deleted
      const conversation = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { isDeleted: true },
      });

      if (conversation?.isDeleted === '1') {
        response.code = 403;
        response.message = 'This conversation has been deleted';
        return response;
      }

      // Filter the content for SQL Injection and XSS attacks
      const sanitizedContent = content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;');

      // Create the message
      const message = await this.prisma.message.create({
        data: {
          conversationId,
          senderId,
          content: sanitizedContent,
        },
      });
    } catch (error) {
      response.code = 500;
      response.message = 'Error sending message: ' + error.message;
    }

    return response;
  }

  async getMessages(
    userId: string,
    conversationId: string,
    limit: number = 20,
    offset: number = 0,
    cursor?: string,
  ) {
    const response: {
      code: number;
      data: any;
      message: string;
      nextCursor: any;
    } = {
      code: 200,
      data: [],
      message: 'OK',
      nextCursor: null,
    };

    try {
      // Check if the user is a member of the conversation
      const membership = await this.prisma.conversationMember.findFirst({
        where: {
          userId,
          conversationId,
          isDeleted: '0',
        },
      });

      if (!membership) {
        response.code = 403;
        response.message = 'You are not a member of this conversation';
        return response;
      }

      // Check if the conversation is not deleted
      const conversation = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { isDeleted: true },
      });

      if (conversation?.isDeleted === '1') {
        response.code = 403;
        response.message = 'This conversation has been deleted';
        return response;
      }

      // limit maximum to 50
      limit = Math.min(limit, 50);

      // Retrieve messages for the conversation
      const messages = await this.prisma.message.findMany({
        where: {
          conversationId,
          isDeleted: '0',
        },
        include: {
          sender: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' }, // Return messages in descending order (newest first)
        take: limit,
        skip: offset,
        ...(cursor && {
          cursor: { id: cursor },
          skip: 1, // Skip the cursor message itself
        }),
      });

      const ordered = messages.reverse(); // Reverse to return messages in ascending order (oldest first)
      const nextCursor =
        messages.length === limit ? messages[messages.length - 1].id : null;

      response.data = ordered;
      response.nextCursor = nextCursor;
    } catch (error) {
      response.code = 500;
      response.message = 'Error retrieving messages: ' + error.message;
    }

    return response;
  }
}
