import { PALETTE, PixelUI, S, TEXT_COLORS, textStyle } from '../ui/pixel.js';
import { ICON_COLORS, Icons } from '../gfx/icons.js';
import { COLORING_PAGES, coloringImage, getColoringPage } from '../data/coloring.js';
import { PAINTS, analysePage, flowOrder, loadFills, paintArea, paintColor, renderPage, saveFills } from '../gfx/coloring.js';
import { floatHeart } from '../ui/effects.js';
import { playPat, playPlop, playSparkle, playStep } from '../audio/sfx.js';
import { BaseScene } from './BaseScene.js';

const STUDIO_COLORS = {
    wall: 0xf3ecfb,
    wallStripe: 0xebe2f7,
    mat: 0xd9ccf5,
    panel: 0xfff7fb
};

// The page being colored, kept in the registry so a rebuild (resize) stays on it.
const PAGE_KEY = 'coloringPage';
// Undo steps kept per visit.
const UNDO_LIMIT = 30;

const pageTexture = (page) => `coloring-page-${page.id}`;

// The art studio. First a shelf with a card per coloring page (its picture as colored so
// far); tapping one opens it. Coloring works like a paint book: pick a paint on the right
// (solid colors, then rainbow, dots and glitter), tap an area of the picture and the paint
// flows into it up to the lines. The curved arrow undoes, the house goes back to the shelf.
// Colors are remembered per page.
export class ColoringScene extends BaseScene {
    constructor() {
        super('ColoringScene');
    }

    preload() {
        COLORING_PAGES.forEach((page) => {
            if (!this.textures.exists(pageTexture(page))) {
                this.load.image(pageTexture(page), coloringImage(page));
            }
        });
    }

    init(data) {
        super.init(data);
        this.page = getColoringPage(this.registry.get(PAGE_KEY));
        this.paint = this.paint || PAINTS[0];
        this.undoStack = [];
        this.busy = false;
    }

    // #kolorowanki for the shelf, #kolorowanki/<page id> while coloring a page.
    route() {
        return this.page ? `${super.route()}/${this.page.id}` : super.route();
    }

    build({ width, height }) {
        this.drawWall();
        if (this.page) {
            this.buildPage(width, height);
        } else {
            this.buildShelf(width, height);
        }
    }

    // Soft striped wallpaper over the whole window (view.bleed).
    drawWall() {
        const b = this.view.bleed;
        const g = this.add.graphics();
        const stripe = S(12);
        const firstX = Math.floor(b.x / stripe) * stripe;
        for (let x = firstX; x < b.x + b.width; x += stripe) {
            g.fillStyle(Math.abs(Math.floor(x / stripe)) % 2 ? STUDIO_COLORS.wallStripe : STUDIO_COLORS.wall, 1);
            g.fillRect(x, b.y, stripe, b.height);
        }
    }

    // --- Shelf of pages -----------------------------------------------------------------

    buildShelf(width, height) {
        PixelUI.addTitle(this, Math.round(width / 2), S(24), 'Kolorowanki');

        const cardW = S(112);
        const cardH = S(150);
        const gap = S(16);
        const total = COLORING_PAGES.length * cardW + (COLORING_PAGES.length - 1) * gap;
        let x = Math.round((width - total) / 2);
        const y = Math.round((height - cardH) / 2) + S(4);
        COLORING_PAGES.forEach((page) => {
            this.createCard(page, x, y, cardW, cardH);
            x += cardW + gap;
        });

        PixelUI.createIconButton(this, S(24), height - S(24), S(32),
            (g, size) => Icons.map(g, 0, 0, size), () => this.goToMap());
    }

