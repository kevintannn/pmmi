import { SITE_URL, SITE_NAME } from '@/lib/site';

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is static and trusted (built from constants).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const BASE_ORG = {
  '@type': 'Organization',
  name: SITE_NAME,
  alternateName: 'PMMI',
  url: SITE_URL,
  logo: `${SITE_URL}/icons/icon-512.png`,
  description:
    'Integrated steelmaker producing carbon steel slabs and billets with an annual capacity of 1.8 million metric tons.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Morowali',
    addressRegion: 'Central Sulawesi',
    addressCountry: 'ID',
  },
};

export function OrganizationJsonLd({ locale }: { locale: string }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        ...BASE_ORG,
        '@id': `${SITE_URL}/${locale}#organization`,
        sameAs: ['https://www.linkedin.com/'],
      }}
    />
  );
}

export function LocalBusinessJsonLd({
  locale,
  email,
  phone,
  factory,
}: {
  locale: string;
  email: string;
  phone: string;
  factory: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/${locale}#localbusiness`,
        name: SITE_NAME,
        image: `${SITE_URL}/og.png`,
        url: `${SITE_URL}/${locale}/contact`,
        email,
        telephone: phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: factory,
          addressRegion: 'Central Sulawesi',
          addressCountry: 'ID',
        },
      }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  category,
}: {
  name: string;
  description: string;
  category: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        description,
        category,
        brand: { '@type': 'Brand', name: 'PMMI' },
        manufacturer: BASE_ORG,
      }}
    />
  );
}
