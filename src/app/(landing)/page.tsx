'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { LOCALE_STORAGE_KEY } from '@/lib/client-preferences';

const LOCALES = [
  {
    code: 'zh',
    label: '中文',
    caption: 'Chinese',
    slogan: '以钢铁铸就印尼的未来',
  },
  {
    code: 'en',
    label: 'English',
    caption: '英文',
    slogan: "Building Indonesia's Future Through Steel",
  },
] as const;

export default function LanguageSelector() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function choose(code: string) {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, code);
    } catch {
      /* storage may be unavailable */
    }
    startTransition(() => router.push(`/${code}`));
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 50% at 50% 0%, hsl(217 61% 22% / 0.08), transparent 70%), radial-gradient(ellipse 50% 40% at 100% 100%, hsl(42 52% 54% / 0.08), transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative z-10 w-full max-w-xl text-center"
      >
        <div className="flex justify-center">
          <Logo className="scale-125" />
        </div>

        <h1 className="mt-10 text-display text-3xl sm:text-4xl">
          PT Permai Metal Indonesia
        </h1>
        <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          佩尔迈金属（印尼）有限公司
        </p>

        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
          以钢铁铸就印尼的未来
          <span className="mx-2 text-border">·</span>
          Building Indonesia&apos;s Future Through Steel
        </p>

        <p className="mt-12 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Select your language · 请选择语言
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {LOCALES.map((loc) => (
            <button
              key={loc.code}
              type="button"
              disabled={isPending}
              onClick={() => choose(loc.code)}
              className="group relative flex flex-col items-start gap-1 rounded-2xl border bg-card p-6 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft-lg disabled:opacity-60"
            >
              <span className="text-2xl font-semibold tracking-tight">{loc.label}</span>
              <span className="text-sm text-muted-foreground">{loc.caption}</span>
              <ArrowRight className="absolute right-6 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
