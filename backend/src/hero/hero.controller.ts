import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { HeroService } from './hero.service';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get()
  get() { return this.heroService.get(); }

  @Put()
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: UpdateHeroDto) { return this.heroService.update(dto); }
}
