import { Controller, Get, Put, Body, UseGuards, Header } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { buildFavicon } from './favicon';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  get() { return this.settingsService.get(); }

  @Put()
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: UpdateSettingsDto) { return this.settingsService.update(dto); }
}

@Controller()
export class FaviconController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('favicon.svg')
  @Header('Content-Type', 'image/svg+xml')
  @Header('Cache-Control', 'public, max-age=3600')
  async favicon() {
    const settings = await this.settingsService.get();
    return buildFavicon(settings?.favicon_type, settings?.accent_color);
  }
}
