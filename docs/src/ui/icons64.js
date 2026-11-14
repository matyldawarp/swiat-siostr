// Ikony 64: icons drawn on a fixed ICON64_GRID x ICON64_GRID pixel canvas and scaled to
// their size, so every ikona 64 has the same pixel size, however large it is shown. The
// button icons (PixelUI.createIconButton) and the personality badges (addPersonalityBadge)
// are ikony 64. Each is a 64x64 PNG in docs/assets/gfx/ikony64/ (gfx/images.js); its drawing
// takes up the middle ICON64_DRAW_SIZE pixels, so outlines past it still fit.

import { imageTexture } from '../gfx/images.js';

export const ICON64_GRID = 64;
const ICON64_DRAW_SIZE = 58;
let icon64Count = 0;

// An ikona 64 centred on (x, y), whose drawing is drawnSize game pixels across. `picture` is
// the key of its PNG, e.g. 'ikony64/zebatka', or null for none. icon.setIcon(picture) shows
// another one (e.g. the music note crossed out); the canvas goes with the image.
export function addIcon64(scene, x, y, drawnSize, picture) {
    const key = `icon64-${icon64Count++}`;
    const texture = scene.textures.createCanvas(key, ICON64_GRID, ICON64_GRID);
    // A canvas of its own, so its smoothing (below) doesn't change other icons with the same PNG.
    const paint = (iconNow) => {
        const ctx = texture.getContext();
        ctx.clearRect(0, 0, ICON64_GRID, ICON64_GRID);
        if (iconNow) {
            ctx.drawImage(scene.textures.get(imageTexture(scene, iconNow)).getSourceImage(), 0, 0);
        }
        texture.refresh();
    };
    paint(picture);
    // Never a fraction of a pixel in size (checkWholePixels): a whole, even number of device
    // pixels, so its edges land on whole pixels around its centre too. Shown with fewer
    // screen pixels than the grid has, it is smoothed so thin lines don't drop out.
    const zoom = scene.cameras.main.zoom;
    const devicePixels = 2 * Math.round((drawnSize * ICON64_GRID * zoom) / ICON64_DRAW_SIZE / 2);
    if (devicePixels < ICON64_GRID) {
        texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    }
    const shown = devicePixels / zoom;
    const icon = scene.add.image(x, y, key).setDisplaySize(shown, shown);
    icon.isIcon64 = true;
    icon.setIcon = paint;
    icon.once('destroy', () => scene.textures.remove(key));
    return icon;
}
