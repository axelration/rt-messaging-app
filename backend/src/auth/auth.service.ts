/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { validate } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    if (!dto || !dto.email || !dto.username || !dto.password) {
      throw new BadRequestException('Missing required fields');
    }

    // Validate input using class-validator (Prevent UnknownValue issues)
    const data = new RegisterDto();
    data.email = dto.email;
    data.username = dto.username;
    data.password = dto.password;

    await validate(data).then((errors) => {
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

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        password: hashedPassword,
      },
    });

    const token = await this.generateToken(user.id, user.email);

    await this.storeRefreshToken(user.id, token.refreshToken);

    return { access_token: token.accessToken, message: 'OK' };
  }

  async login(dto: LoginDto) {
    if (!dto || !dto.email || !dto.password) {
      throw new BadRequestException('Missing required fields');
    }

    // Validate input using class-validator (Prevent UnknownValue issues)
    const data = new LoginDto();
    data.email = dto.email;
    data.password = dto.password;

    await validate(data).then((errors) => {
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

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token and refresh token
    const token = await this.generateToken(user.id, user.email);

    // Store the refresh token in the database (hashed)
    await this.storeRefreshToken(user.id, token.refreshToken);

    return { access_token: token, message: 'OK' };
  }

  private async generateToken(userId: string, email: string) {
    const payload = { id: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedToken },
    });
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newToken = await this.generateToken(user.id, user.email);

      await this.storeRefreshToken(user.id, newToken.refreshToken);

      return { access_token: newToken.accessToken, message: 'OK' };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
