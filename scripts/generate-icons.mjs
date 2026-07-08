/**
 * Generator for PWA icons, favicon and the Open Graph image.
 *
 * If /public/logo.jpg exists, the icons are built from it (scaled onto a
 * matching background). Otherwise it falls back to drawing the PMMI monogram.
 *
 * Run with: `npm run icons` (also runs automatically before build).
 * TIP: for crisp icons, make /public/logo.jpg at least 512×512.
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import jpeg from 'jpeg-js';

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

// ---- Logo image (optional) -------------------------------------------------
function loadLogo() {
  const p = path.join(process.cwd(), 'public', 'logo.jpg');
  if (!existsSync(p)) return null;
  try {
    const raw = jpeg.decode(readFileSync(p), { useTArray: true, formatAsRGBA: true });
    return { w: raw.width, h: raw.height, buf: Buffer.from(raw.data) };
  } catch {
    return null;
  }
}

/** Bilinear-sample an image at fractional source coordinates → [r, g, b]. */
function sampleRGB(img, sx, sy) {
  const x0 = Math.floor(sx);
  const y0 = Math.floor(sy);
  const x1 = Math.min(x0 + 1, img.w - 1);
  const y1 = Math.min(y0 + 1, img.h - 1);
  const fx = sx - x0;
  const fy = sy - y0;
  const at = (xx, yy) => {
    const i = (yy * img.w + xx) * 4;
    return [img.buf[i], img.buf[i + 1], img.buf[i + 2]];
  };
  const a = at(x0, y0);
  const b = at(x1, y0);
  const c = at(x0, y1);
  const d = at(x1, y1);
  const lerp = (m, n, f) => m + (n - m) * f;
  return [0, 1, 2].map((k) => lerp(lerp(a[k], b[k], fx), lerp(c[k], d[k], fx), fy));
}

/** Draw (scaled) an image into canvas at [x0,y0] with size tw×th. */
function drawImage(c, img, x0, y0, tw, th) {
  for (let y = 0; y < th; y++) {
    for (let x = 0; x < tw; x++) {
      const rgb = sampleRGB(img, (x / tw) * img.w, (y / th) * img.h);
      blend(c, Math.round(x0) + x, Math.round(y0) + y, rgb, 1);
    }
  }
}

// ---- Monogram fallback -----------------------------------------------------
function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy || 1;
  let t = ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function monogram(c, x0, y0, size, color) {
  const V = [
    [4, 18],
    [9, 6],
    [12, 13],
    [15, 6],
    [20, 18],
  ];
  const pts = V.map((p) => [x0 + (p[0] / 24) * size, y0 + (p[1] / 24) * size]);
  const half = (size * 0.09) / 2;
  const pad = Math.ceil(half) + 2;
  const minX = Math.max(0, Math.floor(Math.min(...pts.map((p) => p[0])) - pad));
  const maxX = Math.min(c.w, Math.ceil(Math.max(...pts.map((p) => p[0])) + pad));
  const minY = Math.max(0, Math.floor(Math.min(...pts.map((p) => p[1])) - pad));
  const maxY = Math.min(c.h, Math.ceil(Math.max(...pts.map((p) => p[1])) + pad));
  for (let y = minY; y < maxY; y++) {
    for (let x = minX; x < maxX; x++) {
      let dmin = Infinity;
      for (let i = 0; i < pts.length - 1; i++) {
        dmin = Math.min(
          dmin,
          distToSegment(x + 0.5, y + 0.5, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]),
        );
      }
      blend(c, x, y, color, half + 0.5 - dmin);
    }
  }
}

// ---- Outputs ---------------------------------------------------------------
const outDir = path.join(process.cwd(), 'public');
const iconsDir = path.join(outDir, 'icons');
mkdirSync(iconsDir, { recursive: true });

const logo = loadLogo();
// Background = logo's top-left pixel (so any padding blends seamlessly).
const bg = logo ? [logo.buf[0], logo.buf[1], logo.buf[2]] : NAVY;

function icon(size, { maskable = false } = {}) {
  const c = canvas(size, size, bg);
  if (logo) {
    // The logo already carries its own margin; add a little more for maskable
    // so it stays within the safe zone.
    const pad = maskable ? size * 0.16 : size * 0.06;
    drawImage(c, logo, pad, pad, size - pad * 2, size - pad * 2);
  } else {
    const pad = maskable ? size * 0.22 : size * 0.16;
    monogram(c, pad, pad, size - pad * 2, WHITE);
  }
  return encodePNG(size, size, c.buf);
}

writeFileSync(path.join(iconsDir, 'icon-192.png'), icon(192));
writeFileSync(path.join(iconsDir, 'icon-512.png'), icon(512));
writeFileSync(path.join(iconsDir, 'maskable-512.png'), icon(512, { maskable: true }));
writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), icon(180));

// favicon.ico with multiple sizes: 32×32 (browser tabs) and 48×48 (Google
// Search requires the favicon to be a multiple of 48px to show in results).
{
  const sizes = [32, 48];
  const pngs = sizes.map((s) => icon(s));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(sizes.length, 4);

  const entries = [];
  let offset = 6 + 16 * sizes.length;
  for (let i = 0; i < sizes.length; i++) {
    const e = Buffer.alloc(16);
    e[0] = sizes[i] === 256 ? 0 : sizes[i]; // width
    e[1] = sizes[i] === 256 ? 0 : sizes[i]; // height
    e.writeUInt16LE(1, 4); // color planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(pngs[i].length, 8); // data size
    e.writeUInt32LE(offset, 12); // data offset
    entries.push(e);
    offset += pngs[i].length;
  }
  writeFileSync(
    path.join(outDir, 'favicon.ico'),
    Buffer.concat([header, ...entries, ...pngs]),
  );
  // Standalone 48×48 PNG favicon, referenced from metadata for Google.
  writeFileSync(path.join(iconsDir, 'favicon-48.png'), icon(48));
}

// Open Graph image 1200×630
{
  const w = 1200;
  const h = 630;
  const c = canvas(w, h, logo ? bg : NAVY);
  if (logo) {
    const s = 300;
    drawImage(c, logo, (w - s) / 2, (h - s) / 2 - 20, s, s);
  } else {
    monogram(c, w / 2 - 130, 150, 260, WHITE);
    const barY = 470;
    for (let x = w / 2 - 90; x < w / 2 + 90; x++)
      for (let y = barY - 5; y < barY + 5; y++) blend(c, x, y, GOLD, 1);
  }
  writeFileSync(path.join(outDir, 'og.png'), encodePNG(w, h, c.buf));
}

console.log(
  logo
    ? '✓ Generated icons, favicon and og.png from public/logo.jpg'
    : '✓ Generated icons, favicon and og.png (monogram — no public/logo.jpg found)',
);
