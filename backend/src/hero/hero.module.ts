import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroService } from './hero.service';
import { HeroController } from './hero.controller';
import { HeroContent } from '../entities/hero-content.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([HeroContent]), AuthModule],
  controllers: [HeroController],
  providers: [HeroService],
  exports: [HeroService],
})
export class HeroModule {}
