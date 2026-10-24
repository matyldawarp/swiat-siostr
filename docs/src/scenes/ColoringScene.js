import { PALETTE, PixelUI, RENDER_SCALE, S, TEXT_COLORS, textStyle } from '../ui/pixel.js';
import { ICON_COLORS, Icons } from '../gfx/icons.js';
import { COLORING_PAGES, coloringImage, coloringOriginal, getColoringPage } from '../data/coloring.js';
import { PAINTS, PaintLayer, areaAt, makeLineArt, pageAreas, paintColor, preparePrint, printBlankPage } from '../gfx/coloring.js';
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
// Its painting so far, as a list of steps (fills and brush strokes, see PaintLayer.render),
// in the registry only: it survives a rebuild (e.g. turning the iPad) but not leaving the
// page or closing the game. Every page starts blank when opened. Undo takes the last step.
const STEPS_KEY = 'coloringSteps';
// A brush stroke gets a heart at the end once it is this long (page pixels).
const LONG_STROKE = 80;

// The areas (SVG text) and the original picture whose lines are shown.
const areasKey = (page) => `coloring-areas-${page.id}`;
const originalTexture = (page) => `coloring-original-${page.id}`;
const lineArt = (scene, page) => makeLineArt(scene, page, originalTexture(page), page.make?.blank);
const areasOf = (scene, page) => pageAreas(page.id, scene.cache.text.get(areasKey(page)));

// The art studio. First a shelf with a card per coloring page; tapping one opens it.
// Coloring works like a paint book: pick a paint on the right (solid colors, then rainbow,
// dots and glitter) and a tool on the left. With the bucket, tapping an area of the
// picture makes the paint flow into it up to the lines; with the brush, a finger paints a
// thick line that stays inside the area it started in. The curved arrow undoes, the house
// goes back to the shelf, and the printer (bottom left) prints the blank page on paper.
// Colors aren't kept: a page opens blank every time.
export class ColoringScene extends BaseScene {
    constructor() {
        super('ColoringScene');
    }

    preload() {
        COLORING_PAGES.forEach((page) => {
            if (!this.cache.text.exists(areasKey(page))) {
                this.load.text(areasKey(page), coloringImage(page));
            }
            if (!this.textures.exists(originalTexture(page))) {
                this.load.image(originalTexture(page), coloringOriginal(page));
            }
        });
    }

    init(data) {
        super.init(data);
        this.page = getColoringPage(this.registry.get(PAGE_KEY));
        this.paint = this.paint || PAINTS[0];
        // 'fill' (bucket) or 'brush'; like the paint, kept while the game runs.
        this.tool = this.tool || 'fill';
        this.busy = false;
        this.stroke = null;
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

    // A card with the blank page (shrunk smoothly) and its title.
    createCard(page, x, y, w, h) {
        const g = this.add.graphics();
        PixelUI.drawBox(g, x, y, w, h, ICON_COLORS.white, PALETTE.buttonBorder, 0xffffff);

        const info = areasOf(this, page);
        const lines = this.textures.get(lineArt(this, page)).getSourceImage();

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
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, tw, th);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(lines, 0, 0, tw, th);
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
        this.registry.set(STEPS_KEY, []);
        this.scene.restart({ resized: true });
    }

    backToShelf() {
        playStep(this);
        this.registry.set(PAGE_KEY, null);
        this.registry.set(STEPS_KEY, []);
        this.scene.restart({ resized: true });
    }

    // --- Coloring a page ----------------------------------------------------------------

