import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthTestController } from './auth.test.controller';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';
import { JwtGlobalModule } from './jwt-global.module';

@Module({
  imports: [ConfigModule, JwtGlobalModule],
  controllers: [AuthController, AuthTestController],
  providers: [AuthService, PrismaService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
