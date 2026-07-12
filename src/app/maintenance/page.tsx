import { Wrench } from 'lucide-react';
import { Logo } from '@/components/shared/logo';

// Rendered as-is when maintenance mode is on (the middleware redirects all
// public routes here). Kept simple and self-contained — no DB, no i18n.
export default function MaintenancePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 50% at 50% 0%, hsl(217 61% 22% / 0.08), transparent 70%), radial-gradient(ellipse 50% 40% at 100% 100%, hsl(42 52% 54% / 0.08), transparent 70%)',
        }}
      />

      <div className="relative z-10 flex max-w-lg flex-col items-center">
        <Logo className="scale-110" />

        <span className="mt-10 grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Wrench className="h-8 w-8" />
        </span>

        <h1 className="text-display mt-6 text-3xl sm:text-4xl">
          We&apos;ll be back soon
        </h1>
        <p className="mt-2 text-lg font-medium text-muted-foreground">网站维护中，即将回归</p>

        <p className="mx-auto mt-6 max-w-md leading-relaxed text-muted-foreground">
          Our site is undergoing scheduled maintenance and will be available again
          shortly. Thank you for your patience.
          <br />
          <span className="mt-2 block">
            我们的网站正在进行维护，稍后将恢复访问，感谢您的耐心等待。
          </span>
        </p>

        <a
          href="mailto:info@permaimetal.com"
          className="mt-8 inline-flex h-11 items-center rounded-full border px-6 text-sm font-medium transition-colors hover:bg-secondary"
        >
          info@permaimetal.com
        </a>
      </div>
    </div>
  );
}
