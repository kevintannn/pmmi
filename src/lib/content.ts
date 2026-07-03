import 'server-only';
import { prisma } from '@/lib/prisma';

/** Default values used when a SiteContent row is missing (e.g. before seeding). */
const DEFAULTS: Record<string, { en: string; zh: string }> = {
  'contact.email': { en: 'info@permaimetal.com', zh: 'info@permaimetal.com' },
  'contact.phone': { en: '+62 851 2107 4332', zh: '+62 851 2107 4332' },
  'contact.office': {
    en: 'PMMI PIK 2 SOBC006, Tangerang Regency, Banten, Indonesia',
    zh: 'PMMI PIK 2 SOBC006，印度尼西亚万丹省丹格朗县',
  },
  'contact.factory': {
    en: 'Indonesia Morowali Industrial Park (IMIP), Central Sulawesi, Indonesia',
    zh: '印度尼西亚莫罗瓦利工业园区（IMIP），中苏拉威西省',
  },
  'contact.hours': {
    en: 'Monday – Friday, 08:30 – 17:00 WIB',
    zh: '周一至周五 08:30 – 17:00（印尼西部时间）',
  },
};

// If the database is unreachable/slow, fall back to defaults quickly instead of
// blocking every page render on Prisma's connection-retry window.
const DB_TIMEOUT_MS = 1500;

// In-memory TTL cache (per server instance) so the footer/contact info isn't
// re-queried on every navigation. Successful lookups are held longer than
// failures, so a briefly-down DB recovers quickly.
const CACHE_TTL_OK_MS = 5 * 60 * 1000;
const CACHE_TTL_FAIL_MS = 20 * 1000;
const cache = new Map<string, { at: number; ttl: number; data: Record<string, string> }>();

export type ContactInfo = {
  email: string;
  phone: string;
  office: string;
  factory: string;
  hours: string;
};

function fallback(key: string, locale: string) {
  const d = DEFAULTS[key];
  if (!d) return '';
  return locale === 'zh' ? d.zh : d.en;
}

async function fetchContactMap(locale: string): Promise<Record<string, string>> {
  const keys = Object.keys(DEFAULTS);
  const query = prisma.siteContent.findMany({
    where: { locale, key: { in: keys } },
    select: { key: true, value: true },
  });
  // Prevent an unhandled rejection if the timeout wins the race.
  query.catch(() => {});

  try {
    const rows = await Promise.race([
      query,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('db-timeout')), DB_TIMEOUT_MS),
      ),
    ]);
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}

/**
 * Load editable contact info for a locale, falling back to defaults. Results are
 * cached in-memory per locale so the footer/contact info isn't re-queried on
 * every navigation.
 */
export async function getContactInfo(locale: string): Promise<ContactInfo> {
  const cached = cache.get(locale);
  let data: Record<string, string>;

  if (cached && Date.now() - cached.at < cached.ttl) {
    data = cached.data;
  } else {
    data = await fetchContactMap(locale);
    const ok = Object.keys(data).length > 0;
    cache.set(locale, {
      at: Date.now(),
      ttl: ok ? CACHE_TTL_OK_MS : CACHE_TTL_FAIL_MS,
      data,
    });
  }

  const map = new Map(Object.entries(data));
  const get = (key: string) => map.get(key) || fallback(key, locale);

  return {
    email: get('contact.email'),
    phone: get('contact.phone'),
    office: get('contact.office'),
    factory: get('contact.factory'),
    hours: get('contact.hours'),
  };
}
