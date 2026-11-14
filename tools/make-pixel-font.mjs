// Turns the Leggie bitmap font (assets/fonts/leggie/*.bdf, by Wiktor Kerr, CC BY 4.0) into
// what the game loads: docs/assets/fonts/leggie-<size>[b].png, every glyph a white cell on
// transparent pixels in a grid, and docs/assets/fonts/leggie.json describing the cells.
// Only the letters in CHARS are kept; a bold font without some letter gets the regular one.
// The game builds coloured, outlined fonts from these while it runs (docs/src/ui/pixelFont.js).
//
// Usage: node tools/make-pixel-font.mjs

import { deflateSync } from 'node:zlib';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'assets', 'fonts', 'leggie');
const OUT = join(ROOT, 'docs', 'assets', 'fonts');
const SIZES = [12, 18, 24];
const COLUMNS = 32;

// ASCII, Latin-1 and Latin Extended-A (Polish among them) and some typographic marks.
const CODES = [
    ...range(32, 126),
    ...range(160, 383),
    0x2013, 0x2014, 0x2018, 0x2019, 0x201a, 0x201c, 0x201d, 0x201e, 0x2022, 0x2026
];

function range(from, to) {
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

// Glyphs of a BDF file: { ascent, cellW, cellH, glyphs: Map(code -> { w, h, x, y, rows }) }.
function readBdf(file) {
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    const font = { glyphs: new Map() };
    let glyph = null;
    let bitmap = false;
    for (const line of lines) {
        const [word, ...rest] = line.trim().split(/\s+/);
        if (word === 'FONTBOUNDINGBOX') {
            [font.cellW, font.cellH] = rest.map(Number);
        } else if (word === 'FONT_ASCENT') {
            font.ascent = Number(rest[0]);
        } else if (word === 'STARTCHAR') {
            glyph = { rows: [] };
        } else if (word === 'ENCODING') {
            glyph.code = Number(rest[0]);
        } else if (word === 'BBX') {
            [glyph.w, glyph.h, glyph.x, glyph.y] = rest.map(Number);
        } else if (word === 'BITMAP') {
            bitmap = true;
        } else if (word === 'ENDCHAR') {
            font.glyphs.set(glyph.code, glyph);
            glyph = null;
            bitmap = false;
        } else if (bitmap && word) {
            glyph.rows.push(word);
        }
    }
    return font;
}

// Whether a glyph's pixel (gx, gy), counted from the top-left of its own box, is ink.
function ink(glyph, gx, gy) {
    const row = glyph.rows[gy];
    const nibble = parseInt(row[Math.floor(gx / 4)] || '0', 16);
    return (nibble >> (3 - (gx % 4))) & 1;
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

// A grey-and-alpha PNG of width x height where alpha(x, y) is 255 or 0; ink is white.
function encodePng(width, height, alpha) {
    const raw = Buffer.alloc(height * (width * 2 + 1));
    for (let y = 0; y < height; y++) {
        const start = y * (width * 2 + 1);
        for (let x = 0; x < width; x++) {
            raw[start + 1 + x * 2] = 255;
            raw[start + 2 + x * 2] = alpha(x, y);
        }
    }
    const header = Buffer.alloc(13);
    header.writeUInt32BE(width, 0);
    header.writeUInt32BE(height, 4);
    header[8] = 8;
    header[9] = 4; // grey + alpha
    return Buffer.concat([
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        chunk('IHDR', header),
        chunk('IDAT', deflateSync(raw)),
        chunk('IEND', Buffer.alloc(0))
    ]);
}

mkdirSync(OUT, { recursive: true });
const description = { columns: COLUMNS, chars: String.fromCodePoint(...CODES), fonts: {} };

for (const size of SIZES) {
    const regular = readBdf(join(SRC, `leggie-${size}.bdf`));
    for (const bold of [false, true]) {
        const font = bold ? readBdf(join(SRC, `leggie-${size}b.bdf`)) : regular;
        const { cellW, cellH, ascent } = regular;
        const rows = Math.ceil(CODES.length / COLUMNS);
        const width = COLUMNS * cellW;
        const height = rows * cellH;
        const pixels = new Uint8Array(width * height);
        CODES.forEach((code, i) => {
            const glyph = font.glyphs.get(code) || regular.glyphs.get(code);
            if (!glyph) {
                console.warn(`leggie-${size}${bold ? 'b' : ''} has no U+${code.toString(16)}`);
                return;
            }
            const cx = (i % COLUMNS) * cellW;
            const cy = Math.floor(i / COLUMNS) * cellH;
            // The glyph's box sits on the baseline, `ascent` pixels below the cell's top.
            const top = ascent - (glyph.h + glyph.y);
            for (let gy = 0; gy < glyph.h; gy++) {
                for (let gx = 0; gx < glyph.w; gx++) {
                    const px = cx + glyph.x + gx;
                    const py = cy + top + gy;
                    if (ink(glyph, gx, gy) && px >= cx && px < cx + cellW && py >= cy && py < cy + cellH) {
                        pixels[py * width + px] = 255;
                    }
                }
            }
        });
        const name = `leggie-${size}${bold ? 'b' : ''}`;
        writeFileSync(join(OUT, `${name}.png`), encodePng(width, height, (x, y) => pixels[y * width + x]));
        description.fonts[name] = { size, bold, cellW, cellH, ascent, image: `assets/fonts/${name}.png` };
        console.log(`wrote docs/assets/fonts/${name}.png (${width}x${height})`);
    }
}
writeFileSync(join(OUT, 'leggie.json'), `${JSON.stringify(description, null, 2)}\n`);
console.log('wrote docs/assets/fonts/leggie.json');
