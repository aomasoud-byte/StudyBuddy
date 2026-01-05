import { IsEnum } from 'class-validator';

export enum ReviewQuality {
  AGAIN = 'AGAIN',    // Complete blackout, incorrect
  HARD = 'HARD',      // Correct but very difficult
  GOOD = 'GOOD',      // Correct with some difficulty
  EASY = 'EASY',      // Perfect recall
}

export class ReviewFlashcardDto {
  @IsEnum(ReviewQuality)
  quality: ReviewQuality;
}
