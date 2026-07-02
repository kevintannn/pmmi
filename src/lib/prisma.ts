import { PrismaClient, Prisma } from '@prisma/client';

// Reuse a single PrismaClient across hot-reloads in dev and across warm
// serverless invocations in production to avoid exhausting connections.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Matches Prisma's "database unreachable" errors (P1001), which are expected —
// and handled with fallbacks — when DATABASE_URL isn't configured yet.
const UNREACHABLE = /can'?t reach database server|P1001/i;

function createPrismaClient() {
  // Route errors through an event handler instead of printing them directly,
  // so we can collapse the repeated "can't reach database" spam into a single
  // friendly warning while still surfacing real errors.
  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? [{ emit: 'event', level: 'error' }, { emit: 'stdout', level: 'warn' }]
        : [{ emit: 'event', level: 'error' }],
  });

  let warnedUnreachable = false;
  client.$on('error', (e: Prisma.LogEvent) => {
    if (UNREACHABLE.test(e.message)) {
      if (!warnedUnreachable) {
        warnedUnreachable = true;
        console.warn(
          '[db] Database unreachable — serving fallback content. ' +
            'Set DATABASE_URL (see docs/NEON.md) to enable live data.',
        );
      }
      return;
    }
    console.error('[prisma]', e.message);
  });

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
