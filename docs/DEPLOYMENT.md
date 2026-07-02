# Vercel deployment guide

Deploys entirely on the **Vercel free (Hobby) tier** with a **Neon free** database.

## Prerequisites

- A GitHub/GitLab/Bitbucket repo containing this project.
- A Neon database with `DATABASE_URL` and `DIRECT_URL` ready — see [`NEON.md`](NEON.md).

## 1. Import the project

1. Go to <https://vercel.com/new> and import your repository.
2. Framework preset is auto-detected as **Next.js**. Leave build settings default:
   - Build command: `npm run build` (runs icon generation → `prisma generate` → `next build`)
   - Install command: `npm install` (runs `prisma generate` via `postinstall`)
   - Output: `.next`

## 2. Environment variables

In **Project → Settings → Environment Variables**, add (Production + Preview):

| Key | Value |
| --- | --- |
| `DATABASE_URL` | Neon **pooled** string (`…-pooler…?sslmode=require`) |
| `DIRECT_URL` | Neon **direct** string |
| `NEXT_PUBLIC_SITE_URL` | Your final URL, e.g. `https://pmmi.vercel.app` (no trailing slash) |

## 3. Run migrations against Neon

Migrations are **not** run automatically by Vercel. Apply them once (and after schema
changes) from your machine or CI:

```bash
# with production env vars available locally:
npm run db:migrate:deploy
npm run db:seed        # optional: seed demo data once
```

> Alternatively, add `prisma migrate deploy` to the build command if you prefer migrations
> to run on every deploy. This project keeps them separate so a bad migration can't block a
> deploy.

## 4. Deploy

Click **Deploy**. On success, Vercel gives you a URL. Update `NEXT_PUBLIC_SITE_URL` to the
production domain and redeploy so SEO metadata, `sitemap.xml` and `robots.txt` are correct.

## 5. Post-deploy checklist

- [ ] Landing selector works and routes to `/zh` / `/en`.
- [ ] `/[locale]/scrap` shows seeded prices and chart.
- [ ] `/admin` loads; adding a scrap price / career persists.
- [ ] Contact & application forms submit successfully (rows appear in `/admin`).
- [ ] `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` return valid content.
- [ ] Install the PWA (browser "Install app") and confirm the offline page works.
- [ ] Run Lighthouse (see below).

## Image optimization

`next/image` uses Vercel's built-in image optimization automatically on the free tier — no
config needed. The `<Placeholder />` component renders `next/image` once you provide a
`src`.

## ⚠️ Résumé uploads on Vercel

`POST /api/upload` writes to `public/uploads`, which works locally and on a persistent
server but **not** on Vercel's read-only/ephemeral serverless filesystem. For production
uploads, switch to **Vercel Blob** (free tier) or S3-compatible storage — see
[`FUTURE.md`](FUTURE.md). Only `src/app/api/upload/route.ts` needs to change; the form and
database only depend on the returned URL.

## Lighthouse ≥ 95

The app is built for high scores: Server Components by default, code-splitting, font
optimization (`next/font`), lazy images, and `prefers-reduced-motion` support. Test with:

```bash
npm run build && npm run start
# then run Lighthouse (Chrome DevTools) against http://localhost:3000/zh
```
