import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HeroContent } from '../entities/hero-content.entity';
import { UpdateHeroDto } from './dto/update-hero.dto';

@Injectable()
export class HeroService {
  constructor(
    @InjectRepository(HeroContent)
    private heroRepository: Repository<HeroContent>,
  ) {}

  async get(): Promise<HeroContent | null> {
    const hero = await this.heroRepository.find();
    return hero[0] || null;
  }

  async update(dto: UpdateHeroDto): Promise<HeroContent> {
    let hero = await this.get();
    if (!hero) {
      hero = this.heroRepository.create(dto);
    } else {
      Object.assign(hero, dto);
    }
    return this.heroRepository.save(hero);
  }
}
