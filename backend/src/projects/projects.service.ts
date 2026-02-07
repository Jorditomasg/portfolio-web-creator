import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({
      order: { display_order: 'ASC', created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create(createProjectDto);
    return this.projectsRepository.save(project);
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    Object.assign(project, updateProjectDto);

    return this.projectsRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectsRepository.remove(project);
  }
}
