import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scrapPriceSchema } from '@/lib/validations';
import { revalidateScrap } from '@/lib/revalidate';

export async function GET() {
  const prices = await prisma.scrapPrice.findMany({
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    take: 500,
  });
  return NextResponse.json(
    prices.map((p) => ({ ...p, price: Number(p.price) })),
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = scrapPriceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { date, category, price, currency, notes } = parsed.data;
    const created = await prisma.scrapPrice.create({
      data: {
        date: new Date(date),
        category,
        price,
        currency,
        notes: notes || null,
      },
    });
    revalidateScrap();
    return NextResponse.json({ ...created, price: Number(created.price) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
