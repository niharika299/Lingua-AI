const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = c32Table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

const c32Table = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  c32Table[n] = c;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'binary');
  const crcBuf = Buffer.alloc(4);
  const typeAndData = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crcBuf]);
}

function createPng(width, height, isMaskable = false) {
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = makeChunk('IHDR', ihdrData);

  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  const padding = isMaskable ? Math.floor(width * 0.15) : 0;
  const cx = width / 2;
  const cy = height / 2;
  const radius = (width / 2) - padding;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0
    for (let x = 0; x < width; x++) {
      const idx = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= radius * 0.4) {
        // Center white chat icon area
        rawData[idx] = 255;
        rawData[idx + 1] = 255;
        rawData[idx + 2] = 255;
        rawData[idx + 3] = 255;
      } else if (dist <= radius * 0.6) {
        // Inner Indigo
        rawData[idx] = 79;
        rawData[idx + 1] = 70;
        rawData[idx + 2] = 229;
        rawData[idx + 3] = 255;
      } else if (dist <= radius) {
        // Purple gradient outer
        rawData[idx] = 124;
        rawData[idx + 1] = 77;
        rawData[idx + 2] = 186;
        rawData[idx + 3] = 255;
      } else {
        if (isMaskable) {
          // Full bleed background for maskable
          rawData[idx] = 79;
          rawData[idx + 1] = 70;
          rawData[idx + 2] = 229;
          rawData[idx + 3] = 255;
        } else {
          // Outer background
          rawData[idx] = 36;
          rawData[idx + 1] = 23;
          rawData[idx + 2] = 52;
          rawData[idx + 3] = 255;
        }
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdr, idat, iend]);
}

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, true));

console.log('Successfully generated PWA PNG icons!');
