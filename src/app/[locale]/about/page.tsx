import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Award, ShieldCheck, Lightbulb, Leaf, Factory, MapPin, Layers, Gauge } from 'lucide-react';
import { pageMetadata } from '@/lib/metadata';
import { PageHeader } from '@/components/shared/page-header';
import { SectionHeading } from '@/components/shared/section-heading';
import { Reveal, Stagger, StaggerItem } from '@/components/shared/motion';
import { Placeholder } from '@/components/shared/placeholder';
import { Card, CardContent } from '@/components/ui/card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'About', '/about');
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('About');
  const ph = await getTranslations('Placeholders');

  const values = [
    { icon: Award, title: t('value1Title'), body: t('value1Body') },
    { icon: ShieldCheck, title: t('value2Title'), body: t('value2Body') },
    { icon: Lightbulb, title: t('value3Title'), body: t('value3Body') },
    { icon: Leaf, title: t('value4Title'), body: t('value4Body') },
  ];

  const highlights = [
    { icon: Gauge, title: t('highlight1Title'), body: t('highlight1Body') },
    { icon: Layers, title: t('highlight2Title'), body: t('highlight2Body') },
    { icon: Factory, title: t('highlight3Title'), body: t('highlight3Body') },
    { icon: MapPin, title: t('highlight4Title'), body: t('highlight4Body') },
  ];

  return (
    <>
      <PageHeader eyebrow="PMMI" title={t('title')} description={t('intro')} />

      {/* Mission & Vision */}
      <section className="section pt-0">
        <div className="container grid gap-8 lg:grid-cols-2">
          <Reveal direction="right">
            <Card className="h-full">
              <CardContent className="p-8">
                <Placeholder label={ph('office')} ratio="video" className="mb-6" />
                <h3 className="text-2xl font-semibold">{t('missionTitle')}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {t('missionBody')}
                </p>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal direction="left">
            <Card className="h-full">
              <CardContent className="p-8">
                <Placeholder label={ph('droneView')} ratio="video" className="mb-6" />
                <h3 className="text-2xl font-semibold">{t('visionTitle')}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {t('visionBody')}
                </p>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* Core values */}
      <section className="section bg-secondary/40">
        <div className="container">
          <SectionHeading eyebrow={t('valuesTitle')} title={t('valuesTitle')} />
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <Card className="h-full">
                  <CardContent className="p-7">
                    <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                      <v.icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {v.body}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Highlights */}
      <section className="section">
        <div className="container">
          <SectionHeading title={t('highlightsTitle')} />
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((h) => (
              <StaggerItem key={h.title}>
                <div className="rounded-2xl border bg-card p-7 shadow-soft">
                  <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent-foreground">
                    <h.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{h.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {h.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