    // A card with the page as colored so far (shrunk smoothly) and its title.
    createCard(page, x, y, w, h) {
        const g = this.add.graphics();
        PixelUI.drawBox(g, x, y, w, h, ICON_COLORS.white, PALETTE.buttonBorder, 0xffffff);

        const info = analysePage(this, page, pageTexture(page));
        const full = document.createElement('canvas');
        full.width = info.width;
        full.height = info.height;
        const fullCtx = full.getContext('2d');
        const data = fullCtx.createImageData(info.width, info.height);
        renderPage(info, loadFills(page.id), new Uint32Array(data.data.buffer));
        fullCtx.putImageData(data, 0, 0);

        const titleH = S(22);
        const scale = Math.min((w - S(12)) / info.width, (h - titleH - S(10)) / info.height);
        const tw = Math.round(info.width * scale);
        const th = Math.round(info.height * scale);
        const key = `coloring-thumb-${page.id}`;
        if (this.textures.exists(key)) {
            this.textures.remove(key);
        }
        const thumb = this.textures.createCanvas(key, tw, th);
        const ctx = thumb.getContext();
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(full, 0, 0, tw, th);
        thumb.refresh();
        this.add.image(x + w / 2, y + S(6) + th / 2, key);

        PixelUI.addText(this, x + w / 2, y + h - titleH / 2 - S(2), page.title,
            textStyle(S(10), { bold: true, color: TEXT_COLORS.button })).setOrigin(0.5);

        const zone = this.add.zone(x + w / 2, y + h / 2, w, h).setInteractive({ useHandCursor: true });
        zone.on('pointerup', () => this.openPage(page));
    }

    openPage(page) {
        playPat(this);
        this.registry.set(PAGE_KEY, page.id);
        this.scene.restart({ resized: true });
    }

    backToShelf() {
        playStep(this);
        this.registry.set(PAGE_KEY, null);
        this.scene.restart({ resized: true });
    }

    // --- Coloring a page ----------------------------------------------------------------

    buildPage(width, height) {
        const panelW = S(84);
        const info = analysePage(this, this.page, pageTexture(this.page));
        this.info = info;
        this.fills = loadFills(this.page.id);

        // The page on a colored mat, in the space left of the paint panel.
        const areaW = width - panelW - S(8);
        const px = Math.round((areaW - info.width) / 2);
        const py = Math.round((height - info.height) / 2);
        const mat = this.add.graphics();
        PixelUI.drawBox(mat, px - S(8), py - S(6), info.width + S(16), info.height + S(12), STUDIO_COLORS.mat, PALETTE.outline);
        this.pageRect = { x: px, y: py };

        const key = `coloring-canvas-${this.page.id}`;
        if (this.textures.exists(key)) {
            this.textures.remove(key);
        }
        this.canvasTexture = this.textures.createCanvas(key, info.width, info.height);
        this.ctx = this.canvasTexture.getContext();
        this.imageData = this.ctx.createImageData(info.width, info.height);
        this.pixels = new Uint32Array(this.imageData.data.buffer);
        renderPage(info, this.fills, this.pixels);
        this.refreshCanvas();

        const picture = this.add.image(px, py, key).setOrigin(0);
        picture.setInteractive({ useHandCursor: true });
        picture.on('pointerdown', (pointer) => this.fillAt(pointer.worldX - px, pointer.worldY - py));

        // Below the music and reload buttons in the top-right corner (OverlayScene).
        const panelTop = S(34);
        this.createPanel(width - panelW - S(4), panelTop, panelW, height - panelTop - S(4));
    }

    refreshCanvas() {
        this.ctx.putImageData(this.imageData, 0, 0);
        this.canvasTexture.refresh();
    }

    // The tapped area fills with the chosen paint, flowing out from the finger.
    fillAt(fx, fy) {
        const x = Math.floor(fx);
        const y = Math.floor(fy);
        const info = this.info;
        if (this.busy || x < 0 || y < 0 || x >= info.width || y >= info.height) {
            return;
        }
        const area = info.labels[y * info.width + x];
        if (area < 0 || this.fills[area] === this.paint.id) {
            // A line, or already this color: a little bounce of the chosen paint says so.
            PixelUI.hop(this, this.selectedSwatch, this.selectedSwatch.baseY, S(3), { duration: 80 });
            return;
        }

        this.undoStack.push({ area, before: this.fills[area] || null });
        if (this.undoStack.length > UNDO_LIMIT) {
            this.undoStack.shift();
        }
        this.fills[area] = this.paint.id;
        saveFills(this.page.id, this.fills);
        playPlop(this);

        // Paint the area nearest-first over a few frames, like paint spreading.
        const order = flowOrder(info, area, x, y);
        const steps = Math.min(12, Math.max(1, Math.ceil(order.length / 400)));
        const chunk = Math.ceil(order.length / steps);
        const paint = this.paint;
        this.busy = true;
        let done = 0;
        this.time.addEvent({
            delay: 25,
            repeat: steps - 1,
            callback: () => {
                paintArea(info, area, paint, this.pixels, order.slice(done, done + chunk));
                done += chunk;
                this.refreshCanvas();
                if (done >= order.length) {
                    this.busy = false;
                    if (order.length > 300) {
                        playSparkle(this);
                        floatHeart(this, this.pageRect.x + x, this.pageRect.y + y - S(6), { depth: 30, rise: S(18), duration: 600 });
                    }
                }
            }
        });
    }

