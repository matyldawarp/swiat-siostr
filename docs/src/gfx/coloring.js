// Coloring pages: paints, the areas of a page (from its <id>.coloring.svg), the paint layer
// they are filled on, and the original drawing's lines shown over it.
//
// What you see is the original picture's lines (makeLineArt) over a layer of paint. The
// areas come from the SVG made by tools/make-coloring.mjs: one path per area, meeting
// along the middle of each drawn stroke, so paint always reaches under the lines.

import { PALETTE } from '../ui/pixel.js';

const STORAGE_KEY = 'swiat-siostr-coloring';

// Little repeatable hash of a pixel position, for sparkles that stay put.
const hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;

const RAINBOW = [0xf28aa5, 0xffc08a, 0xfff09a, 0x7fcf9a, 0x9fd0f5, 0xc3b3ea];

// Paints on the side panel, in two columns. A paint is a solid `color`, or a `pattern`
// giving the color of each pixel (x, y) of the page; a pattern repeats every `tile` pixels.
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
    { id: 'rainbow', tile: 36, pattern: (x, y) => RAINBOW[Math.floor((x + y) / 6) % RAINBOW.length] },
    { id: 'dots', tile: 6, pattern: (x, y) => ((x % 6 < 2 && y % 6 < 2) || ((x + 3) % 6 < 2 && (y + 3) % 6 < 2) ? 0xffffff : 0xf7a8c4) },
    { id: 'sparkle', tile: 48, pattern: (x, y) => (hash(x, y) % 23 === 0 ? 0xffffff : (hash(x, y) % 7 === 0 ? 0xfff7d6 : 0xf6d98b)) }
];

export function paintColor(paint, x, y) {
    return paint.pattern ? paint.pattern(x, y) : paint.color;
}

export const paintById = (id) => PAINTS.find((p) => p.id === id) || null;

const css = (color) => `#${color.toString(16).padStart(6, '0')}`;

// --- Areas ----------------------------------------------------------------------------

const parsed = new Map();

// The areas of a page from its SVG text: { width, height, areas: [{ path, box }] } with a
// Path2D per area (fill-rule evenodd, in page pixels) and its bounding box. Kept per page.
export function pageAreas(pageId, svgText) {
    if (parsed.has(pageId)) {
        return parsed.get(pageId);
    }
    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    const svg = doc.documentElement;
    const [, , width, height] = svg.getAttribute('viewBox').split(/\s+/).map(Number);
    const areas = [...doc.querySelectorAll('path')].map((el) => {
        const d = el.getAttribute('d');
        const numbers = d.match(/-?\d+(\.\d+)?/g).map(Number);
        const xs = numbers.filter((_, i) => i % 2 === 0);
        const ys = numbers.filter((_, i) => i % 2 === 1);
        const box = { x1: Math.min(...xs), y1: Math.min(...ys), x2: Math.max(...xs), y2: Math.max(...ys) };
        return { path: new Path2D(d), box };
    });
    const result = { width, height, areas };
    parsed.set(pageId, result);
    return result;
}

let hitCtx = null;

// The area at (x, y) in page pixels, or -1.
export function areaAt(info, x, y) {
    hitCtx = hitCtx || document.createElement('canvas').getContext('2d');
    return info.areas.findIndex(({ path, box }) => x >= box.x1 && x <= box.x2 && y >= box.y1 && y <= box.y2
        && hitCtx.isPointInPath(path, x, y, 'evenodd'));
}

// --- Paint layer ----------------------------------------------------------------------

// A canvas texture the page's paint is drawn on, `scale` device pixels per page pixel so
// area edges stay smooth. Untouched paper is white; the lines go on top of it.
export class PaintLayer {
    constructor(scene, key, info, scale) {
        if (scene.textures.exists(key)) {
            scene.textures.remove(key);
        }
        this.info = info;
        this.scale = scale;
        this.texture = scene.textures.createCanvas(key, Math.ceil(info.width * scale), Math.ceil(info.height * scale));
        this.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.ctx = this.texture.getContext();
        // Patterns keep their pixel look.
        this.ctx.imageSmoothingEnabled = false;
        this.patterns = new Map();
    }

    // How a paint fills: a CSS color, or a repeating pattern drawn from its pixels.
    style(paint) {
        if (!paint.pattern) {
            return css(paint.color);
        }
        if (!this.patterns.has(paint.id)) {
            const tile = document.createElement('canvas');
            tile.width = paint.tile;
            tile.height = paint.tile;
            const tctx = tile.getContext('2d');
            for (let y = 0; y < paint.tile; y++) {
                for (let x = 0; x < paint.tile; x++) {
                    tctx.fillStyle = css(paint.pattern(x, y));
                    tctx.fillRect(x, y, 1, 1);
                }
            }
            this.patterns.set(paint.id, this.ctx.createPattern(tile, 'repeat'));
        }
        return this.patterns.get(paint.id);
    }

    // Everything again: white paper, then every area in its paint (`fills`: area -> paint id).
    render(fills) {
        const ctx = this.ctx;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, this.texture.width, this.texture.height);
        Object.entries(fills).forEach(([area, paintId]) => this.fill(Number(area), paintById(paintId)));
        this.texture.refresh();
    }

    // Fills an area; with `circle` ({ x, y, r } in page pixels) only the part inside it,
    // for paint spreading from a tap.
    fill(area, paint, circle = null) {
        if (!paint) {
            return;
        }
        const ctx = this.ctx;
        ctx.save();
        ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
        ctx.fillStyle = this.style(paint);
        if (circle) {
            ctx.clip(this.info.areas[area].path, 'evenodd');
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fill(this.info.areas[area].path, 'evenodd');
        }
        ctx.restore();
    }

    refresh() {
        this.texture.refresh();
    }
}

// --- Lines ----------------------------------------------------------------------------

// The original drawing's lines as a texture to lay over the paint: full resolution, the
// page's `make.blank` boxes (printed title, website address) whited out, lines in the
// outline color with soft edges and the paper transparent. Smooth scaling keeps them as
// drawn when shown at the page's size. Returns the texture key.
export function makeLineArt(scene, page, originalKey, blank = []) {
    const key = `coloring-lines-${page.id}`;
    if (scene.textures.exists(key)) {
        return key;
    }
    const img = scene.textures.get(originalKey).getSourceImage();
    const texture = scene.textures.createCanvas(key, img.width, img.height);
    const ctx = texture.getContext();
    ctx.drawImage(img, 0, 0);
    ctx.fillStyle = '#ffffff';
    blank.forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));

    const data = ctx.getImageData(0, 0, img.width, img.height);
    const px = data.data;
    const r = (PALETTE.outline >> 16) & 0xff;
    const g = (PALETTE.outline >> 8) & 0xff;
    const b = PALETTE.outline & 0xff;
    for (let i = 0; i < px.length; i += 4) {
        const light = (px[i] + px[i + 1] + px[i + 2]) / 3;
        px[i] = r;
        px[i + 1] = g;
        px[i + 2] = b;
        px[i + 3] = Math.round(255 - light);
    }
    ctx.putImageData(data, 0, 0);
    texture.refresh();
    texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    return key;
}

// Colors are not kept between visits: every page starts blank when it is opened.
// Earlier versions of the game saved them on the device; that leftover is cleared.
try {
    localStorage.removeItem(STORAGE_KEY);
} catch {
    // Storage blocked: nothing was saved there either.
}
