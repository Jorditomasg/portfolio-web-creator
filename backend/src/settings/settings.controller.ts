import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  get() { return this.settingsService.get(); }

  @Put()
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: UpdateSettingsDto) { return this.settingsService.update(dto); }
}
