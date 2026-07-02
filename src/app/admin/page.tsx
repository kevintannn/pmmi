import Link from 'next/link';
import { LineChart, Briefcase, Inbox, Mail } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getCounts() {
  try {
    const [scrap, careers, applications, inquiries] = await Promise.all([
      prisma.scrapPrice.count(),
      prisma.career.count(),
      prisma.application.count(),
      prisma.inquiry.count(),
    ]);
    return { scrap, careers, applications, inquiries, ok: true as const };
  } catch {
    return { scrap: 0, careers: 0, applications: 0, inquiries: 0, ok: false as const };
  }
}

export default async function AdminDashboard() {
  const counts = await getCounts();

  const cards = [
    { label: 'Scrap Prices', value: counts.scrap, href: '/admin/scrap', icon: LineChart },
    { label: 'Careers', value: counts.careers, href: '/admin/careers', icon: Briefcase },
    {
      label: 'Applications',
      value: counts.applications,
      href: '/admin/applications',
      icon: Inbox,
    },
    { label: 'Inquiries', value: counts.inquiries, href: '/admin/inquiries', icon: Mail },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage scrap prices, careers and messages. No authentication is configured yet.
        </p>
      </div>

      {!counts.ok && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          Could not reach the database. Check <code>DATABASE_URL</code> and run
          migrations/seed.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border bg-background p-6 shadow-soft transition-shadow hover:shadow-soft-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{c.label}</span>
              <c.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-3 text-3xl font-semibold tabular-nums">{c.value}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
