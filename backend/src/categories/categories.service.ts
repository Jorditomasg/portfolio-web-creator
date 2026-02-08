import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({ order: { display_order: 'ASC', name: 'ASC' } });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async create(createCategoryDto: Partial<Category>): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async update(id: number, updateCategoryDto: Partial<Category>): Promise<Category> {
    await this.categoriesRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.categoriesRepository.delete(id);
  }

  // Helper to ensure default categories exist
  async ensureDefaultCategories() {
    const defaults = [
      { name: 'Frontend', color: '#3B82F6', display_order: 1 },
      { name: 'Backend', color: '#10B981', display_order: 2 },
      { name: 'Tools', color: '#F59E0B', display_order: 3 },
      { name: 'Database', color: '#8B5CF6', display_order: 4 },
      { name: 'DevOps', color: '#EF4444', display_order: 5 },
      { name: 'Mobile', color: '#EC4899', display_order: 6 },
    ];

    for (const def of defaults) {
      const exists = await this.categoriesRepository.findOne({ where: { name: def.name } });
      if (!exists) {
        await this.categoriesRepository.save(def);
      }
    }
  }
}
