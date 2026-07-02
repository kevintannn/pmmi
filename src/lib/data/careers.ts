import 'server-only';
import { prisma } from '@/lib/prisma';
import { withTimeout } from '@/lib/db';

export type CareerDTO = {
  id: string;
  position: string;
  department: string;
  location: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  description: string;
  status: 'OPEN' | 'CLOSED';
};

/** Open positions for the public careers page. Never throws. */
export async function getOpenCareers(): Promise<CareerDTO[]> {
  const rows = await withTimeout(
    prisma.career.findMany({
      where: { status: 'OPEN' },
      orderBy: { createdAt: 'desc' },
    }),
    [],
  );
  return rows as CareerDTO[];
}
