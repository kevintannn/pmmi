/**
 * Dependency-free generator for PWA icons, favicon and the Open Graph image.
 * Draws the PMMI monogram (a steel "M" chevron) in white on a navy field.
 *
 * Run with: `npm run icons`  (also runs automatically before build)
 * Replace the generated files in /public with real brand assets anytime.
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const NAVY = [22, 48, 92];
const GOLD = [200, 162, 74];
const WHITE = [255, 255, 255];

// ---- PNG encoding ----------------------------------------------------------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---- Simple raster canvas --------------------------------------------------
function canvas(w, h, bg) {
  const buf = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    buf[i * 4] = bg[0];
    buf[i * 4 + 1] = bg[1];
    buf[i * 4 + 2] = bg[2];
    buf[i * 4 + 3] = 255;
  }
  return { w, h, buf };
}

function blend(c, x, y, color, alpha) {
  if (x < 0 || y < 0 || x >= c.w || y >= c.h || alpha <= 0) return;
  const i = (y * c.w + x) * 4;
  const a = Math.min(1, alpha);
  c.buf[i] = Math.round(c.buf[i] * (1 - a) + color[0] * a);
  c.buf[i + 1] = Math.round(c.buf[i + 1] * (1 - a) + color[1] * a);
  c.buf[i + 2] = Math.round(c.buf[i + 2] * (1 - a) + color[2] * a);
}

function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy || 1;
  let t = ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function drawPolyline(c, pts, width, color) {
  const half = width / 2;
  const pad = Math.ceil(half) + 2;
  const minX = Math.max(0, Math.floor(Math.min(...pts.map((p) => p[0])) - pad));
  const maxX = Math.min(c.w, Math.ceil(Math.max(...pts.map((p) => p[0])) + pad));
  const minY = Math.max(0, Math.floor(Math.min(...pts.map((p) => p[1])) - pad));
  const maxY = Math.min(c.h, Math.ceil(Math.max(...pts.map((p) => p[1])) + pad));
  for (let y = minY; y < maxY; y++) {
    for (let x = minX; x < maxX; x++) {
      let d = Infinity;
      for (let i = 0; i < pts.length - 1; i++) {
        d = Math.min(
          d,
          distToSegment(x + 0.5, y + 0.5, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]),
        );
      }
      blend(c, x, y, color, half + 0.5 - d);
    }
  }
}

// Monogram in a 24x24 viewBox mapped into the given box.
function monogram(c, x0, y0, size, color) {
  const V = [
    [4, 18],
    [9, 6],
    [12, 13],
    [15, 6],
    [20, 18],
  ];
  const map = (p) => [x0 + (p[0] / 24) * size, y0 + (p[1] / 24) * size];
  drawPolyline(c, V.map(map), size * 0.09, color);
}

// ---- Outputs ---------------------------------------------------------------
const outDir = path.join(process.cwd(), 'public');
const iconsDir = path.join(outDir, 'icons');
mkdirSync(iconsDir, { recursive: true });

function icon(size, { maskable = false } = {}) {
  const c = canvas(size, size, NAVY);
  const pad = maskable ? size * 0.22 : size * 0.16;
  monogram(c, pad, pad, size - pad * 2, WHITE);
  return encodePNG(size, size, c.buf);
}

writeFileSync(path.join(iconsDir, 'icon-192.png'), icon(192));
writeFileSync(path.join(iconsDir, 'icon-512.png'), icon(512));
writeFileSync(path.join(iconsDir, 'maskable-512.png'), icon(512, { maskable: true }));
writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), icon(180));

// favicon.ico wrapping a 32x32 PNG
const faviconPng = icon(32);
const dir = Buffer.alloc(6);
dir.writeUInt16LE(0, 0);
dir.writeUInt16LE(1, 2);
dir.writeUInt16LE(1, 4);
const entry = Buffer.alloc(16);
entry[0] = 32;
entry[1] = 32;
entry.writeUInt16LE(1, 4);
entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(faviconPng.length, 8);
entry.writeUInt32LE(22, 12);
writeFileSync(path.join(outDir, 'favicon.ico'), Buffer.concat([dir, entry, faviconPng]));

// Open Graph image 1200x630
{
  const w = 1200;
  const h = 630;
  const c = canvas(w, h, NAVY);
  monogram(c, w / 2 - 130, 150, 260, WHITE);
  drawPolyline(c, [[w / 2 - 90, 470], [w / 2 + 90, 470]], 10, GOLD);
  writeFileSync(path.join(outDir, 'og.png'), encodePNG(w, h, c.buf));
}

console.log('✓ Generated icons, favicon and og.png in /public');
