import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  participantIds: string[];
}
