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

    const token = this.jwtService.sign({ id: user.id, email: user.email });

    return { access_token: token };
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

    const token = this.jwtService.sign({ id: user.id, email: user.email });

    return { access_token: token };
  }
}
