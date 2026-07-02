import { cn } from '@/lib/utils';

/**
 * PMMI wordmark. A geometric "steel" monogram + company short name.
 * Replace the SVG mark with a real logo file when available.
 */
export function Logo({
  className,
  showText = true,
  invert = false,
}: {
  className?: string;
  showText?: boolean;
  invert?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'grid h-9 w-9 place-items-center rounded-xl font-display text-sm font-bold',
          invert ? 'bg-white text-primary' : 'bg-primary text-white',
        )}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path d="M4 18 L9 6 L12 13 L15 6 L20 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'font-display text-lg font-bold tracking-tight',
              invert ? 'text-white' : 'text-foreground',
            )}
          >
            PMMI
          </span>
          <span
            className={cn(
              'text-[10px] font-medium uppercase tracking-[0.18em]',
              invert ? 'text-white/60' : 'text-muted-foreground',
            )}
          >
            Permai Metal
          </span>
        </span>
      )}
    </span>
  );
}
