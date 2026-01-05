import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class GenerateQuizDto {
  @IsString()
  subjectId: string;

  @IsString()
  topic: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  count?: number;
}
