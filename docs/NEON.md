# Neon PostgreSQL setup (free tier)

[Neon](https://neon.tech) provides a free serverless PostgreSQL database that pairs well
with Vercel. This project needs **two** connection strings: a *pooled* one for the running
app and a *direct* one for migrations.

## 1. Create a project

1. Sign up / log in at <https://console.neon.tech>.
2. **Create Project** → pick a name (e.g. `pmmi`) and a region close to your Vercel region
   (e.g. Singapore `ap-southeast-1` for Indonesia).
3. Neon creates a default database named `neondb`.

## 2. Get the connection strings

In the project dashboard → **Connection Details**:

1. **Pooled** connection (toggle *"Pooled connection"* **on**). Copy it → this is
   `DATABASE_URL`. It contains `-pooler` in the host and should end with `?sslmode=require`.
2. **Direct** connection (toggle *"Pooled connection"* **off**). Copy it → this is
   `DIRECT_URL`.

Example:

```env
DATABASE_URL="postgresql://neondb_owner:xxxx@ep-cool-name-123456-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://neondb_owner:xxxx@ep-cool-name-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

> Prisma uses `DATABASE_URL` at runtime and `DIRECT_URL` for `migrate`/`db push`. Pooled
> connections don't support the advisory locks that migrations need — hence the split.

## 3. Apply the schema

Locally (with `.env` filled in):

```bash
# Option A — apply the committed migration (recommended, reproducible):
npm run db:migrate:deploy

# Option B — push the schema without migration history (quick prototyping):
npm run db:push
```

## 4. Seed demo data

```bash
npm run db:seed
```

This inserts 14 days of scrap prices across 4 categories, 5 job openings, and the editable
contact-info entries used by the footer/contact page.

## 5. Verify

```bash
npm run db:studio     # browse tables in Prisma Studio
```

## Free-tier notes

- The free plan includes one project with generous limits for a company site.
- Neon **auto-suspends** idle databases; the first request after idle may take ~1s to wake.
  The app tolerates this and all public data pages fall back gracefully if the DB is briefly
  unreachable.
- Keep the pooled string as `DATABASE_URL` in production to avoid exhausting connections
  from serverless functions.
