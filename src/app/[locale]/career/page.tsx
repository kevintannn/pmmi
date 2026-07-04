import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { TrendingUp, GraduationCap, Factory, HeartHandshake } from 'lucide-react';
import { pageMetadata } from '@/lib/metadata';
import { PageHeader } from '@/components/shared/page-header';
import { SectionHeading } from '@/components/shared/section-heading';
import { Reveal, Stagger, StaggerItem } from '@/components/shared/motion';
import { Placeholder } from '@/components/shared/placeholder';
import {
  CareerOpeningsData,
  CareerOpeningsSkeleton,
} from '@/components/sections/career-openings-section';

// Prerender as a static page (served instantly from the CDN) and revalidate
// periodically. Admin edits trigger on-demand revalidation for instant updates.
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'Career', '/career');
}

export default async function CareerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Career');
  const ph = await getTranslations('Placeholders');

  const reasons = [
    { icon: TrendingUp, title: t('why1Title'), body: t('why1Body') },
    { icon: GraduationCap, title: t('why2Title'), body: t('why2Body') },
    { icon: Factory, title: t('why3Title'), body: t('why3Body') },
    { icon: HeartHandshake, title: t('why4Title'), body: t('why4Body') },
  ];

  return (
    <>
      <PageHeader eyebrow={t('title')} title={t('title')} description={t('bannerBody')} />

      {/* Banner */}
      <section className="section pt-4">
        <div className="container">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl">
              <Placeholder src={`/images/employees.webp`} label={ph('employees')} ratio="wide" rounded={false} />
              <div className="absolute inset-0 flex items-center bg-gradient-to-r from-charcoal/80 to-charcoal/30">
                <div className="max-w-xl p-8 text-white sm:p-14">
                  <h2 className="text-display text-3xl sm:text-4xl">{t('bannerTitle')}</h2>
                  <p className="mt-4 text-white/85">{t('bannerBody')}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why join */}
      <section className="section pt-0">
        <div className="container">
          <SectionHeading title={t('whyTitle')} />
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <StaggerItem key={r.title}>
                <div className="h-full rounded-2xl border bg-card p-7 shadow-soft">
                  <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <r.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {r.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Openings */}
      <section className="section bg-secondary/40">
        <div className="container">
          <SectionHeading title={t('openingsTitle')} />
          <div className="mt-14">
            <Suspense fallback={<CareerOpeningsSkeleton />}>
              <CareerOpeningsData />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
