import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { inquirySchema } from '@/lib/validations';

export async function GET() {
  // Admin listing (newest first). Add auth before exposing publicly.
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
    take: 500,
  });
  return NextResponse.json(inquiries);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { name, email, phone, company, country, message } = parsed.data;
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        country: country || null,
        message,
      },
    });

    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
