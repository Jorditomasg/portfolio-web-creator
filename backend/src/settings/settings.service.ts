import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PortfolioSettings } from '../entities/portfolio-settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(PortfolioSettings)
    private settingsRepository: Repository<PortfolioSettings>,
  ) {}

  async get(): Promise<PortfolioSettings | null> {
    const settings = await this.settingsRepository.find();
    return settings[0] || null;
  }

  async update(dto: UpdateSettingsDto): Promise<PortfolioSettings> {
    let settings = await this.get();
    if (!settings) {
      settings = this.settingsRepository.create(dto);
    } else {
      Object.assign(settings, dto);
    }
    return this.settingsRepository.save(settings);
  }
}
