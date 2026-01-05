import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';

export class CreateFlashcardDto {
  @IsString()
  subjectId: string;

  @IsString()
  @MaxLength(1000)
  front: string;

  @IsString()
  @MaxLength(2000)
  back: string;

  @IsOptional()
  @IsEnum(['EASY', 'MEDIUM', 'HARD'])
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';

  @IsOptional()
  tags?: string[];
}
