/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import generateUnique from 'src/common/utils/unique-code.util';
import { validate } from 'class-validator';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async updateUser(dto: any) {
    const { userId, ...updateData } = dto;

    await validate(updateData).then((errors) => {
      if (errors.length > 0) {
        console.log(errors);
        throw new BadRequestException(
          'Input validation failed: ' +
            errors
              .map((e) => Object.values(e.constraints || {}).join(', '))
              .join('; '),
        );
      }
    });

    try {
      const res = await this.prisma.user.update({
        where: { id: userId },
        data: { ...updateData, updatedAt: new Date() },
      });

      return { code: 200, message: 'User updated successfully', data: res };
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  async sampleUniqueCode(): Promise<string> {
    return this.generateUniqueCode();
  }

  // Create unique code for the user, ensuring it doesn't already exist in the database
  private async generateUniqueCode(): Promise<string> {
    let uniqueCode: string = generateUnique();
    let isUnique = false;

    while (!isUnique) {
      const existingCode = await this.prisma.user.findUnique({
        where: { uniqueCode },
      });
      if (!existingCode) {
        isUnique = true;
      } else {
        uniqueCode = generateUnique();
      }
    }

    return uniqueCode;
  }
}
