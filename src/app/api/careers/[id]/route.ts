import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { careerSchema } from '@/lib/validations';
import { revalidateCareers } from '@/lib/revalidate';
import { isAdminAuthed, unauthorized } from '@/lib/admin-auth';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdminAuthed())) return unauthorized();
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = careerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const updated = await prisma.career.update({ where: { id }, data: parsed.data });
    revalidateCareers();
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Not found or server error' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdminAuthed())) return unauthorized();
  try {
    const { id } = await params;
    await prisma.career.delete({ where: { id } });
    revalidateCareers();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Not found or server error' }, { status: 500 });
  }
}
