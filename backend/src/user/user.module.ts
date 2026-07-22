import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtGlobalModule } from 'src/auth/jwt-global.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { JwtStrategy } from 'src/auth/jwt.strategy/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [ConfigModule, JwtGlobalModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
