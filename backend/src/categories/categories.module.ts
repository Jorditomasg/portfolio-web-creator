import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from '../entities/category.entity';
import { Technology } from '../entities/technology.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Technology])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
