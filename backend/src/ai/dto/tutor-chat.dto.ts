import { IsString, MaxLength } from 'class-validator';

export class TutorChatDto {
  @IsString()
  subjectId: string;

  @IsString()
  @MaxLength(1000)
  message: string;
}
