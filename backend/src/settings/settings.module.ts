import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsService } from './settings.service';
import { SettingsController, FaviconController } from './settings.controller';
import { PortfolioSettings } from '../entities/portfolio-settings.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioSettings]), AuthModule],
  controllers: [SettingsController, FaviconController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
