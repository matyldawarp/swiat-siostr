// Coloring pages: paints, the areas of a page, the paint layer they are filled on, and the
// picture's lines shown over it.
//
// What you see is the page picture's lines (makeLineArt) over a layer of paint. An area
// is found in the uncolored picture when a finger taps it (gfx/coloringAreas.js), and
// its paint reaches a little under the lines around it.

import { PALETTE } from '../ui/pixel.js';
import { PageAreas } from './coloringAreas.js';

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

// The brush paints a line this many page pixels wide, about the width of a small child's
// fingertip on the iPad (a page pixel is 2 CSS px there, see STAGE in ui/pixel.js).
export const BRUSH_WIDTH = 18;

const css = (color) => `#${color.toString(16).padStart(6, '0')}`;

// --- Areas ----------------------------------------------------------------------------

// Height of the page on the coloring screen, in page (game) pixels.
const PAGE_HEIGHT = 380;

const pages = new Map();

// A page ready to color, kept per page while the game runs (so areas found once stay):
// { width, height } on screen in page pixels, the areas finder over the uncolored picture
// (gfx/coloringAreas.js; its pixels are `sx` per page pixel) and masks of found areas.
export function coloringInfo(scene, page, pictureKey) {
    if (pages.has(page.id)) {
        return pages.get(page.id);
    }
    const img = scene.textures.get(pictureKey).getSourceImage();
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, img.width, img.height);
    ctx.drawImage(img, 0, 0);
    const rgba = ctx.getImageData(0, 0, img.width, img.height).data;
    const gray = new Uint8Array(img.width * img.height);
    for (let i = 0; i < gray.length; i++) {
        gray[i] = (rgba[i * 4] + rgba[i * 4 + 1] + rgba[i * 4 + 2]) / 3;
    }
    const info = {
        width: Math.round((PAGE_HEIGHT * img.width) / img.height),
        height: PAGE_HEIGHT,
        sx: img.height / PAGE_HEIGHT,
        finder: new PageAreas(gray, img.width, img.height),
        masks: new Map()
    };
    pages.set(page.id, info);
    return info;
}

// The area at (x, y) in page pixels (found now if it's the first tap there), or -1.
export function areaAt(info, x, y) {
    return info.finder.areaAt(x * info.sx, y * info.sx);
}

// An area's bounding box in page pixels.
export function areaBox(info, area) {
    const { box } = info.finder.areas[area];
    const s = info.sx;
    return { x1: box.x1 / s, y1: box.y1 / s, x2: (box.x2 + 1) / s, y2: (box.y2 + 1) / s };
}

// The area as an image of its bounding box: opaque where it is, clear elsewhere.
function areaMask(info, area) {
    if (!info.masks.has(area)) {
        const { box, mask } = info.finder.areas[area];
        const canvas = document.createElement('canvas');
        canvas.width = box.x2 - box.x1 + 1;
        canvas.height = box.y2 - box.y1 + 1;
        const ctx = canvas.getContext('2d');
        const image = ctx.createImageData(canvas.width, canvas.height);
        for (let i = 0; i < mask.length; i++) {
            if (mask[i]) {
                image.data.fill(255, i * 4, i * 4 + 4);
            }
        }
        ctx.putImageData(image, 0, 0);
        info.masks.set(area, canvas);
    }
    return info.masks.get(area);
}

// --- Paint layer ----------------------------------------------------------------------

