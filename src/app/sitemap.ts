import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { routing } from '@/i18n/routing';
import { NAV_ITEMS } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return NAV_ITEMS.flatMap((item) =>
    routing.locales.map((locale) => {
      const path = item.href === '/' ? `/${locale}` : `/${locale}${item.href}`;
      const languages = Object.fromEntries(
        routing.locales.map((l) => [
          l,
          item.href === '/' ? `${SITE_URL}/${l}` : `${SITE_URL}/${l}${item.href}`,
        ]),
      );
      return {
        url: `${SITE_URL}${path}`,
        lastModified: now,
        changeFrequency: (item.key === 'scrap' ? 'daily' : 'monthly') as 'daily' | 'monthly',
        priority: item.key === 'home' ? 1 : 0.7,
        alternates: { languages },
      };
    }),
  );
}
