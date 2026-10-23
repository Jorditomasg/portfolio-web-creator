# Improvement Plan

## Phase 1 — Done (this change)

| Change | Notes |
|---|---|
| English only | `TranslationService` and language toggle removed. DB: `*_en` columns merged into base columns by migration `EnglishOnly1759600000000`. |
| Contact form removed | Contact page shows `mailto:` + LinkedIn/GitHub. Removed: contact module, mail service, `nodemailer`, admin "Messages", SMTP settings. |
| Visitor analytics | Self-hosted **Umami** (countries, cities, referrers, devices, pages) in `docker-compose.yml`, own DB. Configured from Admin → Settings → Analytics. |
| Security: SMTP password leak | `GET /api/settings` is public and returned `smtp_pass` in plain text. Columns are gone now. |
| Security: login brute force | `ThrottlerModule` was registered but never applied. Login now limited to 5 req/min. |
| Seed bug | Sample projects/experiences/technologies were re-created whenever one of those tables was empty. Now only on a brand-new install. |
| Pair projects with GitHub | Admin → Projects → **Sync with GitHub** (user taken from Settings → GitHub URL). Existing projects are paired by `github_url` or by title = repo name, and only EMPTY fields are filled (github url, description, demo url, technologies from language + topics). Unpaired repos are listed with checkboxes, and only the ones you tick get imported. Forks are skipped. Optional `GITHUB_TOKEN` env var raises the API limit from 60 to 5000 req/h. |
| Build bug | `@types/multer` was missing (`Express.Multer` didn't type-check). |
| Migration safety | `seed.js` (run before the app by compose/entrypoint) had its own `synchronize: true` and would have dropped `*_en` columns before any data was moved. Both now share `src/database/data-source.options.ts`, which runs migrations **before** synchronize. |

### How the DB migration protects data
1. Copies every touched table to `_backup_<table>` (projects, experiences, about_content, hero_content, specialties, categories, portfolio_settings).
2. For each field, copies English into the base column **only if English is not empty**. Rows that only had Spanish keep their Spanish text, so nothing becomes blank.
3. Drops the `*_en` columns. Synchronize then drops the contact/SMTP settings columns and adds `umami_url`, `umami_website_id`.
4. The `contacts` table (old messages) is **not** dropped.

Tested against Postgres 16 with the old schema + data, re-run (idempotent), and fresh install.

## Deploy runbook (server)

```bash
# 1. Backup (BEFORE anything else)
docker exec portfolio-db pg_dump -U portfolio_user portfolio_db > backup_$(date +%F).sql
tar czf uploads_$(date +%F).tgz uploads/

# 2. Add to .env
UMAMI_APP_SECRET=$(openssl rand -hex 32)
UMAMI_DB_PASSWORD=<something strong>

# 3. Deploy
git pull
docker compose up -d --build

# 4. Check the migration ran
docker compose logs backend | grep -i -E "migration|EnglishOnly|error"
docker exec portfolio-db psql -U portfolio_user portfolio_db -c "SELECT name FROM migrations"

# 5. Find content that had NO English (still in Spanish, translate in admin)
docker exec portfolio-db psql -U portfolio_user portfolio_db -c \
  "SELECT id, title FROM _backup_projects WHERE coalesce(btrim(title_en),'') = ''"
```

6. Umami: open `http://<server>:3001`, log in `admin` / `umami`, **change the password**, add a website,
   route a subdomain to it in Traefik (e.g. `stats.yourdomain`), then fill Admin → Settings → Analytics.
   Exclude your own visits: `localStorage.setItem('umami.disabled', 1)` in the browser console on your site.
7. After a few weeks with everything OK: `DROP TABLE _backup_projects, _backup_experiences, ...;` (and `contacts` if you don't want old messages).

**Rollback:** `psql < backup_<date>.sql` into a fresh DB + previous image/commit.

**If the server uses the all-in-one image (`deploy/`)** instead of the root compose: rebuild and push the image
(MAINTAINER.md). The entrypoint runs `seed.js`, which now runs the migration first, so it's equally safe.
Copy the `umami` + `umami-db` services into `deploy/docker-compose.yml`.

### Note on "IP logger"
Umami deliberately does **not** store raw IPs (GDPR-friendly). It resolves them to country/region/city and discards them.
If you really need raw IPs, add **GoAccess** on top of the Traefik access log. Same "already built" approach, but you're
storing personal data, which in the EU needs a privacy notice.

## Phase 2 — Next (recommended order)

1. **Stop `synchronize: true` in prod.** Generate a baseline migration and switch to migrations only. Today any entity
   rename silently drops a column on boot. This change works around it, but the trap stays armed.
2. **Remove legacy data model duplication:** `Project.technologies` (string[]) vs `technology_entities`;
   `Technology.category` (string) vs `category_id`; `Skill` entity/module (seed says skills were merged into technologies);
   `Specialty.technologies` simple-array. Each needs a small data migration like this one.
3. **One deployment path.** Currently: root compose (3 containers), root `Dockerfile` (all-in-one with an rsync-into-volume
   hack), and `deploy/` (another compose + an nginx.conf pointing to `frontend:80`, which doesn't match the root setup). Keep one.
4. **Insecure defaults:** compose falls back to `JWT_SECRET=secret`, `ADMIN_PASSWORD=admin123`. Use `:?` (fail if missing) like `deploy/` does.
5. **SEO:** SPA without SSR/prerender, so crawlers and link previews see an empty page. Angular prerender of public routes is cheap.
6. **Tests:** essentially none. At least one e2e smoke (public endpoints + login) and the migration test as a script.
