import { SITE_URL, SITE_NAME } from '@/lib/site';
import { SOCIAL } from '@/lib/constants';

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is static and trusted (built from constants).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Primary business contact (mirrors the SiteContent defaults). Used in
// structured data so search engines can surface it.
const CONTACT = {
  email: 'info@permaimetal.com',
  phone: '+62 851 2107 4332',
};

const BASE_ORG = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: 'PMMI',
  url: SITE_URL,
  logo: `${SITE_URL}/icons/icon-512.png`,
  image: `${SITE_URL}/og.png`,
  description:
    'Integrated steelmaker producing carbon steel slabs and billets with an annual capacity of 1.8 million metric tons.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Morowali',
    addressRegion: 'Central Sulawesi',
    addressCountry: 'ID',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: CONTACT.email,
    telephone: CONTACT.phone,
    availableLanguage: ['en', 'zh', 'id'],
  },
  sameAs: [SOCIAL.linkedin],
};

/** Organization + WebSite — render once on the home page. */
export function OrganizationJsonLd({ locale }: { locale: string }) {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', ...BASE_ORG }} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: SITE_NAME,
          alternateName: 'PMMI',
          inLanguage: locale,
          publisher: { '@id': `${SITE_URL}/#organization` },
        }}
      />
    </>
  );
}

export function LocalBusinessJsonLd({
  locale,
  email,
  phone,
  factory,
  office,
}: {
  locale: string;
  email: string;
  phone: string;
  factory: string;
  office?: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE_URL}/${locale}#localbusiness`,
        name: SITE_NAME,
        image: `${SITE_URL}/og.png`,
        logo: `${SITE_URL}/icons/icon-512.png`,
        url: `${SITE_URL}/${locale}/contact`,
        email,
        telephone: phone,
        address: [
          office && {
            '@type': 'PostalAddress',
            name: 'Office',
            streetAddress: office,
            addressCountry: 'ID',
          },
          {
            '@type': 'PostalAddress',
            name: 'Factory',
            streetAddress: factory,
            addressRegion: 'Central Sulawesi',
            addressCountry: 'ID',
          },
        ].filter(Boolean),
        location: {
          '@type': 'Place',
          name: 'PMMI Office',
          geo: {
            '@type': 'GeoCoordinates',
            latitude: -6.052498,
            longitude: 106.686961,
          },
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
        manufacturer: { '@id': `${SITE_URL}/#organization` },
      }}
    />
  );
}
