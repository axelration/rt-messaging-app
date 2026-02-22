import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createConversation(creatorId: string, participantIds: string[]) {
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
      throw new BadRequestException(
        'One or more members do not exist or are deleted',
      );
    }

    // Create the conversation
    const conversation = await this.prisma.$transaction(async (tx) => {
      // Check if a conversation with the same members already exists
      const existingConversation = await tx.conversation.findFirst({
        where: {
          members: {
            every: {
              userId: { in: uniqueIds },
              isDeleted: '0',
            },
          },
        },
      });

      // If an existing conversation is found, return it
      if (existingConversation) {
        return existingConversation;
      }

      const newConversation = await tx.conversation.create({
        data: {},
      });

      await tx.conversationMember.createMany({
        data: uniqueIds.map((userId) => ({
          userId,
          conversationId: newConversation.id,
        })),
      });

      return newConversation;
    });

    return conversation;
  }
}
