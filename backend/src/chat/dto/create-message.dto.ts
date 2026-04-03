import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  conversationId: string;

  @IsString()
  @MinLength(1, { message: 'Message content cannot be empty' })
  content: string;
}
