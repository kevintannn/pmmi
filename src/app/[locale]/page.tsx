import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { pageMetadata } from '@/lib/metadata';
import { Hero } from '@/components/sections/hero';
import { Reveal, Stagger, StaggerItem } from '@/components/shared/motion';
import { Placeholder } from '@/components/shared/placeholder';
import { Button } from '@/components/ui/button';
import { OrganizationJsonLd } from '@/components/seo/json-ld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'Home', '/');
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Home');
  const ph = await getTranslations('Placeholders');

  const stats = [
    { label: t('statsCapacity'), value: t('statsCapacityValue') },
    { label: t('statsRoute'), value: t('statsRouteValue') },
    { label: t('statsProducts'), value: t('statsProductsValue') },
  ];

  return (
    <>
      <OrganizationJsonLd locale={locale} />
      <Hero />

      {/* Intro + stats */}
      <section id="intro" className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal direction="right">
            <p className="eyebrow mb-3">PMMI</p>
            <h2 className="text-display text-3xl sm:text-4xl md:text-[2.75rem]">
              {t('introTitle')}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {t('introBody')}
            </p>
            <Button asChild variant="outline" className="mt-8">
              <Link href="/production">
                {t('heroCta')}
                <ArrowRight />
              </Link>
            </Button>
          </Reveal>
          <Reveal direction="left">
            <Placeholder src="/images/drone-view.jpg" label={ph('droneView')} ratio="portrait" />
          </Reveal>
        </div>

        <Stagger className="container mt-16 grid gap-6 sm:grid-cols-3">
          {stats.map((s) => (
            <StaggerItem key={s.label}>
              <div className="rounded-2xl border bg-card p-8 text-center shadow-soft">
                <div className="text-display text-3xl text-primary sm:text-4xl">
                  {s.value}
                </div>
                <div className="mt-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* CTA band */}
      <section className="section pt-0">
        <div className="container">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground sm:px-16 sm:py-20">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 20%, hsl(42 52% 54%), transparent 45%)',
                }}
              />
              <h2 className="text-display relative text-3xl sm:text-4xl">
                {t('ctaTitle')}
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-primary-foreground/80">
                {t('ctaBody')}
              </p>
              <Button asChild variant="accent" size="lg" className="relative mt-8">
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
