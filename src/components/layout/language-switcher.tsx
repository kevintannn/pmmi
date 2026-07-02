'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { Globe } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { LOCALE_STORAGE_KEY } from '@/lib/client-preferences';

const LABEL: Record<string, string> = { zh: '中文', en: 'EN' };

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: string) {
    if (next === locale) return;
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* storage may be unavailable */
    }
    // `pathname` is the current route without the locale prefix; next-intl
    // re-applies the target locale.
    startTransition(() => router.replace(pathname, { locale: next }));
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border bg-background/60 p-0.5 text-sm',
        className,
      )}
    >
      <Globe className="ml-2 h-3.5 w-3.5 text-muted-foreground" aria-hidden />
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          disabled={isPending}
          aria-pressed={loc === locale}
          className={cn(
            'rounded-full px-2.5 py-1 font-medium transition-colors',
            loc === locale
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {LABEL[loc] ?? loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
