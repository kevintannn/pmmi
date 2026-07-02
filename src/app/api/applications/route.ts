import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { applicationSchema } from '@/lib/validations';

export async function GET() {
  // Admin listing (newest first). Add auth before exposing publicly.
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: 'desc' },
    include: { career: { select: { position: true } } },
    take: 500,
  });
  return NextResponse.json(applications);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = applicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { careerId, name, email, phone, resumeUrl, coverLetter } = parsed.data;

    const application = await prisma.application.create({
      data: {
        careerId: careerId || null,
        name,
        email,
        phone,
        resumeUrl: resumeUrl || null,
        coverLetter: coverLetter || null,
      },
    });

    return NextResponse.json({ ok: true, id: application.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
