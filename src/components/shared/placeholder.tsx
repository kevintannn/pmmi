import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Ratio = 'square' | 'video' | 'wide' | 'portrait' | 'auto';

const ratioClass: Record<Ratio, string> = {
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
  portrait: 'aspect-[3/4]',
  auto: '',
};

interface PlaceholderProps {
  /** Localized label shown when no image is supplied (e.g. "Converter Furnace"). */
  label: string;
  /**
   * Optional real image. Drop a file into /public/images and pass its path
   * (e.g. "/images/converter-furnace.webp") to replace the placeholder — no
   * other change required.
   */
  src?: string;
  alt?: string;
  ratio?: Ratio;
  className?: string;
  priority?: boolean;
  /** Fill the parent instead of using an intrinsic aspect ratio. */
  fill?: boolean;
  rounded?: boolean;
}

/**
 * Universal image slot. Renders an optimized <Image> when `src` is provided,
 * otherwise an elegant labelled placeholder block — keeping every visual on the
 * site trivially swappable with a real photograph.
 */
export function Placeholder({
  label,
  src,
  alt,
  ratio = 'video',
  className,
  priority,
  fill,
  rounded = true,
}: PlaceholderProps) {
  const shell = cn(
    'relative overflow-hidden bg-secondary',
    rounded && 'rounded-2xl',
    fill ? 'h-full w-full' : ratioClass[ratio],
    className,
  );

  if (src) {
    return (
      <div className={shell}>
        <Image
          src={src}
          alt={alt ?? label}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority={priority}
        />
      </div>
    );
  }

  return (
    <div className={shell} role="img" aria-label={label} data-placeholder={label}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 20%, hsl(217 30% 92%), transparent 55%), linear-gradient(135deg, hsl(215 24% 96%), hsl(215 22% 90%))',
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-steel">
        <ImageIcon className="h-7 w-7 opacity-60" />
        <span className="px-4 text-center text-sm font-medium tracking-wide">{label}</span>
        <span className="text-[10px] uppercase tracking-[0.25em] opacity-50">Image</span>
      </div>
    </div>
  );
}
