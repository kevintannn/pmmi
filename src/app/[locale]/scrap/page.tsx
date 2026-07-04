import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Ruler, ShieldAlert, Ban, FileCheck, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { pageMetadata } from '@/lib/metadata';
import { PageHeader } from '@/components/shared/page-header';
import { SectionHeading } from '@/components/shared/section-heading';
import { Reveal } from '@/components/shared/motion';
import { Button } from '@/components/ui/button';
import { ScrapPricesGrid, ScrapPricesSkeleton } from '@/components/sections/scrap-prices';

// Prices are read from the database at request time.
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

  const rejectionRules = [t('reject1'), t('reject2'), t('reject3')];
  const documents = [t('doc1'), t('doc2'), t('doc3'), t('doc4'), t('doc5')];

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} description={t('intro')} />

      {/* Current buying prices — streamed so the page shell appears instantly
          while the database (incl. any Neon cold start) loads. */}
      <section className="section pt-4">
        <div className="container">
          <SectionHeading title={t('pricesTitle')} />
          <Suspense fallback={<ScrapPricesSkeleton />}>
            <ScrapPricesGrid locale={locale} />
          </Suspense>
        </div>
      </section>

      {/* Material specifications & supplier terms */}
      <section className="section bg-secondary/40">
        <div className="container">
          <SectionHeading title={t('termsTitle')} description={t('termsIntro')} />

          <div className="mx-auto mt-14 grid max-w-4xl gap-6">
            {/* Accepted materials & size */}
            <Reveal>
              <div className="rounded-2xl border bg-card p-8 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Ruler className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold">{t('sizeTitle')}</h3>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">{t('sizeBody')}</p>
              </div>
            </Reveal>

            {/* Cleanliness */}
            <Reveal>
              <div className="rounded-2xl border bg-card p-8 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <ShieldAlert className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold">{t('cleanTitle')}</h3>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">{t('cleanBody')}</p>
              </div>
            </Reveal>

            {/* Rejection & return policy */}
            <Reveal>
              <div className="rounded-2xl border border-destructive/20 bg-destructive/[0.04] p-8 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-destructive/10 text-destructive">
                    <Ban className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold">{t('rejectTitle')}</h3>
                </div>
                <ul className="mt-5 space-y-3">
                  {rejectionRules.map((rule, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                      <span className="text-foreground/80">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Required documentation */}
            <Reveal>
              <div className="rounded-2xl border bg-card p-8 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent-foreground">
                    <FileCheck className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold">{t('docsTitle')}</h3>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{t('docsIntro')}</p>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {documents.map((doc, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <FileCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground/70" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground sm:px-16">
              <h2 className="text-display text-3xl sm:text-4xl">{t('ctaTitle')}</h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
                {t('ctaBody')}
              </p>
              <Button asChild variant="accent" size="lg" className="mt-8">
                <Link href="/contact">
                  {t('ctaButton')}
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
