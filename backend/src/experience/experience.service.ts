import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from '../entities/experience.entity';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
  ) {}

  async findAll(): Promise<Experience[]> {
    return this.experienceRepository.find({ order: { display_order: 'ASC', start_date: 'DESC' } });
  }

  async findOne(id: number): Promise<Experience> {
    const exp = await this.experienceRepository.findOne({ where: { id } });
    if (!exp) throw new NotFoundException(`Experience with ID ${id} not found`);
    return exp;
  }

  async create(dto: CreateExperienceDto): Promise<Experience> {
    const exp = this.experienceRepository.create(dto);
    return this.experienceRepository.save(exp);
  }

  async update(id: number, dto: UpdateExperienceDto): Promise<Experience> {
    const exp = await this.findOne(id);
    Object.assign(exp, dto);
    return this.experienceRepository.save(exp);
  }

  async remove(id: number): Promise<void> {
    const exp = await this.findOne(id);
    await this.experienceRepository.remove(exp);
  }
}
