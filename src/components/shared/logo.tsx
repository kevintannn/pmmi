import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * PMMI logo. The mark is loaded from /public/logo.jpg — replace that file to
 * change the logo. Set `showText={false}` if your image already includes the
 * company name.
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
        className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-[5px] bg-black"
        aria-hidden
      >
        {/* Rendered smaller than the tile so the emblem sits in more black
            background instead of filling the frame edge-to-edge. */}
        <Image
          src="/logo.jpg"
          alt="PMMI logo"
          width={98}
          height={98}
          className="h-7 w-7 object-contain"
        />
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
