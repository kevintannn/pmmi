import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scrapPriceSchema } from '@/lib/validations';
import { revalidateScrap } from '@/lib/revalidate';
import { isAdminAuthed, unauthorized } from '@/lib/admin-auth';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdminAuthed())) return unauthorized();
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = scrapPriceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { date, category, price, currency, notes } = parsed.data;
    const updated = await prisma.scrapPrice.update({
      where: { id },
      data: {
        date: new Date(date),
        category,
        price,
        currency,
        notes: notes || null,
      },
    });
    revalidateScrap();
    return NextResponse.json({ ...updated, price: Number(updated.price) });
  } catch {
    return NextResponse.json({ error: 'Not found or server error' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdminAuthed())) return unauthorized();
  try {
    const { id } = await params;
    await prisma.scrapPrice.delete({ where: { id } });
    revalidateScrap();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Not found or server error' }, { status: 500 });
  }
}
