// Coloring pages: paints, splitting a page's line art into fillable areas and drawing the
// colored page.

import { PALETTE } from '../ui/pixel.js';

// Darker than this (0-255 gray) counts as line; the rest is paper that can be filled.
const LINE_THRESHOLD = 200;
// Gaps in the drawing up to about twice this many pixels wide count as closed, so paint
// doesn't leak out of a shape whose outline doesn't quite meet.
const GAP_CLOSE = 3;
// Every page's lines are thinned to their 1-pixel middle and then drawn this many pixels
// further out on each side, so all pages have lines of the same width, whatever the
// original drawing had: 0 gives 1-pixel lines, 1 gives 3-pixel lines.
const LINE_RADIUS = 0;
const STORAGE_KEY = 'swiat-siostr-coloring';

// Little repeatable hash of a pixel position, for sparkles that stay put.
const hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;

const RAINBOW = [0xf28aa5, 0xffc08a, 0xfff09a, 0x7fcf9a, 0x9fd0f5, 0xc3b3ea];

// Paints on the side panel, in two columns. A paint is a solid `color` or a `pattern`
// giving the color of each pixel (x, y) of the page. `id` is what gets saved.
export const PAINTS = [
    { id: 'pink', color: 0xf7a8c4 },
    { id: 'red', color: 0xf28aa5 },
    { id: 'orange', color: 0xffc08a },
    { id: 'yellow', color: 0xfff09a },
    { id: 'lime', color: 0xb8e6a0 },
    { id: 'green', color: 0x7fcf9a },
    { id: 'sky', color: 0x9fd0f5 },
    { id: 'blue', color: 0x8aa8e8 },
    { id: 'lavender', color: 0xc3b3ea },
    { id: 'brown', color: 0xc9a07a },
    { id: 'white', color: 0xffffff },
    { id: 'rainbow', pattern: (x, y) => RAINBOW[Math.floor((x + y) / 6) % RAINBOW.length] },
    { id: 'dots', pattern: (x, y) => ((x % 6 < 2 && y % 6 < 2) || ((x + 3) % 6 < 2 && (y + 3) % 6 < 2) ? 0xffffff : 0xf7a8c4) },
    { id: 'sparkle', pattern: (x, y) => (hash(x, y) % 23 === 0 ? 0xffffff : (hash(x, y) % 7 === 0 ? 0xfff7d6 : 0xf6d98b)) }
];

export function paintColor(paint, x, y) {
    return paint.pattern ? paint.pattern(x, y) : paint.color;
}

const paintById = (id) => PAINTS.find((p) => p.id === id) || null;

// 0xRRGGBB -> a pixel value for a Uint32Array view of ImageData (little-endian ABGR).
const toPixel = (color) => (0xff000000 | ((color & 0xff) << 16) | (color & 0xff00) | ((color >> 16) & 0xff)) >>> 0;

const analysed = new Map();

// Thins a mask of strokes (1 = ink) in place to their 1-pixel-wide middle, keeping every
// stroke connected (Zhang–Suen thinning). The result still stops 4-connected paint.
function thin(mask, width, height) {
    const at = (x, y) => (x < 0 || y < 0 || x >= width || y >= height ? 0 : mask[y * width + x]);
    const remove = [];
    let changed = true;
    while (changed) {
        changed = false;
        for (const pass of [0, 1]) {
            remove.length = 0;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    if (!mask[y * width + x]) {
                        continue;
                    }
                    // Neighbours clockwise from the top.
                    const n = [at(x, y - 1), at(x + 1, y - 1), at(x + 1, y), at(x + 1, y + 1),
                        at(x, y + 1), at(x - 1, y + 1), at(x - 1, y), at(x - 1, y - 1)];
                    const filled = n.reduce((a, b) => a + b, 0);
                    if (filled < 2 || filled > 6) {
                        continue;
                    }
                    let edges = 0;
                    for (let k = 0; k < 8; k++) {
                        if (!n[k] && n[(k + 1) % 8]) {
                            edges++;
                        }
                    }
                    if (edges !== 1) {
                        continue;
                    }
                    const [p2, , p4, , p6, , p8] = n;
                    const ok = pass === 0
                        ? !(p2 && p4 && p6) && !(p4 && p6 && p8)
                        : !(p2 && p4 && p8) && !(p2 && p6 && p8);
                    if (ok) {
                        remove.push(y * width + x);
                    }
                }
            }
            if (remove.length > 0) {
                changed = true;
                remove.forEach((i) => {
                    mask[i] = 0;
                });
            }
        }
    }
}

