import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from '../entities/project.entity';
import { Technology } from '../entities/technology.entity';
import { PortfolioSettings } from '../entities/portfolio-settings.entity';
import { findPairedRepo, GithubRepo, githubUser, matchTechnologies } from './github';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private repo: Repository<Project>,
    @InjectRepository(Technology)
    private technologiesRepo: Repository<Technology>,
    @InjectRepository(PortfolioSettings)
    private settingsRepo: Repository<PortfolioSettings>,
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

  async syncGithub(importNames: string[]) {
    const [settings] = await this.settingsRepo.find({ order: { id: 'ASC' }, take: 1 });
    const user = githubUser(settings?.github_url);
    if (!user) throw new BadRequestException('Set your GitHub URL in Settings first');

    // ponytail: first 100 repos only, paginate if you ever own more. GITHUB_TOKEN optional (60 req/h without it).
    const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&type=owner&sort=pushed`, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
    });
    if (!res.ok) throw new BadGatewayException(`GitHub API responded ${res.status}`);
    const repos = ((await res.json()) as GithubRepo[]).filter(r => !r.fork);

    const [projects, techs] = await Promise.all([
      this.repo.find({ relations: ['technology_entities'] }),
      this.technologiesRepo.find(),
    ]);

    // Pair existing projects: only fill what's empty, never overwrite hand-written content.
    const paired = new Set<string>();
    let updated = 0;
    for (const p of projects) {
      const r = findPairedRepo(p, repos);
      if (!r) continue;
      paired.add(r.full_name);
      let changed = false;
      if (!p.github_url) { p.github_url = r.html_url; changed = true; }
      if (!p.description && r.description) { p.description = r.description; changed = true; }
      if (!p.demo_url && r.homepage) { p.demo_url = r.homepage; changed = true; }
      if (!p.technology_entities?.length) {
        const t = matchTechnologies(r, techs);
        if (t.length) { p.technology_entities = t; p.technologies = t.map(x => x.name); changed = true; }
      }
      if (changed) { await this.repo.save(p); updated++; }
    }

    const toImport = repos.filter(r => !paired.has(r.full_name) && importNames.includes(r.full_name));
    let order = Math.max(0, ...projects.map(p => p.display_order));
    for (const r of toImport) {
      const t = matchTechnologies(r, techs);
      await this.repo.save(this.repo.create({
        title: r.name,
        description: r.description ?? undefined,
        github_url: r.html_url,
        demo_url: r.homepage || undefined,
        technologies: t.map(x => x.name),
        technology_entities: t,
        start_date: new Date(r.created_at),
        display_order: ++order,
      }));
      paired.add(r.full_name);
    }

    return {
      paired: paired.size - toImport.length,
      updated,
      imported: toImport.length,
      unpaired: repos
        .filter(r => !paired.has(r.full_name) && !r.archived)
        .map(r => ({
          full_name: r.full_name,
          name: r.name,
          html_url: r.html_url,
          description: r.description,
          language: r.language,
          stars: r.stargazers_count,
          pushed_at: r.pushed_at,
        })),
    };
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
