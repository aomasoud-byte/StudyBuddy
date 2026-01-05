import { IsString, IsOptional, IsDateString, MaxLength } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsDateString()
  examDate?: string;
}
