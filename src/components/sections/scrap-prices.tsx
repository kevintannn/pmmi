import { getTranslations } from 'next-intl/server';
import { Recycle, CalendarClock } from 'lucide-react';
import { getCurrentScrapPrices } from '@/lib/data/scrap';
import { formatCurrency } from '@/lib/utils';
import { Stagger, StaggerItem } from '@/components/shared/motion';
import { Badge } from '@/components/ui/badge';

/**
 * Async server component that fetches the current buying prices. Rendered inside
 * a <Suspense> boundary on the scrap page so the page shell shows immediately
 * and the prices (plus any Neon cold start) stream in when ready.
 */
export async function ScrapPricesGrid({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'Scrap' });
  const prices = await getCurrentScrapPrices();

  const categoryLabel = (category: string) => {
    const key = `categories.${category}`;
    const label = t(key);
    return label === key ? category : label;
  };

  if (prices.length === 0) {
    return (
      <div className="mx-auto mt-12 max-w-4xl rounded-2xl border bg-card p-16 text-center text-muted-foreground shadow-soft">
        {t('empty')}
      </div>
    );
  }

  return (
    <Stagger className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
      {prices.map((p) => (
        <StaggerItem key={p.id}>
          <div className="flex h-full flex-col rounded-2xl border bg-card p-8 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Recycle className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold">{categoryLabel(p.category)}</h3>
            </div>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-display text-4xl text-primary sm:text-5xl">
                {formatCurrency(p.price, p.currency)}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {t('priceUnit')}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t('priceBasis')}</p>

            <div className="mt-6 flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              {t('lastUpdated')}: {p.date}
            </div>
            <Badge variant="accent" className="mt-3 self-start">
              {t('validNote')}
            </Badge>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/** Loading placeholder shown while prices stream in. */
export function ScrapPricesSkeleton() {
  return (
    <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2" aria-hidden>
      {[0, 1].map((i) => (
        <div key={i} className="rounded-2xl border bg-card p-8 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="skeleton h-11 w-11 rounded-xl" />
            <div className="skeleton h-5 w-40 rounded" />
          </div>
          <div className="skeleton mt-6 h-12 w-48 rounded-lg" />
          <div className="skeleton mt-2 h-4 w-56 rounded" />
          <div className="mt-6 border-t pt-4">
            <div className="skeleton h-3 w-32 rounded" />
          </div>
          <div className="skeleton mt-3 h-6 w-28 rounded-full" />
        </div>
      ))}
    </div>
  );
}
