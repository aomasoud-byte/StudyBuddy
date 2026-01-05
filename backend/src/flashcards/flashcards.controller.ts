import { Controller, Get, Post, Body, Param, Delete, Query, Patch } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import { CreateFlashcardDto, ReviewFlashcardDto } from './dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateFlashcardDto) {
    return this.flashcardsService.create(user.id, dto, user.plan);
  }

  @Get('due')
  findDueCards(@CurrentUser() user: any, @Query('subjectId') subjectId?: string) {
    return this.flashcardsService.findDueCards(user.id, subjectId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.flashcardsService.findOne(user.id, id);
  }

  @Patch(':id/review')
  review(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: ReviewFlashcardDto) {
    return this.flashcardsService.review(user.id, id, dto);
  }

  @Delete(':id')
  delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.flashcardsService.delete(user.id, id);
  }
}
