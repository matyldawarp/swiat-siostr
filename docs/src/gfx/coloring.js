// Coloring pages: paints, splitting a page's line art into fillable areas, drawing the
// colored page, and remembering the colors per page on this device.

import { PALETTE } from '../ui/pixel.js';

// Darker than this (0-255 gray) counts as line; the rest is paper that can be filled.
const LINE_THRESHOLD = 200;
// Gaps in the drawing up to about twice this many pixels wide count as closed, so paint
// doesn't leak out of a shape whose outline doesn't quite meet.
const GAP_CLOSE = 3;
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

// Splits a page's line art (a loaded texture) into areas of paper between lines.
// Returns { width, height, line, labels, areas } where labels[i] is the area of pixel i
// (-1 on a line) and areas[n] lists the pixel indexes of area n. Kept per page, so this
// runs once.
//
// Drawings often have small gaps where two strokes almost meet, which would let paint
// leak out. So areas are first found with the lines fattened by GAP_CLOSE pixels (gaps
// closed), and then the paper next to the lines, left out by the fattening, joins the
// nearest area; on screen the lines keep their own thickness.
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
    const line = new Uint8Array(count);
    for (let i = 0; i < count; i++) {
        line[i] = pixels[i * 4] < LINE_THRESHOLD && pixels[i * 4 + 3] > 0 ? 1 : 0;
    }

    // Lines fattened by GAP_CLOSE pixels in every direction (a round brush).
    const fat = new Uint8Array(count);
    const r = GAP_CLOSE;
    for (let i = 0; i < count; i++) {
        if (!line[i]) {
            continue;
        }
        const x = i % width;
        const y = Math.floor(i / width);
        for (let dy = -r; dy <= r; dy++) {
            for (let dx = -r; dx <= r; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (dx * dx + dy * dy <= r * r && nx >= 0 && ny >= 0 && nx < width && ny < height) {
                    fat[ny * width + nx] = 1;
                }
            }
        }
    }

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

// Saved colors of every page: { pageId: { area: paintId } }.
export function loadFills(pageId) {
    try {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        return all[pageId] || {};
    } catch {
        return {};
    }
}

export function saveFills(pageId, fills) {
    try {
        const all = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        all[pageId] = fills;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {
        // Storage blocked: the colors last until the page is closed.
    }
}
