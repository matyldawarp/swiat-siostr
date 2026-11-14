// Ikony 64: icons drawn on a fixed ICON64_GRID x ICON64_GRID pixel canvas and scaled to
// their size, so every ikona 64 has the same pixel size, however large it is shown. The
// button icons (PixelUI.createIconButton) and the personality badges (addPersonalityBadge)
// are ikony 64. An ikona 64 draws with fillStyle and fillRect only, like the Icons.

import { RENDER_SCALE } from './pixel.js';

export const ICON64_GRID = 64;
// The size an ikona 64 is drawn at, a little under the grid so outlines past it still fit.
const ICON64_DRAW_SIZE = 58;
let icon64Count = 0;

// The two Graphics calls the Icons use, painting whole pixels of a canvas instead;
// (ox, oy) is where the icon's (0, 0) lands.
function icon64Painter(ctx, ox, oy) {
    return {
        fillStyle(color, alpha = 1) {
            ctx.fillStyle = `rgba(${(color >> 16) & 255}, ${(color >> 8) & 255}, ${color & 255}, ${alpha})`;
            return this;
        },
        fillRect(x, y, w, h) {
            const x1 = Math.round(ox + Math.min(x, x + w));
            const y1 = Math.round(oy + Math.min(y, y + h));
            const x2 = Math.round(ox + Math.max(x, x + w));
            const y2 = Math.round(oy + Math.max(y, y + h));
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
            return this;
        }
    };
}

// The Icons draw their outlines one pixel wide, which on the finer grid is much thinner
// than before. Every dark pixel (outlines, the button border colour) spreads to its four
// neighbours, so lines are three grid pixels wide: the same weight the icons always had.
function thickenLines(ctx) {
    const image = ctx.getImageData(0, 0, ICON64_GRID, ICON64_GRID);
    const src = new Uint8ClampedArray(image.data);
    const dark = (i) => src[i + 3] > 128 && src[i] * 0.299 + src[i + 1] * 0.587 + src[i + 2] * 0.114 < 130;
    for (let y = 0; y < ICON64_GRID; y++) {
        for (let x = 0; x < ICON64_GRID; x++) {
            const i = (y * ICON64_GRID + x) * 4;
            if (dark(i)) {
                continue;
            }
            const from = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]
                .filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < ICON64_GRID && ny < ICON64_GRID)
                .map(([nx, ny]) => (ny * ICON64_GRID + nx) * 4)
                .find(dark);
            if (from !== undefined) {
                image.data.set(src.subarray(from, from + 4), i);
            }
        }
    }
    ctx.putImageData(image, 0, 0);
}

// An ikona 64 centred on (x, y), whose drawing is drawnSize game pixels across.
// drawIcon(g, size) draws centred on (0, 0). icon.setIcon(drawIcon) repaints it (e.g. the
// music note crossed out); the canvas goes with the image.
export function addIcon64(scene, x, y, drawnSize, drawIcon) {
    const key = `icon64-${icon64Count++}`;
    const texture = scene.textures.createCanvas(key, ICON64_GRID, ICON64_GRID);
    const paint = (drawIconNow) => {
        const ctx = texture.getContext();
        ctx.clearRect(0, 0, ICON64_GRID, ICON64_GRID);
        drawIconNow(icon64Painter(ctx, ICON64_GRID / 2, ICON64_GRID / 2), ICON64_DRAW_SIZE);
        thickenLines(ctx);
        texture.refresh();
    };
    paint(drawIcon);
    // Never a fraction of a pixel in size (checkWholePixels): a whole, even number of device
    // pixels, so its edges land on whole pixels around its centre too. Shown with fewer
    // screen pixels than the grid has, it is smoothed so thin lines don't drop out.
    const devicePixels = 2 * Math.round((drawnSize * ICON64_GRID * RENDER_SCALE) / ICON64_DRAW_SIZE / 2);
    if (devicePixels < ICON64_GRID) {
        texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    }
    const shown = devicePixels / RENDER_SCALE;
    const icon = scene.add.image(x, y, key).setDisplaySize(shown, shown);
    icon.isIcon64 = true;
    icon.setIcon = paint;
    icon.once('destroy', () => scene.textures.remove(key));
    return icon;
}
