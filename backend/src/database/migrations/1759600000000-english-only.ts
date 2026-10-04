import { MigrationInterface, QueryRunner } from 'typeorm';

// Base columns held Spanish, `*_en` held English. Site is English-only now:
// copy English into the base column (only when non-empty) and drop `*_en`.
// Every touched table is first copied to `_backup_<table>` so nothing is lost.
// No-op on fresh databases (tables don't exist yet; synchronize creates them afterwards).
const TEXT_FIELDS: Record<string, string[]> = {
  projects: ['title', 'description', 'long_description'],
  experiences: ['title', 'description'],
  about_content: ['bio'],
  hero_content: ['title', 'title_highlight', 'subtitle', 'description'],
  specialties: ['title', 'description'],
  categories: ['long_title', 'short_title', 'description'],
};
const ARRAY_FIELDS: Record<string, string[]> = {
  experiences: ['achievements'],
  about_content: ['highlights'],
};

export class EnglishOnly1759600000000 implements MigrationInterface {
  name = 'EnglishOnly1759600000000';

  async up(q: QueryRunner): Promise<void> {
    const tables = new Set([...Object.keys(TEXT_FIELDS), ...Object.keys(ARRAY_FIELDS)]);

    for (const table of tables) {
      const text = TEXT_FIELDS[table] ?? [];
      const arrays = ARRAY_FIELDS[table] ?? [];
      const all = [...text, ...arrays];
      const present: string[] = [];
      for (const c of all) if (await q.hasColumn(table, `${c}_en`)) present.push(c);
      if (present.length === 0) continue;

      await q.query(`CREATE TABLE IF NOT EXISTS "_backup_${table}" AS TABLE "${table}"`);
      for (const c of present) {
        const hasEnglish = arrays.includes(c)
          ? `cardinality("${c}_en") > 0`
          : `NULLIF(btrim("${c}_en"), '') IS NOT NULL`;
        await q.query(`UPDATE "${table}" SET "${c}" = "${c}_en" WHERE ${hasEnglish}`);
        await q.query(`ALTER TABLE "${table}" DROP COLUMN "${c}_en"`);
      }
    }

    // Contact form + SMTP settings are removed from the entity; synchronize drops those
    // columns right after this migration, so back the row up first.
    if (await q.hasColumn('portfolio_settings', 'smtp_host')) {
      await q.query(`CREATE TABLE IF NOT EXISTS "_backup_portfolio_settings" AS TABLE "portfolio_settings"`);
    }
    // `contacts` table is left untouched: synchronize never drops tables, only columns.
  }

  async down(): Promise<void> {
    // Restore manually from the _backup_* tables if ever needed.
  }
}
