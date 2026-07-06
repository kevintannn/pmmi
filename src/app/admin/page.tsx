import { Suspense } from 'react';
import Link from 'next/link';
import { LineChart, Briefcase, Inbox, Mail } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { withTimeout } from '@/lib/db';
import { DashboardStatsSkeleton } from '@/components/admin/admin-skeletons';

export const dynamic = 'force-dynamic';

async function getCounts() {
  const result = await withTimeout(
    Promise.all([
      prisma.scrapPrice.count(),
      prisma.career.count(),
      prisma.application.count(),
      prisma.inquiry.count(),
    ]),
    null,
  );
  if (!result) {
    return { scrap: 0, careers: 0, applications: 0, inquiries: 0, ok: false as const };
  }
  const [scrap, careers, applications, inquiries] = result;
  return { scrap, careers, applications, inquiries, ok: true as const };
}

async function DashboardStats() {
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
    <>
      {!counts.ok && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
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
    </>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage scrap prices, careers and messages. No authentication is configured yet.
        </p>
      </div>

      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats />
      </Suspense>
    </div>
  );
}
