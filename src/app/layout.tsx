import type { Metadata, Viewport } from 'next';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import './globals.css';

// Passthrough root layout. Each subtree ([locale], (landing), admin, offline)
// renders its own <html>/<body>, which is required to support both localized
// and non-localized routes alongside next-intl.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Integrated Carbon Steel Manufacturer`,
    template: `%s | PMMI`,
  },
  description:
    'PT Permai Metal Indonesia (PMMI) is an integrated steelmaker producing carbon steel slabs and billets, with an annual capacity of 1.8 million metric tons.',
  applicationName: 'PMMI',
  keywords: [
    'PMMI',
    'Permai Metal',
    'Indonesia steel',
    'carbon steel slab',
    'carbon steel billet',
    'integrated steelmaking',
    'IMIP Morowali',
  ],
  authors: [{ name: SITE_NAME }],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PMMI',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Integrated Carbon Steel Manufacturer`,
    description:
      'Integrated carbon steel production — slabs and billets — engineered to world-class standards.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Integrated Carbon Steel Manufacturer`,
    description:
      'Integrated carbon steel production — slabs and billets — engineered to world-class standards.',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1420' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
