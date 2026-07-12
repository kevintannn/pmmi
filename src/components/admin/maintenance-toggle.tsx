'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MaintenanceToggle() {
  const [enabled, setEnabled] = useState(false);
  const [canToggle, setCanToggle] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/maintenance')
      .then((r) => r.json())
      .then((d) => {
        setEnabled(Boolean(d.enabled));
        setCanToggle(Boolean(d.canToggle));
      })
      .catch(() => toast.error('Failed to load maintenance status'))
      .finally(() => setLoading(false));
  }, []);

  async function toggle() {
    if (saving || loading) return;
    const next = !enabled;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: next }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || 'Update failed');
      }
      setEnabled(next);
      toast.success(
        next ? 'Maintenance mode ON — visitors see the maintenance page.' : 'Maintenance mode OFF — site is live.',
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className={cn(
        'rounded-2xl border bg-background p-6 shadow-soft transition-colors',
        enabled && 'border-amber-300 bg-amber-50',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'grid h-10 w-10 shrink-0 place-items-center rounded-xl',
              enabled ? 'bg-amber-200 text-amber-800' : 'bg-secondary text-muted-foreground',
            )}
          >
            <Wrench className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold">Maintenance Mode</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {enabled
                ? 'The public site is showing the maintenance page. Admin stays accessible.'
                : 'Turn on to show all visitors a “We’ll be back soon” page.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Toggle maintenance mode"
          disabled={loading || saving || !canToggle}
          onClick={toggle}
          className={cn(
            'relative mt-1 inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60',
            enabled ? 'bg-amber-500' : 'bg-input',
          )}
        >
          <span
            className={cn(
              'grid h-5 w-5 place-items-center rounded-full bg-white shadow transition-transform',
              enabled ? 'translate-x-6' : 'translate-x-1',
            )}
          >
            {(loading || saving) && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
          </span>
        </button>
      </div>

      {!loading && !canToggle && (
        <p className="mt-4 rounded-lg border border-amber-300 bg-amber-100/60 p-3 text-xs text-amber-800">
          Toggling isn’t configured yet. Add a Vercel Edge Config store plus
          <code className="mx-1">VERCEL_API_TOKEN</code> and
          <code className="mx-1">EDGE_CONFIG_ID</code> env vars to enable it. (You can
          still toggle from the Vercel dashboard, or via the <code>MAINTENANCE_MODE</code>{' '}
          env var.)
        </p>
      )}
    </div>
  );
}
