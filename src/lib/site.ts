/** Canonical site URL (no trailing slash). Configure via NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
).replace(/\/$/, '');

export const SITE_NAME = 'PT Permai Metal Indonesia';
