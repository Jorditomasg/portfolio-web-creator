import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from '../entities/project.entity';
import { Technology } from '../entities/technology.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private repo: Repository<Project>,
    @InjectRepository(Technology)
    private technologiesRepo: Repository<Technology>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.repo.find({
      order: { display_order: 'ASC', created_at: 'DESC' },
      relations: ['technology_entities']
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.repo.findOne({ 
      where: { id },
      relations: ['technology_entities']
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.repo.create(createProjectDto);
    
    // Resolve technologies relations
    if (createProjectDto.technologies && createProjectDto.technologies.length > 0) {
      project.technology_entities = await this.resolveTechnologies(createProjectDto.technologies);
    }

    return this.repo.save(project);
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    // Update basic fields
    Object.assign(project, updateProjectDto);

    // Resolve technologies relations if provided
    if (updateProjectDto.technologies) {
      project.technology_entities = await this.resolveTechnologies(updateProjectDto.technologies);
    } else if (updateProjectDto.technologies === null) {
      project.technology_entities = [];
    }

    return this.repo.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.repo.remove(project);
  }

  // Helper to find technologies based on names
  private async resolveTechnologies(names: string[]): Promise<Technology[]> {
    if (!names.length) return [];
    
    // We utilize In operator to find matching technologies
    // Note: This assumes exact name match. 
    // If case-insensitive needed, we might need a different approach or ensure normalization.
    return this.technologiesRepo.find({
      where: { name: In(names) }
    });
  }
}
