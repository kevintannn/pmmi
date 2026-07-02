import { fontVariables } from '@/app/fonts';

export const metadata = { title: 'Offline' };

export default function OfflineLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
