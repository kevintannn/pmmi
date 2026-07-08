import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Simple shared-PIN admin gate.
 *
 * A correct 6-digit PIN (env: ADMIN_PIN) issues an HMAC-signed, httpOnly session
 * cookie with an expiry — the PIN itself is never stored in the cookie, and the
 * token can't be forged without the server secret. Designed to be replaced by
 * full username/password auth later without touching call sites.
 */
const COOKIE = 'pmmi_admin';
const MAX_AGE_S = 60 * 60 * 24 * 30; // 30 days

// Signing secret. Prefer an explicit ADMIN_SESSION_SECRET; otherwise derive one
// from the PIN so rotating the PIN also invalidates existing sessions.
const SECRET =
  process.env.ADMIN_SESSION_SECRET || `pmmi::${process.env.ADMIN_PIN ?? 'unset'}`;

function sign(exp: number): string {
  const sig = createHmac('sha256', SECRET).update(String(exp)).digest('hex');
  return `${exp}.${sig}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expStr, sig] = token.split('.');
  if (!expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  const expected = createHmac('sha256', SECRET).update(expStr).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

/** Constant-time check of a submitted PIN against ADMIN_PIN. */
export function isValidPin(pin: unknown): boolean {
  const expected = process.env.ADMIN_PIN ?? '';
  if (typeof pin !== 'string' || !/^\d{6}$/.test(expected) || pin.length !== expected.length) {
    return false;
  }
  return timingSafeEqual(Buffer.from(pin), Buffer.from(expected));
}

/** True if the current request carries a valid admin session cookie. */
export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(COOKIE)?.value);
}

/** Issue a session cookie. Call from a route handler / server action only. */
export async function createAdminSession(): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_S;
  const store = await cookies();
  store.set(COOKIE, sign(exp), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_S,
  });
}

/** Clear the session cookie (sign out). */
export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

/** 401 response for use in protected API route handlers. */
export function unauthorized(): NextResponse {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
