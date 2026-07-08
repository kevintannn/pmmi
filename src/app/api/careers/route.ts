import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { careerSchema } from '@/lib/validations';
import { revalidateCareers } from '@/lib/revalidate';
import { isAdminAuthed, unauthorized } from '@/lib/admin-auth';

export async function GET() {
  const careers = await prisma.career.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(careers);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthed())) return unauthorized();
  try {
    const body = await request.json();
    const parsed = careerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const created = await prisma.career.create({ data: parsed.data });
    revalidateCareers();
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
