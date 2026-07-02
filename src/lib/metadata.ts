import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

function localizedPath(locale: string, path: string) {
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

/**
 * Build locale-aware page metadata (title, description, canonical + hreflang
 * alternates, Open Graph) from a message namespace exposing `metaTitle` and
 * `metaDescription`.
 */
export async function pageMetadata(
  locale: string,
  namespace: string,
  path: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = localizedPath(l, path);
  }

  const title = t('metaTitle');
  const description = t('metaDescription');

  return {
    title,
    description,
    alternates: {
      canonical: localizedPath(locale, path),
      languages,
    },
    openGraph: { title, description, url: localizedPath(locale, path) },
    twitter: { title, description },
  };
}
