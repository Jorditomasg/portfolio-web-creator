import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SpecialtiesService } from './specialties.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('specialties')
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Get()
  findAll() {
    return this.specialtiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialtiesService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createDto: CreateSpecialtyDto) {
    return this.specialtiesService.create(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateDto: UpdateSpecialtyDto) {
    return this.specialtiesService.update(+id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.specialtiesService.remove(+id);
  }
}
