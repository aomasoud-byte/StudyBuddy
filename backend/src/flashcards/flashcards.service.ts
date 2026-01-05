import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateFlashcardDto, ReviewFlashcardDto, ReviewQuality } from './dto';

@Injectable()
export class FlashcardsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateFlashcardDto, userPlan: string) {
    // Check flashcard limit for FREE users
    if (userPlan === 'FREE') {
      const flashcardCount = await this.prisma.flashcard.count({
        where: { userId },
      });

      if (flashcardCount >= 200) {
        throw new ForbiddenException('Free plan limited to 200 flashcards. Upgrade to Pro for unlimited flashcards.');
      }
    }

    // Verify subject belongs to user
    const subject = await this.prisma.subject.findFirst({
      where: { id: dto.subjectId, userId },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return this.prisma.flashcard.create({
      data: {
        userId,
        subjectId: dto.subjectId,
        front: dto.front,
        back: dto.back,
        difficulty: dto.difficulty || 'MEDIUM',
        tags: dto.tags ? JSON.stringify(dto.tags) : null,
      },
    });
  }

  async findDueCards(userId: string, subjectId?: string) {
    const now = new Date();

    return this.prisma.flashcard.findMany({
      where: {
        userId,
        ...(subjectId && { subjectId }),
        scheduledReviewAt: { lte: now },
        mastered: false,
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: { scheduledReviewAt: 'asc' },
      take: 50, // Limit to 50 cards per session
    });
  }

  async findOne(userId: string, id: string) {
    const flashcard = await this.prisma.flashcard.findFirst({
      where: { id, userId },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    if (!flashcard) {
      throw new NotFoundException('Flashcard not found');
    }

    return flashcard;
  }

  async review(userId: string, id: string, dto: ReviewFlashcardDto) {
    const flashcard = await this.prisma.flashcard.findFirst({
      where: { id, userId },
    });

    if (!flashcard) {
      throw new NotFoundException('Flashcard not found');
    }

    // Calculate new scheduling using SM-2 algorithm
    const scheduling = this.calculateSpacedRepetition(
      flashcard.easeFactor,
      flashcard.intervalDays,
      flashcard.repetitions,
      dto.quality,
    );

    const now = new Date();
    const scheduledReviewAt = new Date(now);
    scheduledReviewAt.setDate(scheduledReviewAt.getDate() + scheduling.intervalDays);

    // Update flashcard
    const updated = await this.prisma.flashcard.update({
      where: { id },
      data: {
        easeFactor: scheduling.easeFactor,
        intervalDays: scheduling.intervalDays,
        repetitions: scheduling.repetitions,
        lastReviewedAt: now,
        scheduledReviewAt,
        mastered: scheduling.intervalDays >= 21, // Consider mastered after 21+ days
      },
    });

    // Award XP to user
    const xpGained = this.calculateXP(dto.quality);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: xpGained },
      },
    });

    return {
      ...updated,
      xpGained,
    };
  }

  async delete(userId: string, id: string) {
    const flashcard = await this.prisma.flashcard.findFirst({
      where: { id, userId },
    });

    if (!flashcard) {
      throw new NotFoundException('Flashcard not found');
    }

    return this.prisma.flashcard.delete({
      where: { id },
    });
  }

  /**
   * SM-2 Spaced Repetition Algorithm
   * https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
   */
  private calculateSpacedRepetition(
    currentEaseFactor: number,
    currentInterval: number,
    currentRepetitions: number,
    quality: ReviewQuality,
  ): { easeFactor: number; intervalDays: number; repetitions: number } {
    // Map quality to numeric value (0-5 scale)
    const qualityMap = {
      [ReviewQuality.AGAIN]: 0,
      [ReviewQuality.HARD]: 3,
      [ReviewQuality.GOOD]: 4,
      [ReviewQuality.EASY]: 5,
    };

    const q = qualityMap[quality];

    // Calculate new ease factor
    let newEaseFactor = currentEaseFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

    // Ensure ease factor stays above minimum
    if (newEaseFactor < 1.3) {
      newEaseFactor = 1.3;
    }

    let newRepetitions = currentRepetitions;
    let newInterval = currentInterval;

    if (q < 3) {
      // Incorrect or hard - reset repetitions
      newRepetitions = 0;
      newInterval = 1;
    } else {
      // Correct - increase interval
      newRepetitions += 1;

      if (newRepetitions === 1) {
        newInterval = 1;
      } else if (newRepetitions === 2) {
        newInterval = 6;
      } else {
        newInterval = Math.round(currentInterval * newEaseFactor);
      }
    }

    return {
      easeFactor: newEaseFactor,
      intervalDays: newInterval,
      repetitions: newRepetitions,
    };
  }

  private calculateXP(quality: ReviewQuality): number {
    const xpMap = {
      [ReviewQuality.AGAIN]: 2,
      [ReviewQuality.HARD]: 5,
      [ReviewQuality.GOOD]: 10,
      [ReviewQuality.EASY]: 15,
    };

    return xpMap[quality];
  }
}
