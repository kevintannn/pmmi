import { Users } from 'lucide-react';
import { getVisitStats } from '@/lib/data/visits';
import { VisitsChart } from '@/components/admin/visits-chart';

/**
 * Visitor counter card: totals plus a 30-day trend. Counts unique visits
 * (one per ~30-minute browsing session), excluding /admin and known bots.
 */
export async function VisitorStats() {
  const stats = await getVisitStats();

  const figures = [
    { label: 'Total visits', value: stats.total, accent: true },
    { label: 'Today', value: stats.today },
    { label: 'Last 7 days', value: stats.last7 },
    { label: 'Last 30 days', value: stats.last30 },
  ];

  return (
    <div className="rounded-2xl border bg-background p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Users className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-semibold">Visitors</h2>
          <p className="text-sm text-muted-foreground">
            Unique visits (one per session) · excludes admin &amp; bots
          </p>
        </div>
      </div>

      {!stats.ok && (
        <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
          Could not reach the database — figures unavailable.
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {figures.map((f) => (
          <div key={f.label}>
            <div
              className={
                f.accent
                  ? 'text-3xl font-semibold tabular-nums text-primary'
                  : 'text-3xl font-semibold tabular-nums'
              }
            >
              {f.value.toLocaleString()}
            </div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {f.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
          Last 30 days
        </h3>
        <VisitsChart data={stats.daily} />
      </div>
    </div>
  );
}

/** Loading placeholder while visit stats stream in. */
export function VisitorStatsSkeleton() {
  return (
    <div className="rounded-2xl border bg-background p-6 shadow-soft" aria-hidden>
      <div className="flex items-center gap-3">
        <div className="skeleton h-10 w-10 rounded-xl" />
        <div className="space-y-2">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-3 w-56 rounded" />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <div className="skeleton h-9 w-20 rounded-lg" />
            <div className="skeleton mt-2 h-3 w-24 rounded" />
          </div>
        ))}
      </div>
      <div className="skeleton mt-8 h-[220px] w-full rounded-xl" />
    </div>
  );
}
