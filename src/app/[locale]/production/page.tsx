import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pageMetadata } from '@/lib/metadata';
import { PageHeader } from '@/components/shared/page-header';
import { SectionHeading } from '@/components/shared/section-heading';
import { ProductionTimeline } from '@/components/sections/production-timeline';
import { Stagger, StaggerItem } from '@/components/shared/motion';
import { Placeholder } from '@/components/shared/placeholder';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'Production', '/production');
}

const FACILITIES = [
  { key: 'facility1', placeholder: 'converterFurnace' },
  { key: 'facility2', placeholder: 'refiningFurnace' },
  { key: 'facility3', placeholder: 'continuousCasting' },
  { key: 'facility4', placeholder: 'laboratory' },
  { key: 'facility5', placeholder: 'qualityInspection' },
  { key: 'facility6', placeholder: 'warehouse' },
  { key: 'facility7', placeholder: 'factoryExterior' },
] as const;

export default async function ProductionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Production');
  const ph = await getTranslations('Placeholders');

  return (
    <>
      <PageHeader eyebrow={t('title')} title={t('title')} description={t('intro')} />

      <section className="section pt-4">
        <div className="container">
          <ProductionTimeline />
        </div>
      </section>

      {/* Facilities */}
      <section className="section bg-secondary/40">
        <div className="container">
          <SectionHeading
            eyebrow={t('facilitiesTitle')}
            title={t('facilitiesTitle')}
            description={t('facilitiesIntro')}
          />
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FACILITIES.map((f) => (
              <StaggerItem key={f.key}>
                <div className="group h-full overflow-hidden rounded-2xl border bg-card shadow-soft transition-shadow hover:shadow-soft-lg">
                  <Placeholder
                    src={`/images/${f.placeholder}.webp`}
                    label={ph(f.placeholder)}
                    ratio="video"
                    rounded={false}
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold">{t(`${f.key}Title`)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {t(`${f.key}Body`)}
                    </p>
                    <p className="mt-4 text-xs font-medium uppercase tracking-wider text-accent-foreground/80">
                      {t(`${f.key}Spec`)}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
