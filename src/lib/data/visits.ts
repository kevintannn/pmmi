import 'server-only';
import { prisma } from '@/lib/prisma';
import { withTimeout } from '@/lib/db';
import { formatDateISO } from '@/lib/utils';

export type VisitStats = {
  total: number;
  today: number;
  last7: number;
  last30: number;
  daily: Array<{ date: string; visits: number }>;
  ok: boolean;
};

const EMPTY: VisitStats = {
  total: 0,
  today: 0,
  last7: 0,
  last30: 0,
  daily: [],
  ok: false,
};

function dayUTC(offset = 0): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + offset);
  return d;
}

/** Visit totals plus a 30-day daily series (zero-filled). Never throws. */
export async function getVisitStats(): Promise<VisitStats> {
  const today = dayUTC();
  const from30 = dayUTC(-29);
  const from7 = dayUTC(-6);

  const result = await withTimeout(
    Promise.all([
      prisma.visit.count(),
      prisma.visit.count({ where: { date: today } }),
      prisma.visit.count({ where: { date: { gte: from7 } } }),
      prisma.visit.count({ where: { date: { gte: from30 } } }),
      prisma.visit.groupBy({
        by: ['date'],
        where: { date: { gte: from30 } },
        _count: { _all: true },
      }),
    ]),
    null,
  );

  if (!result) return EMPTY;
  const [total, today_, last7, last30, grouped] = result;

  const counts = new Map(
    grouped.map((g) => [formatDateISO(g.date), g._count._all]),
  );
  const daily = Array.from({ length: 30 }, (_, i) => {
    const key = formatDateISO(dayUTC(i - 29));
    return { date: key, visits: counts.get(key) ?? 0 };
  });

  return { total, today: today_, last7, last30, daily, ok: true };
}
