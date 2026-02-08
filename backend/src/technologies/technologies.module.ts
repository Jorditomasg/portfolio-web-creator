import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technology } from '../entities/technology.entity';
import { CategoriesModule } from '../categories/categories.module';
import { TechnologiesService } from './technologies.service';
import { TechnologiesController } from './technologies.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Technology]),
    CategoriesModule
  ],
  providers: [TechnologiesService],
  controllers: [TechnologiesController],
  exports: [TechnologiesService],
})
export class TechnologiesModule {}
