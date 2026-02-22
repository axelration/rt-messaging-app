import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtGlobalModule } from 'src/auth/jwt-global.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from 'src/auth/jwt.strategy/jwt.strategy';

@Module({
  imports: [ConfigModule, JwtGlobalModule],
  providers: [ChatService, PrismaService, JwtStrategy],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
