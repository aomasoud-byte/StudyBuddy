import { Controller, Post, Body, ForbiddenException } from '@nestjs/common';
import { AiService } from './ai.service';
import { PrismaService } from '../database/prisma.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { GenerateFlashcardsDto, GenerateQuizDto, TutorChatDto } from './dto';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('generate-flashcards')
  async generateFlashcards(@CurrentUser() user: any, @Body() dto: GenerateFlashcardsDto) {
    // Check AI usage limits for FREE users
    if (user.plan === 'FREE') {
      // Simple rate limiting - could be enhanced with Redis
      throw new ForbiddenException('AI generation is limited on the Free plan. Upgrade to Pro for unlimited AI usage.');
    }

    // Verify subject belongs to user
    const subject = await this.prisma.subject.findFirst({
      where: { id: dto.subjectId, userId: user.id },
    });

    if (!subject) {
      throw new ForbiddenException('Subject not found');
    }

    // Generate flashcards
    const flashcards = await this.aiService.generateFlashcards(dto.notes, subject.name);

    // Save flashcards to database
    const created = await Promise.all(
      flashcards.map((card: any) =>
        this.prisma.flashcard.create({
          data: {
            userId: user.id,
            subjectId: dto.subjectId,
            front: card.front,
            back: card.back,
            difficulty: card.difficulty || 'MEDIUM',
            tags: card.tags ? JSON.stringify(card.tags) : null,
          },
        }),
      ),
    );

    return {
      count: created.length,
      flashcards: created,
    };
  }

  @Post('generate-quiz')
  async generateQuiz(@CurrentUser() user: any, @Body() dto: GenerateQuizDto) {
    // Check AI usage limits for FREE users
    if (user.plan === 'FREE') {
      throw new ForbiddenException('AI quiz generation is limited on the Free plan. Upgrade to Pro for unlimited AI usage.');
    }

    // Verify subject
    const subject = await this.prisma.subject.findFirst({
      where: { id: dto.subjectId, userId: user.id },
    });

    if (!subject) {
      throw new ForbiddenException('Subject not found');
    }

    // Generate questions
    const questions = await this.aiService.generateQuiz(dto.topic, subject.name, dto.count || 5);

    // Save questions to database
    const created = await Promise.all(
      questions.map((q: any) =>
        this.prisma.quizQuestion.create({
          data: {
            userId: user.id,
            subjectId: dto.subjectId,
            question: q.question,
            type: q.type,
            options: q.options ? JSON.stringify(q.options) : null,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            difficulty: q.difficulty || 'MEDIUM',
            topics: q.topics ? JSON.stringify(q.topics) : null,
          },
        }),
      ),
    );

    return {
      count: created.length,
      questions: created,
    };
  }

  @Post('tutor')
  async tutorChat(@CurrentUser() user: any, @Body() dto: TutorChatDto) {
    // Verify subject
    const subject = await this.prisma.subject.findFirst({
      where: { id: dto.subjectId, userId: user.id },
    });

    if (!subject) {
      throw new ForbiddenException('Subject not found');
    }

    // Get conversation history (last 10 messages)
    const history = await this.prisma.tutorMessage.findMany({
      where: { userId: user.id, subjectId: dto.subjectId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Reverse to get chronological order
    history.reverse();

    // Build messages array
    const messages = history.map(m => ({
      role: m.role,
      content: m.content,
    }));

    // Add new user message
    messages.push({
      role: 'USER',
      content: dto.message,
    });

    // Get AI response
    const response = await this.aiService.tutorChat(messages, subject.name);

    // Save both messages
    await this.prisma.tutorMessage.createMany({
      data: [
        {
          userId: user.id,
          subjectId: dto.subjectId,
          role: 'USER',
          content: dto.message,
        },
        {
          userId: user.id,
          subjectId: dto.subjectId,
          role: 'ASSISTANT',
          content: response,
        },
      ],
    });

    return {
      response,
    };
  }
}
