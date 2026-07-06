import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidateSiteContent } from '@/lib/revalidate';

export async function GET(request: Request) {
  const locale = new URL(request.url).searchParams.get('locale') ?? undefined;
  const rows = await prisma.siteContent.findMany({
    where: locale ? { locale } : undefined,
    orderBy: [{ locale: 'asc' }, { key: 'asc' }],
  });
  return NextResponse.json(rows);
}

const upsertSchema = z.object({
  key: z.string().min(1).max(120),
  locale: z.string().min(1).max(8),
  value: z.string().max(8000),
});

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = upsertSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { key, locale, value } = parsed.data;
    const row = await prisma.siteContent.upsert({
      where: { key_locale: { key, locale } },
      update: { value },
      create: { key, locale, value },
    });
    revalidateSiteContent();
    return NextResponse.json(row);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
