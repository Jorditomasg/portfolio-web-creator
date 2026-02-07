import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from '../entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
  ) {}

  async findAll(): Promise<Skill[]> {
    return this.skillsRepository.find({
      order: { category: 'ASC', display_order: 'ASC' },
    });
  }

  async findByCategory(category: string): Promise<Skill[]> {
    return this.skillsRepository.find({
      where: { category: category as any },
      order: { display_order: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Skill> {
    const skill = await this.skillsRepository.findOne({ where: { id } });
    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }
    return skill;
  }

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    const skill = this.skillsRepository.create(createSkillDto);
    return this.skillsRepository.save(skill);
  }

  async update(id: number, updateSkillDto: UpdateSkillDto): Promise<Skill> {
    const skill = await this.findOne(id);
    Object.assign(skill, updateSkillDto);
    return this.skillsRepository.save(skill);
  }

  async remove(id: number): Promise<void> {
    const skill = await this.findOne(id);
    await this.skillsRepository.remove(skill);
  }
}
