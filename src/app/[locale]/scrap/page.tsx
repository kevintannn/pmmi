import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata } from '@/lib/metadata';
import { getScrapPrices } from '@/lib/data/scrap';
import { PageHeader } from '@/components/shared/page-header';
import { ScrapPricesView } from '@/components/sections/scrap-prices-view';

// Prices change daily and are read from the database at request time.
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'Scrap', '/scrap');
}

export default async function ScrapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Scrap');
  const prices = await getScrapPrices();

  return (
    <>
      <PageHeader eyebrow={t('title')} title={t('title')} description={t('intro')} />
      <section className="section pt-4">
        <div className="container">
          <ScrapPricesView prices={prices} />
        </div>
      </section>
    </>
  );
}
