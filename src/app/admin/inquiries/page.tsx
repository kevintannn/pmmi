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

async function getInquiries() {
  return withTimeout(
    prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 500 }),
    [],
  );
}

export default async function InquiriesAdminPage() {
  const inquiries = await getInquiries();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Inquiries"
        description="Messages submitted from the contact page."
      />
      <div className="overflow-hidden rounded-2xl border bg-background shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                  No inquiries yet.
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="whitespace-nowrap font-medium">
                    {formatDateISO(q.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div>{q.name}</div>
                    <a
                      href={`mailto:${q.email}`}
                      className="text-sm text-primary underline-offset-4 hover:underline"
                    >
                      {q.email}
                    </a>
                    {q.phone && (
                      <div className="text-sm text-muted-foreground">{q.phone}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{q.company ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{q.country ?? '—'}</TableCell>
                  <TableCell className="max-w-md text-muted-foreground">{q.message}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
