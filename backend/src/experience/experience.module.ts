import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperienceService } from './experience.service';
import { ExperienceController } from './experience.controller';
import { Experience } from '../entities/experience.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Experience]), AuthModule],
  controllers: [ExperienceController],
  providers: [ExperienceService],
  exports: [ExperienceService],
})
export class ExperienceModule {}
