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
