import { defineRouting } from 'next-intl/routing';

// Add future locales (e.g. 'id') here — no other refactor required.
export const routing = defineRouting({
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
