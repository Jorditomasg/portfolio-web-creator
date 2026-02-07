import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  findAll() {
    return this.skillsService.findAll();
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.skillsService.findByCategory(category);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.remove(id);
  }
}
