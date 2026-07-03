import 'server-only';
import { prisma } from '@/lib/prisma';
import { withTimeout } from '@/lib/db';
import { formatDateISO } from '@/lib/utils';
import { SCRAP_CATEGORIES } from '@/lib/constants';

export type ScrapPriceDTO = {
  id: string;
  date: string; // YYYY-MM-DD
  category: string;
  price: number;
  currency: string;
  notes: string | null;
};

/** Fetch scrap prices as serializable DTOs, newest first. Never throws. */
export async function getScrapPrices(): Promise<ScrapPriceDTO[]> {
  const rows = await withTimeout(
    prisma.scrapPrice.findMany({
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      take: 500,
    }),
    [],
  );
  return rows.map((r) => ({
    id: r.id,
    date: formatDateISO(r.date),
    category: r.category,
    price: Number(r.price),
    currency: r.currency,
    notes: r.notes,
  }));
}

/**
 * The latest (current) buying price for each purchased category, ordered by
 * SCRAP_CATEGORIES. This is what the public scrap page shows — one standing
 * price per category that remains applicable until updated.
 */
export async function getCurrentScrapPrices(): Promise<ScrapPriceDTO[]> {
  const all = await getScrapPrices(); // newest first
  const latest = new Map<string, ScrapPriceDTO>();
  for (const p of all) {
    if (!latest.has(p.category)) latest.set(p.category, p);
  }
  return SCRAP_CATEGORIES.map((c) => latest.get(c)).filter(
    (p): p is ScrapPriceDTO => Boolean(p),
  );
}
