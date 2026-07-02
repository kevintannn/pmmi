import 'server-only';
import { prisma } from '@/lib/prisma';
import { withTimeout } from '@/lib/db';
import { formatDateISO } from '@/lib/utils';
import type { ScrapPriceDTO } from '@/components/sections/scrap-prices-view';

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
