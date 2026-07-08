import { fontVariables } from '@/app/fonts';
import { Toaster } from '@/components/ui/sonner';
import '@/app/globals.css';

export const metadata = {
  title: 'Admin — PMMI',
  robots: { index: false, follow: false },
};

// Base admin layout: provides <html>/<body> for both the login screen and the
// authenticated dashboard. The shell (header/sidebar) lives in (dashboard).
export default function AdminBaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={fontVariables}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-secondary/30 font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
