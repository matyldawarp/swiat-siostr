// Makes the coloring pages the game uses (docs/assets/coloring/<id>.png) from the originals
// as given (assets/coloring/<id>.png), with things like a printed title or a website
// address taken out.
//
// STRIP lists boxes (x, y, w, h in the original's pixels) around what to take out. Only
// lines lying wholly inside the boxes go: a line that also runs outside them (a tail
// reaching under the title) stays whole, so a box can be drawn with room to spare.
// Pages without boxes are copied as they are.
// No dependencies: PNG files are read and written by hand with node:zlib.
//
// Usage: node tools/clean-coloring.mjs

import { deflateSync, inflateSync } from 'node:zlib';
import { readdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const IN_DIR = fileURLToPath(new URL('../assets/coloring/', import.meta.url));
const OUT_DIR = fileURLToPath(new URL('../docs/assets/coloring/', import.meta.url));

const STRIP = {
    'strus-pedziwiatr': [[220, 20, 500, 90], [550, 910, 170, 20]],
    'looney-tunes': [[555, 910, 165, 20]],
    'baby-kojot': [[0, 0, 200, 50]],
    'domek-strusia': [[0, 900, 160, 30]],
    wednesday: [[270, 880, 130, 40]]
};

// A pixel darker than this belongs to a line (soft edges included, so they go too).
const LINE = 250;

// Paper left around the drawing on every side, as a share of the page's height: 0.7 cm
// on the girls' iPad (the page is 760 CSS px tall there, at 132 CSS px per inch).
const MARGIN = 0.7 / ((760 / 132) * 2.54);

// --- PNG ------------------------------------------------------------------------------

function paeth(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

// 8-bit, not interlaced: gray, RGB, palette, gray + alpha or RGBA. Returns RGB on white.
function decodePng(file) {
    const buf = readFileSync(file);
    let pos = 8;
    let header = null;
    let palette = null;
    const idat = [];
    while (pos < buf.length) {
        const len = buf.readUInt32BE(pos);
        const type = buf.toString('ascii', pos + 4, pos + 8);
        const data = buf.subarray(pos + 8, pos + 8 + len);
        if (type === 'IHDR') {
            header = { width: data.readUInt32BE(0), height: data.readUInt32BE(4), depth: data[8], color: data[9], interlace: data[12] };
        } else if (type === 'PLTE') {
            palette = data;
        } else if (type === 'IDAT') {
            idat.push(data);
        }
        pos += len + 12;
    }
    const { width, height, depth, color, interlace } = header;
    const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[color];
    if (depth !== 8 || interlace !== 0 || !channels) {
        throw new Error(`${file}: only 8-bit, non-interlaced PNG files are supported`);
    }
    const raw = inflateSync(Buffer.concat(idat));
    const stride = width * channels;
    const px = Buffer.alloc(height * stride);
    for (let y = 0; y < height; y++) {
        const filter = raw[y * (stride + 1)];
        const row = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
        for (let i = 0; i < stride; i++) {
            const a = i >= channels ? px[y * stride + i - channels] : 0;
            const b = y > 0 ? px[(y - 1) * stride + i] : 0;
            const c = i >= channels && y > 0 ? px[(y - 1) * stride + i - channels] : 0;
            const pred = [0, a, b, (a + b) >> 1, paeth(a, b, c)][filter];
            px[y * stride + i] = (row[i] + pred) & 0xff;
        }
    }
    const rgb = Buffer.alloc(width * height * 3);
    for (let k = 0; k < width * height; k++) {
        const s = px.subarray(k * channels, (k + 1) * channels);
        let rgba;
        if (color === 0) {
            rgba = [s[0], s[0], s[0], 255];
        } else if (color === 2) {
            rgba = [s[0], s[1], s[2], 255];
        } else if (color === 3) {
            rgba = [palette[s[0] * 3], palette[s[0] * 3 + 1], palette[s[0] * 3 + 2], 255];
        } else if (color === 4) {
            rgba = [s[0], s[0], s[0], s[1]];
        } else {
            rgba = [s[0], s[1], s[2], s[3]];
        }
        for (let ch = 0; ch < 3; ch++) {
            rgb[k * 3 + ch] = Math.round((rgba[ch] * rgba[3] + 255 * (255 - rgba[3])) / 255);
        }
    }
    return { width, height, rgb };
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

// Gray (the game uses only how dark a pixel is); paper lighter than a line becomes pure
// white, which drops the specks a JPG leaves. Each row gets the filter that leaves the
// smallest numbers, to keep the file small.
function encodePng({ width, height, rgb }) {
    const gray = Buffer.alloc(width * height);
    for (let k = 0; k < gray.length; k++) {
        const light = Math.round((rgb[k * 3] + rgb[k * 3 + 1] + rgb[k * 3 + 2]) / 3);
        gray[k] = light < LINE ? light : 255;
    }
    const stride = width;
    const raw = Buffer.alloc(height * (stride + 1));
    const row = Buffer.alloc(stride);
    for (let y = 0; y < height; y++) {
        let best = Infinity;
        for (let filter = 0; filter < 5; filter++) {
            let sum = 0;
            for (let i = 0; i < stride; i++) {
                const a = i >= 1 ? gray[y * stride + i - 1] : 0;
                const b = y > 0 ? gray[(y - 1) * stride + i] : 0;
                const c = i >= 1 && y > 0 ? gray[(y - 1) * stride + i - 1] : 0;
                const pred = [0, a, b, (a + b) >> 1, paeth(a, b, c)][filter];
                row[i] = (gray[y * stride + i] - pred) & 0xff;
                sum += row[i] < 128 ? row[i] : 256 - row[i];
            }
            if (sum < best) {
                best = sum;
                raw[y * (stride + 1)] = filter;
                row.copy(raw, y * (stride + 1) + 1);
            }
        }
    }
    const header = Buffer.alloc(13);
    header.writeUInt32BE(width, 0);
    header.writeUInt32BE(height, 4);
    header[8] = 8; // bit depth
    header[9] = 0; // gray
    return Buffer.concat([
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        chunk('IHDR', header),
        chunk('IDAT', deflateSync(raw, { level: 9 })),
        chunk('IEND', Buffer.alloc(0))
    ]);
}

// --- Cleaning -------------------------------------------------------------------------

// Whites out every line (8-connected dark pixels) lying wholly inside the boxes.
// Returns how many lines went.
function strip({ width, height, rgb }, boxes) {
    const inBox = (x, y) => boxes.some(([bx, by, bw, bh]) => x >= bx && x < bx + bw && y >= by && y < by + bh);
    const dark = (k) => rgb[k * 3] + rgb[k * 3 + 1] + rgb[k * 3 + 2] < LINE * 3;
    const seen = new Uint8Array(width * height);
    let removed = 0;
    for (const [bx, by, bw, bh] of boxes) {
        for (let y = Math.max(0, by); y < Math.min(height, by + bh); y++) {
            for (let x = Math.max(0, bx); x < Math.min(width, bx + bw); x++) {
                const start = y * width + x;
                if (seen[start] || !dark(start)) {
                    continue;
                }
                const line = [start];
                seen[start] = 1;
                let inside = true;
                for (let i = 0; i < line.length; i++) {
                    const k = line[i];
                    const px = k % width;
                    const py = (k - px) / width;
                    inside = inside && inBox(px, py);
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            const nx = px + dx;
                            const ny = py + dy;
                            const n = ny * width + nx;
                            if (nx >= 0 && ny >= 0 && nx < width && ny < height && !seen[n] && dark(n)) {
                                seen[n] = 1;
                                line.push(n);
                            }
                        }
                    }
                }
                if (inside) {
                    line.forEach((k) => rgb.fill(255, k * 3, k * 3 + 3));
                    removed++;
                }
            }
        }
    }
    return removed;
}

// Adds paper where the drawing comes closer than MARGIN to an edge; the drawing itself
// keeps its size. Returns the padded image.
function pad({ width, height, rgb }) {
    let x1 = width;
    let y1 = height;
    let x2 = -1;
    let y2 = -1;
    for (let k = 0; k < width * height; k++) {
        if (rgb[k * 3] + rgb[k * 3 + 1] + rgb[k * 3 + 2] < LINE * 3) {
            const x = k % width;
            const y = (k - x) / width;
            x1 = Math.min(x1, x);
            x2 = Math.max(x2, x);
            y1 = Math.min(y1, y);
            y2 = Math.max(y2, y);
        }
    }
    // The margin grows with the page, so add paper until it no longer needs more.
    let add = { left: 0, top: 0, right: 0, bottom: 0 };
    for (;;) {
        const m = Math.ceil(MARGIN * (height + add.top + add.bottom));
        const next = {
            left: Math.max(0, m - x1),
            top: Math.max(0, m - y1),
            right: Math.max(0, m - (width - 1 - x2)),
            bottom: Math.max(0, m - (height - 1 - y2))
        };
        if (next.top + next.bottom === add.top + add.bottom) {
            add = next;
            break;
        }
        add = next;
    }
    const w = width + add.left + add.right;
    const h = height + add.top + add.bottom;
    const out = Buffer.alloc(w * h * 3, 255);
    for (let y = 0; y < height; y++) {
        rgb.copy(out, ((y + add.top) * w + add.left) * 3, y * width * 3, (y + 1) * width * 3);
    }
    return { width: w, height: h, rgb: out, add };
}

for (const name of readdirSync(IN_DIR).filter((f) => f.endsWith('.png'))) {
    const id = name.slice(0, -4);
    const image = decodePng(join(IN_DIR, name));
    const removed = strip(image, STRIP[id] || []);
    const padded = pad(image);
    writeFileSync(join(OUT_DIR, name), encodePng(padded));
    const { left, top, right, bottom } = padded.add;
    console.log(`wrote docs/assets/coloring/${name} (${removed} lines taken out, paper added: left ${left}, top ${top}, right ${right}, bottom ${bottom})`);
}
