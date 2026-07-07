/**
 * Canonical site URL (no trailing slash). Override with NEXT_PUBLIC_SITE_URL
 * (e.g. http://localhost:3000 for local dev). Defaults to the production domain
 * so SEO tags/sitemap are correct even if the env var isn't set.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://permaimetal.com'
).replace(/\/$/, '');

export const SITE_NAME = 'PT Permai Metal Indonesia';
