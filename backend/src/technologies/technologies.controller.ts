import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { TechnologiesService } from './technologies.service';
import { Technology } from '../entities/technology.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('technologies')
export class TechnologiesController {
  constructor(private readonly service: TechnologiesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.service.searchIcons(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() technology: Partial<Technology>) {
    return this.service.create(technology);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() technology: Partial<Technology>) {
    return this.service.update(+id, technology);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
