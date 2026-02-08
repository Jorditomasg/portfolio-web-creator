import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
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
import { ContactModule } from './contact/contact.module';
import { TechnologiesModule } from './technologies/technologies.module';
import { CategoriesModule } from './categories/categories.module';
import * as entities from './entities';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),

    // TypeORM database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST', 'postgres'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get<string>('DATABASE_USER', 'portfolio_user'),
        password: configService.get<string>('DATABASE_PASSWORD', 'portfolio_pass'),
        database: configService.get<string>('DATABASE_NAME', 'portfolio_db'),
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
    ContactModule,
    TechnologiesModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
