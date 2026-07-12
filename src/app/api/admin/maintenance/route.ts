import { NextResponse } from 'next/server';
import { isAdminAuthed, unauthorized } from '@/lib/admin-auth';
import { isMaintenanceOn, setMaintenance, canToggleMaintenance } from '@/lib/maintenance';

export async function GET() {
  if (!(await isAdminAuthed())) return unauthorized();
  return NextResponse.json({
    enabled: await isMaintenanceOn(),
    canToggle: canToggleMaintenance(),
  });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthed())) return unauthorized();

  let enabled: unknown;
  try {
    enabled = (await request.json())?.enabled;
  } catch {
    enabled = undefined;
  }
  if (typeof enabled !== 'boolean') {
    return NextResponse.json({ error: 'Expected { enabled: boolean }' }, { status: 400 });
  }

  try {
    await setMaintenance(enabled);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, enabled });
}