// A copy of a mask grown by `r` pixels in every direction (a round brush); r = 0 copies.
function widen(mask, width, height, r) {
    const out = new Uint8Array(mask.length);
    for (let i = 0; i < mask.length; i++) {
        if (!mask[i]) {
            continue;
        }
        const x = i % width;
        const y = Math.floor(i / width);
        for (let dy = -r; dy <= r; dy++) {
            for (let dx = -r; dx <= r; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (dx * dx + dy * dy <= r * r && nx >= 0 && ny >= 0 && nx < width && ny < height) {
                    out[ny * width + nx] = 1;
                }
            }
        }
    }
    return out;
}

// Splits a page's line art (a loaded texture) into areas of paper between lines.
// Returns { width, height, line, labels, areas } where labels[i] is the area of pixel i
// (-1 on a line) and areas[n] lists the pixel indexes of area n. Kept per page, so this
// runs once.
//
// Drawings often have small gaps where two strokes almost meet, which would let paint
// leak out. So areas are found with the strokes as drawn fattened by GAP_CLOSE pixels
// (gaps closed). Then the strokes are thinned and redrawn LINE_RADIUS wide, so every page
// has the same lines, and the paper left over (next to and under the old strokes) joins
// the nearest area.
export function analysePage(scene, page, textureKey) {
    if (analysed.has(page.id)) {
        return analysed.get(page.id);
    }
    const img = scene.textures.get(textureKey).getSourceImage();
    const width = img.width;
    const height = img.height;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const pixels = ctx.getImageData(0, 0, width, height).data;

    const count = width * height;
    const ink = new Uint8Array(count);
    for (let i = 0; i < count; i++) {
        ink[i] = pixels[i * 4] < LINE_THRESHOLD && pixels[i * 4 + 3] > 0 ? 1 : 0;
    }
    // Areas come from the strokes as drawn, fattened by GAP_CLOSE pixels in every direction
    // (a round brush) to close gaps. The page's edge counts as a line too.
    const fat = widen(ink, width, height, GAP_CLOSE);
    for (let i = 0; i < count; i++) {
        const x = i % width;
        const y = Math.floor(i / width);
        if (x < GAP_CLOSE || y < GAP_CLOSE || x >= width - GAP_CLOSE || y >= height - GAP_CLOSE) {
            fat[i] = 1;
        }
    }

    // What is drawn (and what stops paint) is the same width on every page: the middle of
    // each stroke, LINE_RADIUS wide. The rest of the stroke becomes paper of its areas.
    thin(ink, width, height);
    const line = widen(ink, width, height, LINE_RADIUS);

    const neighboursOf = (i) => {
        const x = i % width;
        return [x > 0 ? i - 1 : -1, x < width - 1 ? i + 1 : -1, i - width, i >= count - width ? -1 : i + width];
    };

    // Areas of the paper away from the (fattened) lines, as 4-connected patches.
    const labels = new Int32Array(count).fill(-1);
    let areaCount = 0;
    const stack = new Int32Array(count);
    for (let start = 0; start < count; start++) {
        if (fat[start] || labels[start] !== -1) {
            continue;
        }
        const id = areaCount++;
        let top = 0;
        stack[top++] = start;
        labels[start] = id;
        while (top > 0) {
            const i = stack[--top];
            for (const n of neighboursOf(i)) {
                if (n >= 0 && !fat[n] && labels[n] === -1) {
                    labels[n] = id;
                    stack[top++] = n;
                }
            }
        }
    }

    // The paper next to the lines joins the nearest area, growing out ring by ring.
    let ring = [];
    for (let i = 0; i < count; i++) {
        if (labels[i] !== -1) {
            ring.push(i);
        }
    }
    while (ring.length > 0) {
        const next = [];
        for (const i of ring) {
            for (const n of neighboursOf(i)) {
                if (n >= 0 && !line[n] && labels[n] === -1) {
                    labels[n] = labels[i];
                    next.push(n);
                }
            }
        }
        ring = next;
    }

    // Paper no area reached (a narrow space fully under the fattened strokes, closed in by
    // the thin lines) becomes areas of its own, so every bit of paper can be painted.
    for (let start = 0; start < count; start++) {
        if (line[start] || labels[start] !== -1) {
            continue;
        }
        const id = areaCount++;
        let top = 0;
        stack[top++] = start;
        labels[start] = id;
        while (top > 0) {
            const i = stack[--top];
            for (const n of neighboursOf(i)) {
                if (n >= 0 && !line[n] && labels[n] === -1) {
                    labels[n] = id;
                    stack[top++] = n;
                }
            }
        }
    }

    const members = Array.from({ length: areaCount }, () => []);
    for (let i = 0; i < count; i++) {
        if (labels[i] !== -1) {
            members[labels[i]].push(i);
        }
    }
    const areas = members.map((m) => Int32Array.from(m));

    const result = { width, height, line, labels, areas };
    analysed.set(page.id, result);
    return result;
}

