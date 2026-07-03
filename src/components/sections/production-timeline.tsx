'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Flame, Wind, Thermometer, Layers, Boxes, ArrowRight } from 'lucide-react';
import { Placeholder } from '@/components/shared/placeholder';

const STEPS = [
  { key: 'step1', icon: Flame, placeholder: 'moltenIron' },
  { key: 'step2', icon: Wind, placeholder: 'converterFurnace' },
  { key: 'step3', icon: Thermometer, placeholder: 'refiningFurnace' },
  { key: 'step4', icon: Layers, placeholder: 'continuousCasting' },
  { key: 'step5', icon: Boxes, placeholder: 'slabBillet' },
] as const;

export function ProductionTimeline() {
  const t = useTranslations('Production');
  const ph = useTranslations('Placeholders');

  return (
    <div className="grid gap-6 lg:grid-cols-5 lg:gap-4">
      {STEPS.map((step, i) => (
        <div key={step.key} className="relative">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="flex h-full flex-col rounded-2xl border bg-card p-5 shadow-soft"
          >
            <Placeholder
              src={`/images/${step.placeholder}.webp`}
              label={ph(step.placeholder)}
              ratio="video"
              className="mb-4"
            />
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className="mt-4 text-base font-semibold leading-snug">
              {t(`${step.key}Title`)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t(`${step.key}Body`)}
            </p>
          </motion.div>

          {/* Connector arrow (between steps) */}
          {i < STEPS.length - 1 && (
            <div className="pointer-events-none absolute left-1/2 top-full z-10 -translate-x-1/2 py-2 text-accent lg:left-full lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:py-0">
              <ArrowRight className="h-5 w-5 rotate-90 lg:rotate-0" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
