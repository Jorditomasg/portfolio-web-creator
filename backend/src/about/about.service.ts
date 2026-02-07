import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AboutContent } from '../entities/about-content.entity';
import { UpdateAboutDto } from './dto/update-about.dto';

@Injectable()
export class AboutService {
  constructor(
    @InjectRepository(AboutContent)
    private aboutRepository: Repository<AboutContent>,
  ) {}

  async get(): Promise<AboutContent | null> {
    const about = await this.aboutRepository.find();
    return about[0] || null;
  }

  async update(updateAboutDto: UpdateAboutDto): Promise<AboutContent> {
    let about = await this.get();
    if (!about) {
      about = this.aboutRepository.create(updateAboutDto);
    } else {
      Object.assign(about, updateAboutDto);
    }
    return this.aboutRepository.save(about);
  }
}
