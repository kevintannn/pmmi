/**
 * Static, non-localized company constants.
 * Human-readable labels live in the i18n message catalogs (messages/*.json).
 */

export const COMPANY = {
  legalName: 'PT Permai Metal Indonesia',
  shortName: 'PMMI',
  annualCapacityTons: 1_800_000,
  productionRoute: ['Molten Iron', 'BOF', 'LF', 'CCM', 'Slab / Billet'],
} as const;

/** Route keys used by the localized navigation (paths are relative to /[locale]). */
export const NAV_ITEMS = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'production', href: '/production' },
  { key: 'products', href: '/products' },
  { key: 'scrap', href: '/scrap' },
  { key: 'career', href: '/career' },
  { key: 'contact', href: '/contact' },
] as const;

/** Scrap categories PMMI actively purchases. */
export const SCRAP_CATEGORIES = ['HMS', 'Busheling'] as const;

export const CURRENCIES = ['USD', 'IDR', 'CNY'] as const;

/**
 * Image placeholder catalog. Every visual on the site references one of these
 * keys, so swapping in a real photograph is a one-line change: drop the file in
 * /public/images and pass `src` to <Placeholder />.
 */
export const PLACEHOLDER_LABELS = {
  factoryExterior: 'Factory Exterior',
  moltenIron: 'Molten Iron',
  converterFurnace: 'Converter Furnace (BOF)',
  refiningFurnace: 'Refining Furnace (LF)',
  continuousCasting: 'Continuous Casting Machine',
  steelSlab: 'Steel Slab',
  steelBillet: 'Steel Billet',
  laboratory: 'Laboratory',
  qualityInspection: 'Quality Inspection',
  employees: 'Employees',
  warehouse: 'Warehouse',
  office: 'Office',
  meetingRoom: 'Meeting Room',
  droneView: 'Drone View',
  loadingPort: 'Loading Port',
} as const;

export type PlaceholderKey = keyof typeof PLACEHOLDER_LABELS;

export const SOCIAL = {
  linkedin: 'https://www.linkedin.com/',
} as const;

/**
 * Google Maps "Embed a map" URL for the office (Share → Embed a map → copy the
 * iframe src). Precise, no API key. Update this to move the pin.
 */
export const OFFICE_MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.5778855172634!2d106.68696127498902!3d-6.052497993933309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a051c5ff30629%3A0x916a6afeb799df8b!2sPMMI%20PT%20PERMAI%20METAL%20INDONESIA!5e0!3m2!1sen!2sid!4v1783161223427!5m2!1sen!2sid';
