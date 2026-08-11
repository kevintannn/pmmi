import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

const COOKIE = 'pmmi_s';
const SESSION_S = 30 * 60; // 30-minute sliding session window

// Obvious crawlers. Most bots don't run JS (so never reach this beacon), but
// this catches headless/JS-capable ones.
const BOT_RE =
  /bot|crawler|spider|crawling|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|showyoubot|outbrain|pinterest|vkshare|w3c_validator|lighthouse|headlesschrome|gtmetrix|pingdom|uptime/i;

function todayUTC(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Visit beacon. Records ONE visit per browsing session (30 min of inactivity
 * ends a session), so a person browsing several pages counts once.
 * Admin pages never call this, and bots are filtered by user-agent.
 */
export async function POST(request: Request) {
  try {
    const ua = request.headers.get('user-agent') ?? '';
    if (!ua || BOT_RE.test(ua)) {
      return NextResponse.json({ ok: true, counted: false });
    }

    const store = await cookies();
    const existing = store.get(COOKIE)?.value;

    // Refresh the sliding window on every ping.
    store.set(COOKIE, '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_S,
    });

    // Already inside an active session → don't double-count.
    if (existing) {
      return NextResponse.json({ ok: true, counted: false });
    }

    let path: string | undefined;
    let locale: string | undefined;
    try {
      const body = await request.json();
      path = typeof body?.path === 'string' ? body.path.slice(0, 200) : undefined;
      locale = typeof body?.locale === 'string' ? body.locale.slice(0, 8) : undefined;
    } catch {
      /* body is optional */
    }

    await prisma.visit.create({
      data: { date: todayUTC(), path: path ?? null, locale: locale ?? null },
    });

    return NextResponse.json({ ok: true, counted: true });
  } catch {
    // Analytics must never break the page.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
