import 'server-only';

/**
 * Await a database query, but fall back to `fallback` if it doesn't resolve
 * within `ms`. This is a safety net against a truly unreachable database, not a
 * fast-fail: the default is generous enough to absorb a Neon cold start (the
 * free tier auto-suspends after idle and takes a few seconds to wake), so a
 * sleeping database is never mistaken for "no data". Errors also resolve to the
 * fallback, so a `try/catch` at the call site isn't needed.
 */
export async function withTimeout<T>(
  query: Promise<T>,
  fallback: T,
  ms = 8000,
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
