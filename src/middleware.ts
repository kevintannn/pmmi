import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // The bare root ("/") renders a custom language selector and must not be
  // redirected to a locale by the i18n middleware.
  if (request.nextUrl.pathname === '/') {
    return NextResponse.next();
  }
  return intlMiddleware(request);
}

export const config = {
  // Run on everything except API routes, the admin area, Next internals,
  // and static files (anything with a dot in the last segment).
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
};
