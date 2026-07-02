'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { Globe } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { LOCALE_STORAGE_KEY } from '@/lib/client-preferences';

const LABEL: Record<string, string> = { zh: '中文', en: 'EN' };

export function LanguageSwitcher({
  className,
  onDark = false,
}: {
  className?: string;
  /** Render for placement over a dark background (e.g. the home hero). */
  onDark?: boolean;
}) {
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
        'inline-flex items-center gap-1 rounded-full border p-0.5 text-sm',
        onDark ? 'border-white/25 bg-white/10 backdrop-blur-sm' : 'bg-background/60',
        className,
      )}
    >
      <Globe
        className={cn('ml-2 h-3.5 w-3.5', onDark ? 'text-white/70' : 'text-muted-foreground')}
        aria-hidden
      />
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
              ? onDark
                ? 'bg-white text-primary'
                : 'bg-primary text-primary-foreground'
              : onDark
                ? 'text-white/80 hover:text-white'
                : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {LABEL[loc] ?? loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
