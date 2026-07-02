'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Placeholder } from '@/components/shared/placeholder';

export function Hero() {
  const t = useTranslations('Home');
  const ph = useTranslations('Placeholders');
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  // Parallax: background drifts slower than the page scroll.
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* Parallax background image */}
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <Placeholder
          label={ph('factoryExterior')}
          fill
          rounded={false}
          priority
          className="h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/45 to-charcoal/80" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="container relative z-10 flex flex-col items-center text-center text-white"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm font-medium uppercase tracking-[0.25em] text-gold"
        >
          {t('heroSubheadline')}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-display mt-5 max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {t('heroHeadline')}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10"
        >
          <Button asChild size="lg" variant="accent">
            <Link href="/about">
              {t('heroCta')}
              <ArrowRight />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#intro"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="block"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.span>
      </motion.a>
    </section>
  );
}
