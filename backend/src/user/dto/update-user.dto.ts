import { IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'Username must be a string' })
  username?: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @IsString()
  uniqueCode?: string;

  @IsString({ message: 'Display name must be a string' })
  displayName?: string;

  @IsString()
  isDeleted?: string;

  @IsString()
  role?: string;
}
