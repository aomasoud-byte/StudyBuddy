import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateSubjectDto, UpdateSubjectDto } from './dto';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateSubjectDto, userPlan: string) {
    // Check subject limit for FREE users
    if (userPlan === 'FREE') {
      const subjectCount = await this.prisma.subject.count({
        where: { userId, archived: false },
      });

      if (subjectCount >= 3) {
        throw new ForbiddenException('Free plan limited to 3 active subjects. Upgrade to Pro for unlimited subjects.');
      }
    }

    return this.prisma.subject.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async findAll(userId: string, includeArchived = false) {
    return this.prisma.subject.findMany({
      where: {
        userId,
        ...(includeArchived ? {} : { archived: false }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const subject = await this.prisma.subject.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: {
            flashcards: true,
            quizQuestions: true,
            mockExams: true,
          },
        },
      },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return subject;
  }

  async update(userId: string, id: string, dto: UpdateSubjectDto) {
    const subject = await this.prisma.subject.findFirst({
      where: { id, userId },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return this.prisma.subject.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    const subject = await this.prisma.subject.findFirst({
      where: { id, userId },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return this.prisma.subject.delete({
      where: { id },
    });
  }
}