    buildPage(width, height) {
        const panelW = S(84);
        const info = areasOf(this, this.page);
        this.info = info;
        // The same array stays in the registry, so steps added below survive a rebuild.
        if (!this.registry.get(STEPS_KEY)) {
            this.registry.set(STEPS_KEY, []);
        }
        this.steps = this.registry.get(STEPS_KEY);

        // The page on a colored mat, between the tool buttons and the paint panel.
        const button = S(30);
        const toolsX = S(6) + button / 2;
        const left = S(40);
        const right = width - panelW - S(8);
        const px = left + Math.round((right - left - info.width) / 2);
        const py = Math.round((height - info.height) / 2);
        const mat = this.add.graphics();
        PixelUI.drawBox(mat, px - S(8), py - S(6), info.width + S(16), info.height + S(12), STUDIO_COLORS.mat, PALETTE.outline);
        this.pageRect = { x: px, y: py };

        // Paint at the screen's own resolution, so area edges are smooth.
        const key = `coloring-canvas-${this.page.id}`;
        this.layer = new PaintLayer(this, key, info, Math.max(1, Math.ceil(RENDER_SCALE)));
        this.layer.render(this.steps);

        const picture = this.add.image(px, py, key).setOrigin(0).setDisplaySize(info.width, info.height);
        picture.setInteractive({ useHandCursor: true });
        picture.on('pointerdown', (pointer) => {
            const x = pointer.worldX - px;
            const y = pointer.worldY - py;
            if (this.tool === 'brush') {
                this.startStroke(pointer, x, y);
            } else {
                this.fillAt(x, y);
            }
        });
        // The brush follows the finger anywhere; paint stays clipped to its area anyway.
        this.input.on('pointermove', (pointer) => this.moveStroke(pointer, pointer.worldX - px, pointer.worldY - py));
        this.input.on('pointerup', (pointer) => this.endStroke(pointer));
        this.input.on('pointerupoutside', (pointer) => this.endStroke(pointer));
        // The original drawing's lines over the paint, smoothly scaled to the page.
        this.add.image(px, py, lineArt(this, this.page)).setOrigin(0).setDisplaySize(info.width, info.height);

        // Below the music and reload buttons in the top-right corner (OverlayScene).
        const panelTop = S(34);
        this.createPanel(width - panelW - S(4), panelTop, panelW, height - panelTop - S(4));

        // Tools on the left, level with the top of the panel; the printer at the bottom.
        const toolY = panelTop + S(6) + button / 2;
        this.toolButtons = [
            this.createToolButton('fill', toolsX, toolY, button, Icons.bucket),
            this.createToolButton('brush', toolsX, toolY + button + S(8), button, Icons.brush)
        ];
        this.refreshTools();
        preparePrint(this, originalTexture(this.page), this.page.make?.blank, this.page.id);
        this.printButton = PixelUI.createIconButton(this, toolsX, height - S(6) - button / 2, button,
            (gfx, size) => Icons.printer(gfx, 0, 0, size), () => this.print());
        this.printButton.baseY = this.printButton.y;
    }

    // The paint an area is filled with, or null when brush strokes went over it since.
    currentFill(area) {
        for (let i = this.steps.length - 1; i >= 0; i--) {
            const step = this.steps[i];
            if (step.area === area) {
                return step.points ? null : step.paint;
            }
        }
        return null;
    }

    // The tapped area fills with the chosen paint, spreading out from the finger.
    fillAt(x, y) {
        const info = this.info;
        if (this.busy || x < 0 || y < 0 || x >= info.width || y >= info.height) {
            return;
        }
        const area = areaAt(info, x, y);
        if (area < 0 || this.currentFill(area) === this.paint.id) {
            // Already this color: a little bounce of the chosen paint says so.
            PixelUI.hop(this, this.selectedSwatch, this.selectedSwatch.baseY, S(3), { duration: 80 });
            return;
        }

        this.steps.push({ area, paint: this.paint.id });
        playPlop(this);

        // A growing circle of paint from the finger, clipped to the area, over a few frames.
        const { box } = info.areas[area];
        const reach = Math.max(...[[box.x1, box.y1], [box.x2, box.y1], [box.x1, box.y2], [box.x2, box.y2]]
            .map(([cx, cy]) => Math.hypot(cx - x, cy - y)));
        const big = (box.x2 - box.x1) * (box.y2 - box.y1) > 600;
        const steps = big ? 10 : 3;
        const paint = this.paint;
        this.busy = true;
        let step = 0;
        this.time.addEvent({
            delay: 25,
            repeat: steps - 1,
            callback: () => {
                step++;
                const last = step === steps;
                this.layer.fill(area, paint, last ? null : { x, y, r: (reach * step) / steps });
                this.layer.refresh();
                if (last) {
                    this.busy = false;
                    if (big) {
                        playSparkle(this);
                        floatHeart(this, this.pageRect.x + x, this.pageRect.y + y - S(6), { depth: 30, rise: S(18), duration: 600 });
                    }
                }
            }
        });
    }

