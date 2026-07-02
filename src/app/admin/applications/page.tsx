import { prisma } from '@/lib/prisma';
import { withTimeout } from '@/lib/db';
import { formatDateISO } from '@/lib/utils';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const dynamic = 'force-dynamic';

async function getApplications() {
  return withTimeout(
    prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      include: { career: { select: { position: true } } },
      take: 500,
    }),
    [],
  );
}

export default async function ApplicationsAdminPage() {
  const applications = await getApplications();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Applications"
        description="Job applications submitted from the careers page."
      />
      <div className="overflow-hidden rounded-2xl border bg-background shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Résumé</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                  No applications yet.
                </TableCell>
              </TableRow>
            ) : (
              applications.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="whitespace-nowrap font-medium">
                    {formatDateISO(a.createdAt)}
                  </TableCell>
                  <TableCell>{a.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {a.career?.position ?? 'General'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div>{a.email}</div>
                    <div>{a.phone}</div>
                  </TableCell>
                  <TableCell>
                    {a.resumeUrl ? (
                      <a
                        href={a.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        Download
                      </a>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
