'use client';

import { useEffect } from 'react';

/**
 * Fires a lightweight beacon so the server can record a visit. The API
 * de-duplicates per session, so mounting this on every page is safe — a person
 * browsing multiple pages still counts once.
 *
 * Only rendered inside the public layouts (never /admin), and it runs in the
 * browser, so non-JS crawlers are excluded automatically.
 */
export function VisitTracker({ locale }: { locale?: string }) {
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: window.location.pathname, locale }),
      keepalive: true,
      signal: controller.signal,
    }).catch(() => {
      /* analytics must never surface errors */
    });
    return () => controller.abort();
  }, [locale]);

  return null;
}
