import { IsString, MaxLength } from 'class-validator';

export class GenerateFlashcardsDto {
  @IsString()
  subjectId: string;

  @IsString()
  @MaxLength(10000)
  notes: string;
}
