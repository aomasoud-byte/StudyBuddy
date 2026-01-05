import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto, UpdateSubjectDto } from './dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateSubjectDto) {
    return this.subjectsService.create(user.id, dto, user.plan);
  }

  @Get()
  findAll(@CurrentUser() user: any, @Query('includeArchived') includeArchived?: string) {
    return this.subjectsService.findAll(user.id, includeArchived === 'true');
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.subjectsService.findOne(user.id, id);
  }

  @Patch(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateSubjectDto) {
    return this.subjectsService.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.subjectsService.remove(user.id, id);
  }
}