    undo() {
        const step = this.undoStack.pop();
        if (!step || this.busy) {
            PixelUI.hop(this, this.undoButton, this.undoButton.baseY, S(3), { duration: 80 });
            return;
        }
        if (step.before) {
            this.fills[step.area] = step.before;
        } else {
            delete this.fills[step.area];
        }
        saveFills(this.page.id, this.fills);
        // Back to white first, then the earlier paint if there was one.
        const white = PAINTS.find((p) => p.id === 'white');
        paintArea(this.info, step.area, white, this.pixels);
        paintArea(this.info, step.area, PAINTS.find((p) => p.id === step.before), this.pixels);
        this.refreshCanvas();
        playStep(this);
    }

    // --- Paint panel --------------------------------------------------------------------

    // Undo and home on top, then the paints in two columns.
    createPanel(x, y, w, h) {
        const g = this.add.graphics();
        PixelUI.drawBox(g, x, y, w, h, STUDIO_COLORS.panel, PALETTE.buttonBorder, 0xffffff);

        const button = S(30);
        const topY = y + S(6) + button / 2;
        this.undoButton = PixelUI.createIconButton(this, x + w / 4 + S(1), topY, button,
            (gfx, size) => Icons.undo(gfx, 0, 0, size), () => this.undo());
        this.undoButton.baseY = topY;
        PixelUI.createIconButton(this, x + (w * 3) / 4 - S(1), topY, button,
            (gfx, size) => Icons.house(gfx, 0, 0, size), () => this.backToShelf());

        const rows = Math.ceil(PAINTS.length / 2);
        const listTop = topY + button / 2 + S(8);
        const rowH = Math.min(S(30), Math.floor((y + h - S(6) - listTop) / rows));
        const r = Math.min(S(12), Math.floor(rowH / 2) - 2);
        this.swatches = PAINTS.map((paint, i) => {
            const cx = Math.round(x + (i % 2 ? (w * 3) / 4 : w / 4));
            const cy = Math.round(listTop + Math.floor(i / 2) * rowH + rowH / 2);
            const swatch = this.add.container(cx, cy);
            swatch.baseY = cy;
            const sg = this.add.graphics();
            swatch.add(sg);
            swatch.draw = (selected) => {
                sg.clear();
                // A white ring and a bigger blob mark the paint in use.
                if (selected) {
                    sg.fillStyle(PALETTE.buttonBorder, 1);
                    PixelUI.fillCircle(sg, 0, 0, r + 4);
                    sg.fillStyle(0xffffff, 1);
                    PixelUI.fillCircle(sg, 0, 0, r + 3);
                }
                sg.fillStyle(PALETTE.outline, 1);
                PixelUI.fillCircle(sg, 0, 0, r + 1);
                // Paint pixel by pixel, so patterns show as they will on the page.
                for (let dy = -r; dy <= r; dy++) {
                    const dx = Math.round(Math.sqrt(r * r - dy * dy));
                    for (let px = -dx; px <= dx; px++) {
                        sg.fillStyle(paintColor(paint, px + 100, dy + 100), 1);
                        sg.fillRect(px, dy, 1, 1);
                    }
                }
                // Glossy highlight.
                sg.fillStyle(0xffffff, 0.7);
                sg.fillRect(-Math.round(r / 2), -Math.round(r / 2), 2, 2);
            };
            swatch.setSize(r * 2 + 6, rowH);
            swatch.setInteractive({ useHandCursor: true });
            swatch.on('pointerup', () => this.choosePaint(paint));
            swatch.paint = paint;
            return swatch;
        });
        this.refreshSwatches();
    }

    choosePaint(paint) {
        this.paint = paint;
        playPat(this);
        this.refreshSwatches();
        PixelUI.hop(this, this.selectedSwatch, this.selectedSwatch.baseY, S(3), { duration: 80 });
    }

    refreshSwatches() {
        this.swatches.forEach((s) => {
            const selected = s.paint.id === this.paint.id;
            s.draw(selected);
            if (selected) {
                this.selectedSwatch = s;
            }
        });
    }

    goToMap() {
        this.registry.set('mapLocation', 'studio');
        PixelUI.fadeTo(this, 'MapScene');
    }
}
