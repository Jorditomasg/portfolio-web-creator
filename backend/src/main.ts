import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { seedDatabase } from './database/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost', 'http://localhost:4200', 'http://localhost:80'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Set global prefix
  app.setGlobalPrefix('api');

  // Run database seeding
  const dataSource = app.get(DataSource);
  await seedDatabase(dataSource);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
}
bootstrap();
