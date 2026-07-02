# Future improvement suggestions

Prioritised ideas for taking this from a polished template to a fully operational corporate
platform. All remain achievable on free tiers unless noted.

## Security & access
1. **Admin authentication** — add `next-auth`/Auth.js or Clerk; protect `/admin` and
   mutating API routes. This is the single most important next step before going live.
2. **Rate limiting & spam protection** — add Upstash Redis rate limiting and a honeypot or
   Cloudflare Turnstile / hCaptcha on the contact and application forms.
3. **Input hardening** — server-side file-content sniffing for résumé uploads (not just
   MIME/extension), and audit logging for admin mutations.

## Storage & data
4. **Durable résumé storage** — replace the local-filesystem upload with **Vercel Blob**
   or S3. Swap only `src/app/api/upload/route.ts`.
5. **Email notifications** — send an email (Resend free tier) to HR/sales when an
   application or inquiry arrives.
6. **Scrap price import** — CSV/Excel bulk upload and a scheduled job (Vercel Cron) to pull
   daily indices automatically.

## Internationalisation & content
7. **Indonesian (`id`) locale** — the codebase already supports adding it in one line
   (`routing.locales`) plus a message file.
8. **Full CMS coverage** — extend `SiteContent` usage so all homepage/about copy is
   editable from `/admin`, or integrate a headless CMS (Sanity/Contentful free tier).
9. **Rich text** — a lightweight editor (Tiptap) for career descriptions and content
   fields.

## UX & features
10. **Product spec PDFs** — generate branded spec sheets on demand (react-pdf) instead of
    static files in `/public/specs`.
11. **Interactive map** — replace the map placeholder with an embedded map (Leaflet +
    OpenStreetMap tiles = free) for office/factory locations.
12. **News / press room** — a `Post` model + MDX for company updates, improving SEO.
13. **Dark mode toggle** — the design tokens already include a `.dark` theme; add a
    `next-themes` switch.

## Quality & operations
14. **Testing** — Vitest + Testing Library for components, Playwright for E2E (forms,
    language switching, admin CRUD).
15. **Analytics** — Vercel Web Analytics (free) or privacy-friendly Plausible.
16. **Error monitoring** — Sentry free tier.
17. **CI** — GitHub Actions running `lint`, `build`, and `prisma migrate deploy` against a
    Neon preview branch per PR.
18. **Accessibility audit** — automated axe checks plus manual keyboard/screen-reader
    testing.
