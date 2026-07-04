import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Mail, Phone, Clock, Building2, MapPin } from 'lucide-react';
import { pageMetadata } from '@/lib/metadata';
import { getContactInfo } from '@/lib/content';
import { OFFICE_MAP_EMBED_URL } from '@/lib/constants';
import { PageHeader } from '@/components/shared/page-header';
import { Reveal } from '@/components/shared/motion';
import { OfficeMap } from '@/components/sections/office-map';
import { InquiryForm } from '@/components/forms/inquiry-form';
import { LocalBusinessJsonLd } from '@/components/seo/json-ld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'Contact', '/contact');
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Contact');
  const contact = await getContactInfo(locale);

  const details = [
    { icon: Building2, label: t('office'), value: contact.office },
    { icon: MapPin, label: t('factory'), value: contact.factory },
    { icon: Mail, label: t('email'), value: contact.email, href: `mailto:${contact.email}` },
    { icon: Phone, label: t('phone'), value: contact.phone, href: `tel:${contact.phone}` },
    { icon: Clock, label: t('hours'), value: contact.hours },
  ];

  return (
    <>
      <LocalBusinessJsonLd
        locale={locale}
        email={contact.email}
        phone={contact.phone}
        factory={contact.factory}
      />
      <PageHeader eyebrow={t('title')} title={t('title')} description={t('intro')} />

      <section className="section pt-4">
        <div className="container grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Details + map */}
          <Reveal direction="right" className="space-y-8">
            <ul className="space-y-6">
              {details.map((d) => (
                <li key={d.label} className="flex gap-4">
                  <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <d.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {d.label}
                    </p>
                    {d.href ? (
                      <a href={d.href} className="mt-0.5 block hover:text-primary">
                        {d.value}
                      </a>
                    ) : (
                      <p className="mt-0.5 leading-relaxed">{d.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Interactive Google Map (office location) */}
            <OfficeMap
              embedUrl={OFFICE_MAP_EMBED_URL}
              query={contact.office}
              title={t('mapTitle')}
            />
          </Reveal>

          {/* Inquiry form */}
          <Reveal direction="left">
            <div className="rounded-2xl border bg-card p-8 shadow-soft">
              <h2 className="text-2xl font-semibold">{t('formTitle')}</h2>
              <div className="mt-6">
                <InquiryForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
