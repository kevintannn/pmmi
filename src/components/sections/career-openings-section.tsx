import { getOpenCareers } from '@/lib/data/careers';
import { CareerOpenings } from '@/components/sections/career-openings';

/**
 * Async server component that fetches open positions. Rendered inside a
 * <Suspense> boundary so the careers page shell appears immediately and the
 * openings stream in when the database (incl. any Neon cold start) responds.
 */
export async function CareerOpeningsData() {
  const careers = await getOpenCareers();
  return <CareerOpenings careers={careers} />;
}

/** Loading placeholder shown while openings stream in. */
export function CareerOpeningsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2" aria-hidden>
      {[0, 1].map((i) => (
        <div key={i} className="rounded-2xl border bg-card p-7 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div className="skeleton h-6 w-48 rounded" />
            <div className="skeleton h-5 w-20 rounded-full" />
          </div>
          <div className="mt-4 flex gap-5">
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-4 w-28 rounded" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="skeleton h-3.5 w-full rounded" />
            <div className="skeleton h-3.5 w-11/12 rounded" />
            <div className="skeleton h-3.5 w-4/5 rounded" />
          </div>
          <div className="skeleton mt-6 h-10 w-32 rounded-full" />
        </div>
      ))}
    </div>
  );
}
