import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Technology } from '../entities/technology.entity';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../entities/category.entity';

interface DeviconEntry {
  name: string;
  tags: string[];
  versions: {
    svg: string[];
    font: string[];
  };
  color: string;
  aliases: string[];
}

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectRepository(Technology)
    private repo: Repository<Technology>,
    private categoriesService: CategoriesService,
  ) {}

  findAll() {
    return this.repo.find({ 
      order: { 
        show_in_about: 'DESC', // Skills first? or by name. Let's sort by name generally
        name: 'ASC' 
      } 
    });
  }

  getSkills() {
    return this.repo.find({
      where: { show_in_about: true },
      order: {
        display_order: 'ASC',
        name: 'ASC'
      }
    });
  }

  async create(technology: Partial<Technology>) {
    // If category name provided but not entity, try to resolve it
    if (technology.category && !technology.category_entity) {
      const category = await this.categoriesService.create({ name: technology.category, color: '#F5A623' })
        .catch(async () => await this.repo.manager.findOne(Category, { where: { name: technology.category } }));
      
      if (category) {
        technology.category_entity = category;
        technology.category_id = category.id;
      }
    }
    return this.repo.save(technology);
  }

  async update(id: number, technology: Partial<Technology>) {
    // If category name provided but not entity, try to resolve it
    if (technology.category) {
       const category = await this.repo.manager.findOne(Category, { where: { name: technology.category } });
       if (category) {
         technology.category_entity = category;
         technology.category_id = category.id;
       } else {
         // Create if not exists (fallback)
         const newCategory = await this.categoriesService.create({ name: technology.category, color: '#F5A623' }).catch(() => null);
         if (newCategory) {
            technology.category_entity = newCategory;
            technology.category_id = newCategory.id;
         }
       }
    }
    
    await this.repo.update(id, technology);
    return this.repo.findOneBy({ id });
  }

  private deviconCache: DeviconEntry[] | null = null;

  async searchIcons(query: string) {
    if (!this.deviconCache) {
      try {
        const response = await fetch('https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.json');
        if (!response.ok) {
           throw new Error(`Failed to fetch devicon.json: ${response.statusText}`);
        }
        this.deviconCache = await response.json() as DeviconEntry[];
      } catch (error) {
        console.error('Failed to fetch devicon.json', error);
        return [];
      }
    }

    if (!query || !this.deviconCache) return [];

    const lowerQuery = query.toLowerCase();
    
    try {
      // Filter devicons
      const matches = this.deviconCache.filter(icon => {
        if (!icon || !icon.name) return false;
        return icon.name.toLowerCase().includes(lowerQuery) || 
          (icon.tags && Array.isArray(icon.tags) && icon.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      });

      // Map to simple structure
      return matches.map(icon => {
        // Safe access to versions.svg
        const svgVersions = icon.versions?.svg || [];
        // Prioritize 'original' then 'plain', fallback to the first available or 'original' default
        const version = svgVersions.includes('original') ? 'original' : (svgVersions[0] || 'original');
        
        return {
          name: icon.name,
          icon: `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${icon.name}/${icon.name}-${version}.svg`
        };
      }).slice(0, 10); // Limit results
    } catch (error) {
      console.error('Error filtering/mapping icons', error);
      return [];
    }
  }

  delete(id: number) {
    return this.repo.delete(id);
  }
}
