import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

// Requires the Node.js runtime for filesystem access.
export const runtime = 'nodejs';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

/**
 * Stores an uploaded résumé in /public/uploads and returns its public URL.
 *
 * NOTE: This writes to the local filesystem, which works in development and on
 * a persistent server. Vercel's filesystem is ephemeral/read-only at runtime —
 * for production, swap this for Vercel Blob or S3 (see README "Future
 * improvements"). The rest of the app only depends on the returned `url`.
 */
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 413 });
    }
    if (file.type && !ALLOWED.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name).slice(0, 10) || '.bin';
    const safeExt = /^\.[a-z0-9]+$/i.test(ext) ? ext : '.bin';
    const filename = `${randomUUID()}${safeExt}`;

    const dir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Upload failed. On serverless hosting, configure blob storage.' },
      { status: 500 },
    );
  }
}
