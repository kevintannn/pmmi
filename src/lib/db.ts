import 'server-only';

/**
 * Await a database query, but fall back to `fallback` if it doesn't resolve
 * within `ms`. This keeps pages responsive when the database is unreachable or
 * slow (Prisma's own connection-retry window can be several seconds) instead of
 * blocking the render. Combine with a `try/catch` at the call site is not
 * needed — errors also resolve to the fallback.
 */
export async function withTimeout<T>(
  query: Promise<T>,
  fallback: T,
  ms = 1200,
): Promise<T> {
  // Prevent an unhandled rejection if the timeout wins the race.
  query.catch(() => {});
  try {
    return await Promise.race([
      query,
      new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
    ]);
  } catch {
    return fallback;
  }
}
