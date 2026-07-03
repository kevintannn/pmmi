import { NextResponse } from 'next/server';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

// Requires the Node.js runtime (filesystem fallback + Blob SDK).
export const runtime = 'nodejs';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

// Vercel Blob is configured when either a static token or a store id (OIDC) is
// present. On Vercel, connecting a Blob store adds BLOB_STORE_ID and the SDK
// authenticates automatically via the injected VERCEL_OIDC_TOKEN — no static
// BLOB_READ_WRITE_TOKEN is required.
const BLOB_ENABLED = Boolean(
  process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID,
);

/**
 * Stores an uploaded résumé and returns its URL.
 *
 * - In production (Vercel), connect a Blob store to the project; files are
 *   stored durably in Vercel Blob.
 * - Locally (no Blob env), files are written to /public/uploads so development
 *   works without any storage setup.
 *
 * The rest of the app only depends on the returned `url`.
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

    const ext = path.extname(file.name).slice(0, 10);
    const safeExt = /^\.[a-z0-9]+$/i.test(ext) ? ext : '.bin';
    const filename = `${randomUUID()}${safeExt}`;

    // Production: store in Vercel Blob (auth via OIDC store id or static token).
    if (BLOB_ENABLED) {
      const { put } = await import('@vercel/blob');
      const blob = await put(`resumes/${filename}`, file, {
        access: 'public',
        contentType: file.type || undefined,
        addRandomSuffix: false,
      });
      return NextResponse.json({ url: blob.url }, { status: 201 });
    }

    // Local development fallback: write to /public/uploads.
    const { writeFile, mkdir } = await import('node:fs/promises');
    const buffer = Buffer.from(await file.arrayBuffer());
    const dir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);
    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Upload failed. Check that a Vercel Blob store is connected.' },
      { status: 500 },
    );
  }
}
