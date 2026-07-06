import { TableCell, TableRow } from '@/components/ui/table';

/** Skeleton for the dashboard stat cards (shown while counts load). */
export function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border bg-background p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-5 w-5 rounded" />
          </div>
          <div className="skeleton mt-3 h-9 w-16 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton rows for an admin table body (shown while records load). */
export function AdminTableSkeletonRows({
  cols,
  rows = 6,
}: {
  cols: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <TableRow key={r} aria-hidden>
          {Array.from({ length: cols }).map((_, c) => (
            <TableCell key={c}>
              <div className="skeleton h-4 w-full max-w-[160px] rounded" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