// A canvas texture the page's paint is drawn on, `scale` device pixels per page pixel so
// area edges stay smooth. Untouched paper is white; the lines go on top of it. Paint is
// first drawn on a scratch canvas, cut to the area's shape there, and then laid on.
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
        this.scratch = document.createElement('canvas');
        this.sctx = this.scratch.getContext('2d');
        // What the scratch canvas holds now ("area:paint" of a whole fill), to reuse it
        // while a fill spreads.
        this.scratchFill = null;
        this.patterns = new Map();
    }

    // The area's box on the layer, in whole layer pixels.
    areaRect(area) {
        const box = areaBox(this.info, area);
        const x = Math.floor(box.x1 * this.scale);
        const y = Math.floor(box.y1 * this.scale);
        return { x, y, w: Math.ceil(box.x2 * this.scale) - x, h: Math.ceil(box.y2 * this.scale) - y };
    }

    // Draws `shape(ctx)` (page coordinates) in `paint` on the scratch canvas over `rect` of
    // the layer, cut to the area. Returns false when there is nothing to draw.
    prepare(area, paint, rect, shape) {
        if (rect.w <= 0 || rect.h <= 0) {
            return false;
        }
        const ctx = this.sctx;
        this.scratch.width = rect.w;
        this.scratch.height = rect.h;
        // Patterns keep their pixel look.
        ctx.imageSmoothingEnabled = false;
        ctx.setTransform(this.scale, 0, 0, this.scale, -rect.x, -rect.y);
        ctx.fillStyle = this.style(paint);
        ctx.strokeStyle = ctx.fillStyle;
        shape(ctx);
        // Keep only the area, its edges smoothed.
        const { box } = this.info.finder.areas[area];
        const f = this.scale / this.info.sx;
        const mask = areaMask(this.info, area);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(mask, box.x1 * f - rect.x, box.y1 * f - rect.y, mask.width * f, mask.height * f);
        ctx.globalCompositeOperation = 'source-over';
        return true;
    }

    // Lays the scratch canvas on the layer at `rect`; with `circle` (page pixels) only
    // the part inside it.
    layOn(rect, circle = null) {
        const ctx = this.ctx;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        if (circle) {
            ctx.beginPath();
            ctx.arc(circle.x * this.scale, circle.y * this.scale, circle.r * this.scale, 0, Math.PI * 2);
            ctx.clip();
        }
        ctx.drawImage(this.scratch, rect.x, rect.y);
        ctx.restore();
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
            this.patterns.set(paint.id, this.sctx.createPattern(tile, 'repeat'));
        }
        return this.patterns.get(paint.id);
    }

    // Everything again: white paper, then every step in order. A step is a fill
    // ({ area, paint }) or a brush stroke ({ area, paint, points }), paint given by id.
    render(steps) {
        const ctx = this.ctx;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, this.texture.width, this.texture.height);
        steps.forEach((step) => {
            if (step.points) {
                this.stroke(step.area, paintById(step.paint), step.points);
            } else {
                this.fill(step.area, paintById(step.paint));
            }
        });
        this.texture.refresh();
    }

    // Fills an area; with `circle` ({ x, y, r } in page pixels) only the part inside it,
    // for paint spreading from a tap.
    fill(area, paint, circle = null) {
        if (!paint) {
            return;
        }
        const rect = this.areaRect(area);
        const key = `${area}:${paint.id}`;
        if (this.scratchFill !== key) {
            if (!this.prepare(area, paint, rect, (ctx) => ctx.fillRect(0, 0, this.info.width, this.info.height))) {
                return;
            }
            this.scratchFill = key;
        }
        this.layOn(rect, circle);
    }

    // A round brush line through `points` ([x, y, x, y, ...] in page pixels), kept inside
    // the area so it never goes over into the next one. `from` (a point index) draws only
    // the part added since then, while the finger is still moving.
    stroke(area, paint, points, from = 0) {
        if (!paint || points.length < 2) {
            return;
        }
        const start = Math.max(0, from - 1) * 2;
        // Only the box around the new part, inside the area's box.
        const xs = [];
        const ys = [];
        for (let i = start; i < points.length; i += 2) {
            xs.push(points[i]);
            ys.push(points[i + 1]);
        }
        const pad = BRUSH_WIDTH / 2 + 1;
        const areaRect = this.areaRect(area);
        const x1 = Math.max(areaRect.x, Math.floor((Math.min(...xs) - pad) * this.scale));
        const y1 = Math.max(areaRect.y, Math.floor((Math.min(...ys) - pad) * this.scale));
        const x2 = Math.min(areaRect.x + areaRect.w, Math.ceil((Math.max(...xs) + pad) * this.scale));
        const y2 = Math.min(areaRect.y + areaRect.h, Math.ceil((Math.max(...ys) + pad) * this.scale));
        const rect = { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
        this.scratchFill = null;
        const drawn = this.prepare(area, paint, rect, (ctx) => {
            ctx.lineWidth = BRUSH_WIDTH;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            if (points.length - start === 2) {
                ctx.arc(points[start], points[start + 1], BRUSH_WIDTH / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.moveTo(points[start], points[start + 1]);
                for (let i = start + 2; i < points.length; i += 2) {
                    ctx.lineTo(points[i], points[i + 1]);
                }
                ctx.stroke();
            }
        });
        if (drawn) {
            this.layOn(rect);
        }
    }

    refresh() {
        this.texture.refresh();
    }
}

// --- Lines ----------------------------------------------------------------------------

// The picture's lines as a texture to lay over the paint: full resolution, lines in the
// outline color with soft edges and the paper transparent. Smooth scaling keeps them as
// drawn when shown at the page's size. Returns the texture key.
export function makeLineArt(scene, page, pictureKey) {
    const key = `coloring-lines-${page.id}`;
    if (scene.textures.exists(key)) {
        return key;
    }
    const img = scene.textures.get(pictureKey).getSourceImage();
    const texture = scene.textures.createCanvas(key, img.width, img.height);
    const ctx = texture.getContext();
    ctx.drawImage(img, 0, 0);

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

// --- Printing -------------------------------------------------------------------------

// The blank page as a PNG file, for the share sheet (see printBlankPage).
let printFile = null;

// Gets the blank page ready to print on paper: the uncolored picture as drawn, as large as
// the sheet allows. The game hides itself for printing (print stylesheet below), so only
// the picture is on the sheet. Done when the page opens, so the print button can print
// straight from the tap: iPad ignores print and share calls made later on.
export function preparePrint(scene, pictureKey, name = 'kolorowanka') {
    const img = scene.textures.get(pictureKey).getSourceImage();
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, img.width, img.height);
    ctx.drawImage(img, 0, 0);

    let sheet = document.getElementById('print-sheet');
    if (!sheet) {
        sheet = document.createElement('div');
        sheet.id = 'print-sheet';
        sheet.appendChild(document.createElement('img'));
        document.body.appendChild(sheet);
        document.head.appendChild(document.createElement('style')).id = 'print-style';
    }
    const landscape = img.width > img.height;
    document.getElementById('print-style').textContent = `
        #print-sheet { display: none; }
        @media print {
            @page { size: ${landscape ? 'landscape' : 'portrait'}; margin: 8mm; }
            html, body { width: 100%; height: 100%; margin: 0; overflow: visible; background: #ffffff; }
            body > *:not(#print-sheet) { display: none !important; }
            #print-sheet { display: block; width: 100%; height: 100%; }
            #print-sheet img { display: block; width: 100%; height: 100%; object-fit: contain; }
        }`;
    sheet.querySelector('img').src = canvas.toDataURL('image/png');
    printFile = null;
    canvas.toBlob((blob) => {
        printFile = blob ? new File([blob], `${name}.png`, { type: 'image/png' }) : null;
    }, 'image/png');
}

// Prints the page prepared by preparePrint; call it straight from a tap. A game started
// from the iPad's home screen can't open the print window (window.print does nothing
// there), so it opens the share sheet with the picture instead, which has "Print" and
// fits the picture to the sheet. In a browser the print window opens.
export function printBlankPage() {
    const standalone = navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    const files = printFile ? [printFile] : null;
    if (standalone && files && navigator.canShare && navigator.canShare({ files })) {
        navigator.share({ files }).catch(() => {
            // Closed without printing: nothing to do.
        });
        return;
    }
    window.print();
}

// Colors are not kept between visits: every page starts blank when it is opened.
// Earlier versions of the game saved them on the device; that leftover is cleared.
try {
    localStorage.removeItem(STORAGE_KEY);
} catch {
    // Storage blocked: nothing was saved there either.
}