// The page's pixels with the current colors: lines in the outline color, untouched paper
// white. `fills` maps area number -> paint id. Writes into a Uint32Array view of ImageData.
export function renderPage(info, fills, out) {
    const outline = toPixel(PALETTE.outline);
    const white = toPixel(0xffffff);
    for (let i = 0; i < out.length; i++) {
        out[i] = info.line[i] ? outline : white;
    }
    Object.entries(fills).forEach(([area, paintId]) => {
        paintArea(info, Number(area), paintById(paintId), out);
    });
}

// Colors the pixels `indexes` (all of an area by default) with a paint.
export function paintArea(info, area, paint, out, indexes = info.areas[area]) {
    if (!paint || !indexes) {
        return;
    }
    for (const i of indexes) {
        out[i] = toPixel(paintColor(paint, i % info.width, Math.floor(i / info.width)));
    }
}

// Pixels of an area in the order paint would flow from (x, y): nearest first. An area may
// hold a few pixels not connected to the rest (paper beside a line that joined it), so
// whatever the flow didn't reach comes last.
export function flowOrder(info, area, x, y) {
    const { width, labels } = info;
    const start = y * width + x;
    const seen = new Uint8Array(labels.length);
    const order = [];
    const queue = [start];
    seen[start] = 1;
    for (let q = 0; q < queue.length; q++) {
        const i = queue[q];
        order.push(i);
        const px = i % width;
        const neighbours = [px > 0 ? i - 1 : -1, px < width - 1 ? i + 1 : -1, i - width, i + width];
        for (const n of neighbours) {
            if (n >= 0 && n < labels.length && !seen[n] && labels[n] === area) {
                seen[n] = 1;
                queue.push(n);
            }
        }
    }
    for (const i of info.areas[area]) {
        if (!seen[i]) {
            order.push(i);
        }
    }
    return order;
}

// Colors are not kept between visits: every page starts blank when it is opened.
// Earlier versions of the game saved them on the device; that leftover is cleared.
try {
    localStorage.removeItem(STORAGE_KEY);
} catch {
    // Storage blocked: nothing was saved there either.
}
