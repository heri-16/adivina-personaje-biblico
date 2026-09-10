/**
 * Genera los PNG del PWA sin dependencias externas.
 * Dibuja un icono "manuscrito iluminado": fondo pergamino profundo,
 * marco dorado fino y un rombo dorado central.
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../public/icons');
mkdirSync(outDir, { recursive: true });

const BG = [26, 22, 20];
const GOLD = [201, 162, 39];

function lerp(a, b, t) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t));
}

function makePixels(size, { pad }) {
  const buf = Buffer.alloc(size * size * 4);
  const c = (size - 1) / 2;
  const frameOuter = pad;
  const frameInner = pad + Math.max(2, Math.round(size * 0.018));
  const rhombusR = size * 0.30;
  const rhombusInnerR = size * 0.135;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      let col = BG;
      let alpha = 255;

      const dx = Math.abs(x - c);
      const dy = Math.abs(y - c);
      const manhattan = dx + dy;

      // Marco dorado fino.
      const nearEdge =
        x >= frameOuter &&
        y >= frameOuter &&
        x < size - frameOuter &&
        y < size - frameOuter;
      const insideInner =
        x >= frameInner &&
        y >= frameInner &&
        x < size - frameInner &&
        y < size - frameInner;
      if (nearEdge && !insideInner) {
        col = GOLD;
      }

      // Rombo exterior (contorno) e interior (relleno).
      if (Math.abs(manhattan - rhombusR) < size * 0.02) {
        col = GOLD;
      } else if (manhattan < rhombusInnerR) {
        col = BG;
      } else if (manhattan < rhombusR * 0.62 && manhattan > rhombusInnerR) {
        col = lerp(GOLD, BG, 0.06);
      }

      buf[i] = col[0];
      buf[i + 1] = col[1];
      buf[i + 2] = col[2];
      buf[i + 3] = alpha;
    }
  }
  return buf;
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePng(size, pixels) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const targets = [
  { name: 'icon-192.png', size: 192, pad: Math.round(192 * 0.06) },
  { name: 'icon-512.png', size: 512, pad: Math.round(512 * 0.06) },
  { name: 'icon-512-maskable.png', size: 512, pad: Math.round(512 * 0.14) },
];

for (const t of targets) {
  const px = makePixels(t.size, { pad: t.pad });
  writeFileSync(resolve(outDir, t.name), encodePng(t.size, px));
  console.log('escrito', t.name);
}
