import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtGlobalModule } from 'src/auth/jwt-global.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from 'src/auth/jwt.strategy/jwt.strategy';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [ConfigModule, JwtGlobalModule],
  providers: [ChatService, PrismaService, JwtStrategy, ChatGateway],
  controllers: [ChatController],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}
