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
      data: null,
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
}
