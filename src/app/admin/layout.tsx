import Link from 'next/link';
import { fontVariables } from '@/app/fonts';
import { Logo } from '@/components/shared/logo';
import { Toaster } from '@/components/ui/sonner';
import { AdminNav } from '@/components/admin/admin-nav';
import '@/app/globals.css';

export const metadata = {
  title: 'Admin — PMMI',
  robots: { index: false, follow: false },
};

// Non-localized admin area. Authentication is intentionally omitted for now;
// wrap this layout (or add middleware) to protect it — see README.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-screen bg-secondary/30 font-sans">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-4">
                <Link href="/admin">
                  <Logo />
                </Link>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  Admin
                </span>
              </div>
              <Link
                href="/"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View site →
              </Link>
            </div>
          </header>

          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:flex-row">
            <aside className="lg:w-56 lg:shrink-0">
              <AdminNav />
            </aside>
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
