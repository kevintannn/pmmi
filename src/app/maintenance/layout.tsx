import type { Metadata } from 'next';
import { fontVariables } from '@/app/fonts';

export const metadata: Metadata = {
  title: "We'll be back soon — PMMI",
  robots: { index: false, follow: false },
};

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
