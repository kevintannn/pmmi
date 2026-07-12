import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { isMaintenanceOn } from './lib/maintenance';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Maintenance gate. /admin and /api are already excluded by the matcher, so
  // the admin panel (to toggle it off) and its APIs stay reachable.
  const maintenance = await isMaintenanceOn();
  if (maintenance) {
    if (pathname !== '/maintenance') {
      const url = request.nextUrl.clone();
      url.pathname = '/maintenance';
      url.search = '';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  // When not in maintenance, the maintenance page shouldn't be directly visited.
  if (pathname === '/maintenance') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // The bare root ("/") renders a custom language selector and must not be
  // redirected to a locale by the i18n middleware.
  if (pathname === '/') {
    return NextResponse.next();
  }
  return intlMiddleware(request);
}

export const config = {
  // Run on everything except API routes, the admin area, the non-localized
  // PWA offline fallback, Next internals, and static files (anything with a
  // dot in the last segment).
  matcher: ['/((?!api|admin|offline|_next|_vercel|.*\\..*).*)'],
};
