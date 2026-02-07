import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { AboutContent } from '../entities/about-content.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([AboutContent]), AuthModule],
  controllers: [AboutController],
  providers: [AboutService],
  exports: [AboutService],
})
export class AboutModule {}
