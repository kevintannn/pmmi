'use client';

import { useRef, useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { cn } from '@/lib/utils';

const LENGTH = 6;

export function AdminLogin() {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''));
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const focus = (i: number) => inputs.current[i]?.focus();

  async function submit(pin: string) {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        window.location.assign('/admin');
        return;
      }
      throw new Error('invalid');
    } catch {
      setError(true);
      setDigits(Array(LENGTH).fill(''));
      setLoading(false);
      focus(0);
    }
  }

  function setAt(i: number, val: string) {
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (next.every((d) => d !== '')) submit(next.join(''));
  }

  function onChange(i: number, raw: string) {
    const val = raw.replace(/\D/g, '');
    if (!val) {
      setAt(i, '');
      return;
    }
    // Handle multi-char (e.g. autofill): distribute across boxes.
    if (val.length > 1) {
      const chars = val.slice(0, LENGTH).split('');
      const next = Array(LENGTH).fill('');
      chars.forEach((c, idx) => (next[idx] = c));
      setDigits(next);
      const last = Math.min(chars.length, LENGTH) - 1;
      focus(Math.min(last + 1, LENGTH - 1));
      if (next.every((d) => d !== '')) submit(next.join(''));
      return;
    }
    setAt(i, val);
    if (i < LENGTH - 1) focus(i + 1);
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      focus(i - 1);
      setAt(i - 1, '');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mt-10 rounded-2xl border bg-background p-8 shadow-soft">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <Lock className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-xl font-semibold">Admin Access</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter your 6-digit PIN</p>

          <div className="mt-6 flex justify-center gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                value={d}
                onChange={(e) => onChange(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(i, e)}
                inputMode="numeric"
                type="password"
                autoComplete={i === 0 ? 'one-time-code' : 'off'}
                maxLength={1}
                disabled={loading}
                aria-label={`PIN digit ${i + 1}`}
                className={cn(
                  'h-14 w-11 rounded-xl border bg-background text-center text-2xl font-semibold shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring disabled:opacity-60',
                  error && 'border-destructive',
                )}
                autoFocus={i === 0}
              />
            ))}
          </div>

          <div className="mt-4 flex h-5 items-center justify-center text-sm">
            {loading ? (
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
              </span>
            ) : error ? (
              <span className="text-destructive">Incorrect PIN. Try again.</span>
            ) : null}
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">PT Permai Metal Indonesia · Admin</p>
      </div>
    </div>
  );
}
