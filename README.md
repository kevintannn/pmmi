# PMMI — PT Permai Metal Indonesia

Official company profile **Progressive Web App** for PT Permai Metal Indonesia (PMMI), an
integrated carbon steel manufacturer. Modern, minimalist, mobile-first, bilingual
(简体中文 / English), SEO-friendly and deployable entirely on **Vercel free tier** +
**Neon PostgreSQL free tier**.

> Design language: Apple × Vercel × Tesla × Notion — lots of whitespace, large
> typography, soft shadows, rounded corners, smooth motion. Palette: white,
> charcoal, dark blue (navy), steel gray, with a gold accent.

---

## ✨ Features

- **Bilingual** with `next-intl` — Chinese is the default; a language selector at `/`
  stores the preference and routes to `/zh` or `/en`. Adding a locale (e.g. `id`) is a
  one-line change (see [Adding a language](#adding-a-language)).
- **Pages**: Home (fullscreen parallax hero), About (mission/vision/values/highlights),
  Production (animated horizontal process timeline + facilities), Products (slab & billet
  with spec downloads), Scrap Steel (daily prices, filter, historical chart), Career
  (openings + application form with résumé upload), Contact (details, map slot, inquiry
  form).
- **Database-backed** (Prisma + Neon): `ScrapPrice`, `Career`, `Application`, `Inquiry`,
  plus a CMS-style `SiteContent` table.
- **Admin** at `/admin` — CRUD for scrap prices & careers, read views for applications &
  inquiries, and an editor for `SiteContent`. **No auth yet** (structured so it's easy to
  add — see [Adding authentication](#adding-authentication)).
- **PWA**: installable, offline fallback page, service worker, manifest, app icons and
  maskable icon (Android / iOS / desktop).
- **SEO**: dynamic per-page metadata, canonical + `hreflang` alternates, Open Graph &
  Twitter cards, `robots.txt`, `sitemap.xml`, and Schema.org JSON-LD (Organization,
  Product, LocalBusiness).
- **Image placeholders** everywhere via a single `<Placeholder />` component — drop a
  real photo into `/public/images` and pass `src` to swap it in.

## 🧱 Tech stack

Next.js 15 (App Router) · React 19 · TypeScript · TailwindCSS · shadcn/ui · Framer Motion ·
Lucide · React Hook Form · Zod · Prisma ORM · Neon PostgreSQL · next-intl ·
`@ducanh2912/next-pwa` · Recharts · Vercel.

## 🚀 Quick start

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env        # then edit with your Neon connection strings

# 3. Create the schema + seed demo data
npm run db:migrate:deploy   # or: npm run db:push
npm run db:seed

# 4. Run
npm run dev                 # http://localhost:3000
```

Open <http://localhost:3000> — you'll land on the language selector. Admin is at
<http://localhost:3000/admin>.

## 📜 Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Generate icons + Prisma client, then production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |
| `npm run icons` | Regenerate PWA icons / favicon / OG image |
| `npm run db:push` | Push schema to the DB (no migration history) |
| `npm run db:migrate:deploy` | Apply committed migrations (use in CI/prod) |
| `npm run db:seed` | Seed scrap prices, careers and site content |
| `npm run db:studio` | Open Prisma Studio |

## 🗂 Project structure

```
prisma/
  schema.prisma            # ScrapPrice, Career, Application, Inquiry, SiteContent
  migrations/0001_init/    # committed SQL migration
  seed.ts                  # demo data
messages/                  # en.json, zh.json (i18n catalogs)
scripts/generate-icons.mjs # dependency-free icon/OG generator
public/                    # icons, uploads/, specs/
src/
  app/
    layout.tsx             # passthrough root (global metadata + viewport)
    (landing)/             # "/" language selector (non-localized)
    [locale]/              # localized site (html/body, navbar, footer)
      page.tsx about/ production/ products/ scrap/ career/ contact/
    admin/                 # non-localized admin area (no auth yet)
    api/                   # route handlers (REST) for CRUD + upload
    manifest.ts sitemap.ts robots.ts offline/
  components/
    ui/                    # shadcn/ui primitives
    layout/ sections/ forms/ shared/ seo/ admin/
  i18n/                    # routing, navigation, request config
  lib/                     # prisma, validations (zod), data access, metadata, utils
  middleware.ts            # next-intl locale routing (skips "/", api, admin)
```

## 🌐 Adding a language

1. Add the locale to `src/i18n/routing.ts` (`locales: ['zh', 'en', 'id']`).
2. Create `messages/id.json` (copy `en.json` and translate).
3. Add a card to the selector in `src/app/(landing)/page.tsx` and a label in
   `src/components/layout/language-switcher.tsx`.

No other refactor is required — routing, sitemap, alternates and metadata all derive from
`routing.locales`.

## 🔐 Adding authentication

The admin area is intentionally unprotected for now, but isolated under `/admin` so it can
be locked down without touching the public site. Recommended: add
[`next-auth`](https://authjs.dev) or [Clerk](https://clerk.com) (both have free tiers) and
either wrap `src/app/admin/layout.tsx` with a session check or add an `/admin` matcher to
`src/middleware.ts`. The API route handlers under `src/app/api/*` should also check the
session for mutating methods (POST/PUT/DELETE).

## 🖼 Replacing placeholder images

Every visual uses `<Placeholder label="…" />`. To use a real image, drop the file into
`/public/images` and pass `src`:

```tsx
<Placeholder label={ph('converterFurnace')} src="/images/converter-furnace.jpg" />
```

The placeholder catalog (Factory Exterior, Molten Iron, Converter Furnace, …) lives in
`src/lib/constants.ts` and is translated in `messages/*.json` under `Placeholders`.

## 📄 Deployment & database

- **Vercel deployment guide** → [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)
- **Neon PostgreSQL setup guide** → [`docs/NEON.md`](docs/NEON.md)
- **Future improvements** → [`docs/FUTURE.md`](docs/FUTURE.md)

## ⚙️ Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | Neon **pooled** connection string (runtime) |
| `DIRECT_URL` | ✅ | Neon **direct** connection string (migrations) |
| `NEXT_PUBLIC_SITE_URL` | ✅ (prod) | Canonical URL, no trailing slash — used by SEO/sitemap |

See `.env.example` for the full template.
