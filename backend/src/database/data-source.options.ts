import { DataSourceOptions } from 'typeorm';
import * as entities from '../entities';
import { EnglishOnly1759600000000 } from './migrations/1759600000000-english-only';

// Shared by the Nest app AND the standalone seed (dist/database/seed.js), so whichever
// starts first runs the migrations. TypeORM runs migrations BEFORE synchronize, which is
// what lets a migration move data out of columns that synchronize is about to drop.
// ponytail: synchronize kept for fresh installs; switch to migrations-only if the schema starts changing often.
export const dataSourceOptions = (): DataSourceOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'postgres',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'portfolio_user',
  password: process.env.DATABASE_PASSWORD || 'portfolio_pass',
  database: process.env.DATABASE_NAME || 'portfolio_db',
  entities: Object.values(entities),
  migrations: [EnglishOnly1759600000000],
  migrationsRun: true,
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
});
