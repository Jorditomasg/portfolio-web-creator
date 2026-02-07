import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialtiesService } from './specialties.service';
import { SpecialtiesController } from './specialties.controller';
import { Specialty } from '../entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Specialty]), AuthModule],
  controllers: [SpecialtiesController],
  providers: [SpecialtiesService],
})
export class SpecialtiesModule {}
