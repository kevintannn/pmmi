import { Reveal } from './motion';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Adds a subtle tinted background band. */
  tinted?: boolean;
}

/**
 * Standard inner-page header. Includes top padding to clear the fixed,
 * transparent navbar.
 */
export function PageHeader({ eyebrow, title, description, tinted = true }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'pt-32 sm:pt-40',
        tinted &&
          'bg-gradient-to-b from-secondary/60 to-background pb-16 sm:pb-20',
      )}
    >
      <div className="container">
        <Reveal className="mx-auto max-w-3xl text-center">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h1 className="text-display text-4xl sm:text-5xl md:text-6xl">{title}</h1>
          {description && (
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </Reveal>
      </div>
    </header>
  );
}
