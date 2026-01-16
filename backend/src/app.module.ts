import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './chat/chat.gateway';

ConfigModule.forRoot({
  isGlobal: true,
})

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})

export class AppModule {}
