'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LineChart, Briefcase, Inbox, Mail, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/scrap', label: 'Scrap Prices', icon: LineChart },
  { href: '/admin/careers', label: 'Careers', icon: Briefcase },
  { href: '/admin/applications', label: 'Applications', icon: Inbox },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Mail },
  { href: '/admin/content', label: 'Site Content', icon: FileText },
];

export function AdminNav() {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="flex gap-1 overflow-x-auto rounded-2xl border bg-background p-2 lg:flex-col lg:overflow-visible">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={cn(
            'inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
            isActive(l.href, l.exact)
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
          )}
        >
          <l.icon className="h-4 w-4" />
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