    // Brush: the line stays in the area under the finger where it started.
    startStroke(pointer, x, y) {
        const area = this.busy || this.stroke ? -1 : areaAt(this.info, x, y);
        if (area < 0) {
            return;
        }
        const round = (n) => Math.round(n * 10) / 10;
        this.stroke = { pointerId: pointer.id, area, paint: this.paint.id, points: [round(x), round(y)], length: 0 };
        this.steps.push({ area, paint: this.paint.id, points: this.stroke.points });
        this.layer.stroke(area, this.paint, this.stroke.points);
        this.layer.refresh();
        playPat(this);
    }

    moveStroke(pointer, x, y) {
        const stroke = this.stroke;
        if (!stroke || pointer.id !== stroke.pointerId || !pointer.isDown) {
            return;
        }
        const points = stroke.points;
        const moved = Math.hypot(x - points[points.length - 2], y - points[points.length - 1]);
        if (moved < 2) {
            return;
        }
        stroke.length += moved;
        points.push(Math.round(x * 10) / 10, Math.round(y * 10) / 10);
        this.layer.stroke(stroke.area, this.paint, points, points.length / 2 - 1);
        this.layer.refresh();
    }

    endStroke(pointer) {
        const stroke = this.stroke;
        if (!stroke || pointer.id !== stroke.pointerId) {
            return;
        }
        this.stroke = null;
        if (stroke.length >= LONG_STROKE) {
            const points = stroke.points;
            playSparkle(this);
            floatHeart(this, this.pageRect.x + points[points.length - 2], this.pageRect.y + points[points.length - 1] - S(6),
                { depth: 30, rise: S(18), duration: 600 });
        }
    }

    undo() {
        if (this.steps.length === 0 || this.busy || this.stroke) {
            PixelUI.hop(this, this.undoButton, this.undoButton.baseY, S(3), { duration: 80 });
            return;
        }
        this.steps.pop();
        // Drawn again from scratch, so no trace of the undone paint stays at the edges.
        this.layer.render(this.steps);
        playStep(this);
    }

    // The blank page on paper, to color with crayons (prepared in buildPage).
    print() {
        printBlankPage();
        playSparkle(this);
        PixelUI.hop(this, this.printButton, this.printButton.baseY, S(3), { duration: 80 });
    }

    // --- Tools --------------------------------------------------------------------------

    // A big square button showing the tool in the chosen paint; the tool in use is lit up
    // and framed in white.
    createToolButton(tool, x, y, size, drawIcon) {
        const g = this.add.graphics();
        const button = this.add.container(x, y, [g]);
        button.baseY = y;
        button.tool = tool;
        button.draw = (selected) => {
            g.clear();
            if (selected) {
                g.fillStyle(PALETTE.buttonBorder, 1);
                g.fillRect(-size / 2 - 4, -size / 2 - 4, size + 8, size + 8);
                g.fillStyle(0xffffff, 1);
                g.fillRect(-size / 2 - 3, -size / 2 - 3, size + 6, size + 6);
            }
            PixelUI.drawBox(g, -size / 2, -size / 2, size, size, selected ? PALETTE.buttonHover : PALETTE.button,
                PALETTE.buttonBorder, PALETTE.buttonLight);
            drawIcon(g, 0, 0, Math.round(size * 0.7), paintColor(this.paint, 0, 0));
        };
        button.setSize(size, size);
        button.setInteractive({ useHandCursor: true });
        button.on('pointerup', () => this.chooseTool(tool));
        return button;
    }

    chooseTool(tool) {
        this.tool = tool;
        playPat(this);
        this.refreshTools();
        const button = this.toolButtons.find((b) => b.tool === tool);
        PixelUI.hop(this, button, button.baseY, S(3), { duration: 80 });
    }

    refreshTools() {
        this.toolButtons.forEach((b) => b.draw(b.tool === this.tool));
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
        this.refreshTools();
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
