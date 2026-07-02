'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

export function Navbar() {
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-300',
        scrolled
          ? 'border-b bg-background/80 backdrop-blur-xl shadow-soft'
          : 'bg-transparent',
      )}
    >
      <nav className="container flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href="/" aria-label="PMMI home" className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className={cn(
                  'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <Link href="/contact">{t('contact')}</Link>
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label={t('menu')}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle asChild>
                  <span>
                    <Logo />
                  </span>
                </SheetTitle>
              </SheetHeader>
              <ul className="mt-8 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.key}>
                    <SheetClose asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          'block rounded-xl px-4 py-3 text-base font-medium transition-colors',
                          isActive(item.href)
                            ? 'bg-secondary text-primary'
                            : 'hover:bg-secondary',
                        )}
                      >
                        {t(item.key)}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t pt-6">
                <LanguageSwitcher />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
