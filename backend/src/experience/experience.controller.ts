import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('experiences')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  findAll() { return this.experienceService.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.experienceService.findOne(id); }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateExperienceDto) { return this.experienceService.create(dto); }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateExperienceDto) {
    return this.experienceService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) { return this.experienceService.remove(id); }
}
