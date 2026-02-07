import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { AboutService } from './about.service';
import { UpdateAboutDto } from './dto/update-about.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  get() {
    return this.aboutService.get();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  update(@Body() updateAboutDto: UpdateAboutDto) {
    return this.aboutService.update(updateAboutDto);
  }
}
