import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Download, Ruler, ClipboardList, Boxes } from 'lucide-react';
import { pageMetadata } from '@/lib/metadata';
import { PageHeader } from '@/components/shared/page-header';
import { Reveal } from '@/components/shared/motion';
import { Placeholder } from '@/components/shared/placeholder';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProductJsonLd } from '@/components/seo/json-ld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, 'Products', '/products');
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Products');
  const tc = await getTranslations('Common');
  const ph = await getTranslations('Placeholders');

  const products = [
    {
      id: 'slab',
      name: t('slabName'),
      specs: t('slabSpecs'),
      dimensions: t('slabDimensions'),
      applications: t('slabApplications'),
      placeholder: 'steelSlab' as const,
      pdf: '/specs/carbon-steel-slab.pdf',
    },
    {
      id: 'billet',
      name: t('billetName'),
      specs: t('billetSpecs'),
      dimensions: t('billetDimensions'),
      applications: t('billetApplications'),
      placeholder: 'steelBillet' as const,
      pdf: '/specs/carbon-steel-billet.pdf',
    },
  ];

  return (
    <>
      <PageHeader eyebrow={t('title')} title={t('title')} description={t('intro')} />

      <section className="section pt-4">
        <div className="container">
          <Tabs defaultValue="slab" className="w-full">
            <div className="flex justify-center">
              <TabsList>
                {products.map((p) => (
                  <TabsTrigger key={p.id} value={p.id}>
                    {p.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {products.map((p) => (
              <TabsContent key={p.id} value={p.id}>
                <ProductJsonLd name={p.name} description={p.specs} category="Carbon Steel" />
                <div className="mt-8 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <Reveal direction="right">
                    <Placeholder src={`/images/${p.placeholder}.jpg`} label={ph(p.placeholder)} ratio="square" />
                  </Reveal>

                  <Reveal direction="left" className="space-y-8">
                    <div>
                      <Badge variant="accent" className="mb-3">
                        Carbon Steel
                      </Badge>
                      <h2 className="text-display text-3xl sm:text-4xl">{p.name}</h2>
                    </div>

                    <SpecBlock icon={ClipboardList} label={t('specifications')} value={p.specs} />
                    <SpecBlock icon={Ruler} label={t('dimensions')} value={p.dimensions} />
                    <SpecBlock icon={Boxes} label={t('applications')} value={p.applications} />

                    <Button asChild variant="outline">
                      <a href={p.pdf} download>
                        <Download />
                        {tc('download')}
                      </a>
                    </Button>
                  </Reveal>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </>
  );
}

function SpecBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </h3>
        <p className="mt-1 leading-relaxed">{value}</p>
      </div>
    </div>
  );
}
