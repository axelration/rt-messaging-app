import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'Username should not be empty' })
  username: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
