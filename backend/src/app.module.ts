import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { SkillsModule } from './skills/skills.module';
import { AboutModule } from './about/about.module';
import { ExperienceModule } from './experience/experience.module';
import { HeroModule } from './hero/hero.module';
import { SettingsModule } from './settings/settings.module';
import { SpecialtiesModule } from './specialties/specialties.module';
import * as entities from './entities';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'postgres'),
        port: configService.get('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USER', 'portfolio_user'),
        password: configService.get('DATABASE_PASSWORD', 'portfolio_pass'),
        database: configService.get('DATABASE_NAME', 'portfolio_db'),
        entities: Object.values(entities),
        synchronize: true,
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),

    // Feature modules
    AuthModule,
    ProjectsModule,
    SkillsModule,
    AboutModule,
    ExperienceModule,
    HeroModule,
    SettingsModule,
    SpecialtiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
