// Generates the app icons (assets/icons/*.png): Mordka and Mysia side by side with a
// heart above them, as pixel art on a pastel background.
// No dependencies: PNG files are encoded by hand with node:zlib.
//
// Usage: node tools/make-icons.mjs

import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = fileURLToPath(new URL('../assets/icons/', import.meta.url));

// Same art and colours as the hamsters in src/gfx/hamster.js and src/data/characters.js.
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
const SHARED = { O: 0x6b4a5e, E: 0x3d2b3d, W: 0xffffff };
const MORDKA = { ...SHARED, B: 0xf2b880, L: 0xfff1e0, P: 0xf7a8b8 };
const MYSIA = { ...SHARED, B: 0xc9c3d6, L: 0xfbf8ff, P: 0xf7a8c4 };

const HEART = [
    '.PP.PP.',
    'PPPPPPP',
    'PPPPPPP',
    '.PPPPP.',
    '..PPP..',
    '...P...'
];
const HEART_COLORS = { P: 0xf59bbd };

const BACKGROUND = 0xffe1ec;

// 48x48 grid. Everything stays inside the central circle (radius ~19) that Android may
// keep when it crops the icon to a circle or rounded square (maskable icon).
const GRID = 48;
const LAYERS = [
    { rows: HAMSTER, colors: MORDKA, x: 7, y: 16 },
    { rows: HAMSTER, colors: MYSIA, x: 25, y: 16 },
    { rows: HEART, colors: HEART_COLORS, x: 21, y: 9 }
];

function pixelColor(gx, gy) {
    for (const { rows, colors, x, y } of LAYERS) {
        const row = rows[gy - y];
        const ch = row && row[gx - x];
        if (ch && colors[ch] !== undefined) {
            return colors[ch];
        }
    }
    return BACKGROUND;
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
// 192 is exactly 4x the grid; at 512 a few rows/columns are one pixel wider, invisible
// at that size.
for (const size of [192, 512]) {
    writeFileSync(join(OUT_DIR, `icon-${size}.png`), encodePng(size));
    console.log(`wrote assets/icons/icon-${size}.png`);
}
