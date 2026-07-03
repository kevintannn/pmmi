/**
 * Convert all JP/PNG images in /public/images to optimized WebP.
 * - Caps width at 2400px (downscale only — never enlarges).
 * - WebP quality 80 (visually near-lossless for photos).
 * - Removes the original file after a successful conversion.
 *
 * Run with: `npm run images:webp`
 */
import { readdir, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const dir = path.join(process.cwd(), 'public', 'images');
const MAX_WIDTH = 2400;
const QUALITY = 80;

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png)$/i.test(f));
if (files.length === 0) {
  console.log('No .jpg/.png images to convert in public/images.');
  process.exit(0);
}

let before = 0;
let after = 0;

for (const file of files) {
  const input = path.join(dir, file);
  const output = path.join(dir, file.replace(/\.(jpe?g|png)$/i, '.webp'));
  const srcSize = (await stat(input)).size;

  await sharp(input)
    .rotate() // respect EXIF orientation
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(output);

  const outSize = (await stat(output)).size;
  before += srcSize;
  after += outSize;

  // Remove the original (skip if the source was already a .webp of same name).
  if (path.resolve(input) !== path.resolve(output)) await unlink(input);

  const pct = Math.round((1 - outSize / srcSize) * 100);
  console.log(`✓ ${file} → ${path.basename(output)}  ${kb(srcSize)} → ${kb(outSize)}  (-${pct}%)`);
}

console.log(
  `\nDone. ${files.length} images: ${kb(before)} → ${kb(after)} (saved ${(
    (1 - after / before) *
    100
  ).toFixed(0)}%).`,
);
