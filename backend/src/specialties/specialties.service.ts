import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialty } from '../entities';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';

@Injectable()
export class SpecialtiesService {
  constructor(
    @InjectRepository(Specialty)
    private specialtiesRepository: Repository<Specialty>,
  ) {}

  async findAll(): Promise<Specialty[]> {
    return this.specialtiesRepository.find({
      order: { display_order: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Specialty> {
    const specialty = await this.specialtiesRepository.findOne({ where: { id } });
    if (!specialty) throw new NotFoundException(`Specialty #${id} not found`);
    return specialty;
  }

  async create(createDto: CreateSpecialtyDto): Promise<Specialty> {
    const specialty = this.specialtiesRepository.create(createDto);
    return this.specialtiesRepository.save(specialty);
  }

  async update(id: number, updateDto: UpdateSpecialtyDto): Promise<Specialty> {
    const specialty = await this.findOne(id);
    Object.assign(specialty, updateDto);
    return this.specialtiesRepository.save(specialty);
  }

  async remove(id: number): Promise<void> {
    const specialty = await this.findOne(id);
    await this.specialtiesRepository.remove(specialty);
  }
}
