import { NextResponse } from 'next/server';
import { isValidPin, createAdminSession } from '@/lib/admin-auth';

export async function POST(request: Request) {
  let pin: unknown;
  try {
    pin = (await request.json())?.pin;
  } catch {
    pin = undefined;
  }

  if (!isValidPin(pin)) {
    // Small delay to slow brute-force attempts on the 6-digit space.
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
