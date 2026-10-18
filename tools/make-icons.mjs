// Generates the app icons (assets/icons/*.png): Mordka the hamster as pixel art on a
// pastel background, scaled up by whole numbers so every pixel stays sharp.
// No dependencies: PNG files are encoded by hand with node:zlib.
//
// Usage: node tools/make-icons.mjs

import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = fileURLToPath(new URL('../assets/icons/', import.meta.url));

// Same art and colours as Mordka in src/gfx/hamster.js and src/data/characters.js.
const HAMSTER = [
    '................',
    '..OO........OO..',
    '.OPBO......OBPO.',
    '.OPBBOOOOOOBBPO.',
    '.OBBBBBBBBBBBBO.',
    'OBBBBBBBBBBBBBBO',
    'OBBWEBBBBBBWEBBO',
    'OBBEEBBBBBBEEBBO',
    'OBPPLLLPPLLLPPBO',
    'OBBLLLLOOLLLLBBO',
    'OBLLLLLLLLLLLLBO',
    'OBLLLLLLLLLLLLBO',
    'OBBLLLLLLLLLLBBO',
    '.OBBPPLLLLPPBBO.',
    '..OOBBBBBBBBOO..',
    '....OOOOOOOO....'
];
const COLORS = {
    O: 0x6b4a5e,
    B: 0xf2b880,
    L: 0xfff1e0,
    P: 0xf7a8b8,
    E: 0x3d2b3d,
    W: 0xffffff
};
const BACKGROUND = 0xffe1ec;

// The hamster sits in the middle half of a 32x32 grid, inside the "safe zone" that
// Android may crop to a circle or rounded square (maskable icon).
const GRID = 32;
const OFFSET = 8;

function pixelColor(gx, gy) {
    const row = HAMSTER[gy - OFFSET];
    const ch = row && row[gx - OFFSET];
    return ch && COLORS[ch] !== undefined ? COLORS[ch] : BACKGROUND;
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    return c >>> 0;
});

function crc32(buf) {
    let c = 0xffffffff;
    for (const byte of buf) {
        c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([len, body, crc]);
}

function encodePng(size) {
    const scale = size / GRID;
    const raw = Buffer.alloc(size * (size * 3 + 1));
    for (let y = 0; y < size; y++) {
        const rowStart = y * (size * 3 + 1);
        raw[rowStart] = 0; // no filter
        for (let x = 0; x < size; x++) {
            const color = pixelColor(Math.floor(x / scale), Math.floor(y / scale));
            const i = rowStart + 1 + x * 3;
            raw[i] = (color >> 16) & 0xff;
            raw[i + 1] = (color >> 8) & 0xff;
            raw[i + 2] = color & 0xff;
        }
    }

    const header = Buffer.alloc(13);
    header.writeUInt32BE(size, 0);
    header.writeUInt32BE(size, 4);
    header[8] = 8; // bit depth
    header[9] = 2; // RGB
    return Buffer.concat([
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        chunk('IHDR', header),
        chunk('IDAT', deflateSync(raw)),
        chunk('IEND', Buffer.alloc(0))
    ]);
}

mkdirSync(OUT_DIR, { recursive: true });
// Sizes are whole multiples of the 32px grid: 192 = 6x, 512 = 16x.
for (const size of [192, 512]) {
    writeFileSync(join(OUT_DIR, `icon-${size}.png`), encodePng(size));
    console.log(`wrote assets/icons/icon-${size}.png`);
}
