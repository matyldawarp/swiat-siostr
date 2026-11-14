import { PALETTE, PixelUI, S } from '../ui/pixel.js';
import { addCharacter, paintPixels } from '../gfx/hamster.js';
import { ICON_COLORS, Icons } from '../gfx/icons.js';
import { floatAway, floatHeart } from '../ui/effects.js';
import { addCatElevator } from '../ui/catElevator.js';
import { playNotes, playPlop, playSparkle } from '../audio/sfx.js';
import { BaseScene } from './BaseScene.js';

const C = {
    wall: 0xfdfaf6,
    floor: 0xf0dcc0,
    floorLine: 0xe2c9a8,
    cork: 0xe0bf94,
    corkDot: 0xcfa878,
    paper: 0xffffff,
    shelf: 0xfff09a,
    shelfDark: 0xf6d98b,
    table: 0xffffff,
    tableBase: 0x9fc4ee
};
const BEADS = [0xf28aa5, 0xffc08a, 0xfff09a, 0x7fcf9a, 0x9fd0f5, 0xc3b3ea, 0xf7b2cc];
// The glitter paints on the shelves; 'rainbow' changes colour as you paint.
const PAINTS = [0xf59bbd, 0xffb37a, 0xffe066, 0x8fd9a0, 0x8cc4f2, 0xc3a6f0, 0xffd27a, 'rainbow'];
const RAINBOW = [0xf59bbd, 0xffb37a, 0xffe066, 0x8fd9a0, 0x8cc4f2, 0xc3a6f0];
const BRUSH = 4;
const POMPOM_SLOTS = 4;
const PAINT_KEY = 'craft-painting';

// Tekturzątko (Baby Box): a cardboard box cat with a pink lid and ears, a cream face and a
// blue body with glitter dots.
const BOX_PIXELS = [
    '.OO..........OO.',
    '.OKO........OKO.',
    '.OPPOOOOOOOOPPO.',
    '.OPPPPPPPPPPPPO.',
    '.OPPCPPCCPPCPPO.',
    '.OCCCCCCCCCCCCO.',
    '.OCCECCCCCCECCO.',
    '.OCKCCCEECCCKCO.',
    '.OCCCCECCECCCCO.',
    '.OCCCCCEECCCCCO.',
    '.OOOOOOOOOOOOOO.',
    '..OBBGBBBBYBBO..',
    '..OBBBBMBBBBBO..',
    '..OBYBBBBBGBBO..',
    '..OBBBBBBBBBBO..',
    '..OOOOOOOOOOOO..'
];
const BOX_COLORS = {
    O: PALETTE.outline, E: PALETTE.outline, P: 0xf7b2d8, K: 0xfbd3e8, C: 0xfff1e0,
    B: 0x9fe0ec, G: 0xc3a6f0, Y: 0xffe08a, M: 0x9fe6a8
};

// Tekturzątko's craft room in Gabi's house. Paint on the cork board with glittery paints
// (pick a bottle on the yellow shelves, paint with a finger, the paper icon starts a new
// sheet), make pompom friends on the table (the basket gives a pompom, taps give it eyes
// and then ears, after that it hops), and jingle the bead garlands. The cat elevator on
// the right rides to the other rooms.
export class GabiCraftScene extends BaseScene {
    constructor() {
        super('GabiCraftScene');
    }

    init(data) {
        super.init(data);
        this.character = this.selectedCharacter();
        this.paint = PAINTS[0];
        this.rainbowStep = 0;
        this.lastPoint = null;
        this.pompoms = [];
        // A fresh sheet on every visit; a resize keeps the picture.
        if (!data.resized && this.textures.exists(PAINT_KEY)) {
            this.textures.remove(PAINT_KEY);
        }
    }

    build({ width, height }) {
        this.floorY = Math.round(height * 0.8);
        this.drawRoom();
        this.createGarlands(width);
        this.createCanvas();
        this.createPaintShelves();
        this.createTable(Math.round(width * 0.6));

        this.charGroundY = this.floorY + S(30);
        const char = addCharacter(this, this.character, Math.round(width * 0.1), this.charGroundY, {
            depth: 20,
            onTap: () => this.happy(this.char, this.charGroundY, () => playNotes(this, [{ freq: 784, duration: 0.15 }], 'triangle', 0.1))
        });
        this.char = char.container;
        this.createBox(Math.round(width * 0.79));
        addCatElevator(this, width - S(30), this.floorY, { rider: this.char });
    }

    // Hop with a heart and a sound: the answer to tapping someone.
    happy(target, groundY, sound) {
        sound();
        floatHeart(this, target.x, target.y - S(30), { depth: 30 });
        PixelUI.hop(this, target, groundY, S(5));
    }

    // --- Room -------------------------------------------------------------------

    drawRoom() {
        const b = this.view.bleed;
        const g = this.add.graphics();
        g.fillStyle(C.wall, 1);
        g.fillRect(b.x, b.y, b.width, this.floorY - b.y);
        g.fillStyle(C.floor, 1);
        g.fillRect(b.x, this.floorY, b.width, b.y + b.height - this.floorY);
        g.fillStyle(C.floorLine, 1);
        for (let y = this.floorY + S(10); y < b.y + b.height; y += S(12)) {
            g.fillRect(b.x, y, b.width, 1);
        }
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(b.x, this.floorY, b.width, 1);
    }

    // Two strings of beads across the top; a tap makes them swing and jingle.
    createGarlands(width) {
        [[S(10), S(14), 0], [S(22), S(12), 3]].forEach(([y, sag, shift], n) => {
            const garland = this.add.container(0, 0);
            const g = this.add.graphics();
            const bead = S(4);
            for (let x = -S(10), i = shift; x < width + S(10); x += bead * 2 + 1, i++) {
                const t = (x / width) * Math.PI;
                const by = Math.round(y + Math.sin(t) * sag);
                g.fillStyle(PALETTE.outline, 1);
                PixelUI.fillCircle(g, x, by, bead + 1);
                g.fillStyle(BEADS[i % BEADS.length], 1);
                PixelUI.fillCircle(g, x, by, bead);
                g.fillStyle(0xffffff, 1);
                g.fillRect(x - 1, by - 2, 1, 1);
            }
            garland.add(g);
            this.add.zone(0, y - S(6), width, sag + S(14)).setOrigin(0).setInteractive({ useHandCursor: true }).on('pointerup', () => {
                playNotes(this, [0, 1, 2, 3].map((k) => ({ freq: [1319, 1568, 1760, 2093][(k + n) % 4], duration: 0.12 })), 'sine', 0.07);
                this.tweens.add({ targets: garland, y: S(3), duration: 120, yoyo: true, repeat: 1, ease: 'Sine.easeInOut' });
            });
        });
    }

    // --- Painting ---------------------------------------------------------------

    // Cork board with a frame of buttons and cat ears, holding a sheet to paint on.
    createCanvas() {
        const frame = { x: S(26), y: S(46), w: S(146), h: S(118) };
        const g = this.add.graphics();
        [frame.x + S(16), frame.x + frame.w - S(16)].forEach((ex, i) => {
            const side = i ? 1 : -1;
            const ear = [{ x: ex - S(14), y: frame.y + 2 }, { x: ex + side * S(4), y: frame.y - S(14) }, { x: ex + S(14), y: frame.y + 2 }];
            g.fillStyle(PALETTE.outline, 1);
            Icons.fillPolygon(g, Icons.grow(ear, 1.5));
            g.fillStyle(0xc3a6f0, 1);
            Icons.fillPolygon(g, ear);
        });
        PixelUI.drawBox(g, frame.x, frame.y, frame.w, frame.h, C.cork, PALETTE.outline);
        g.fillStyle(C.corkDot, 1);
        for (let i = 0; i < 120; i++) {
            g.fillRect(frame.x + 3 + ((i * 37) % (frame.w - 6)), frame.y + 3 + ((i * 53) % (frame.h - 6)), 1, 1);
        }
        // Buttons around the edge.
        let i = 0;
        const button = (bx, by) => {
            g.fillStyle(PALETTE.outline, 1);
            PixelUI.fillCircle(g, bx, by, S(3) + 1);
            g.fillStyle(BEADS[i++ % BEADS.length], 1);
            PixelUI.fillCircle(g, bx, by, S(3));
            g.fillStyle(PALETTE.outline, 1);
            g.fillRect(bx - 1, by, 1, 1);
            g.fillRect(bx + 1, by, 1, 1);
        };
        for (let x = frame.x + S(6); x < frame.x + frame.w - S(3); x += S(10)) {
            button(x, frame.y + S(5));
            button(x, frame.y + frame.h - S(5));
        }
        for (let y = frame.y + S(15); y < frame.y + frame.h - S(10); y += S(10)) {
            button(frame.x + S(5), y);
            button(frame.x + frame.w - S(5), y);
        }

        // The sheet: a canvas texture with one texel per game pixel, so paint stays blocky.
        const sheet = { x: frame.x + S(11), y: frame.y + S(11), w: frame.w - S(22), h: frame.h - S(22) };
        this.sheet = sheet;
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(sheet.x - 1, sheet.y - 1, sheet.w + 2, sheet.h + 2);
        if (!this.textures.exists(PAINT_KEY)) {
            const texture = this.textures.createCanvas(PAINT_KEY, sheet.w, sheet.h);
            this.clearSheet(texture);
        }
        this.paintTexture = this.textures.get(PAINT_KEY);
        this.add.image(sheet.x, sheet.y, PAINT_KEY).setOrigin(0);

        const zone = this.add.zone(sheet.x, sheet.y, sheet.w, sheet.h).setOrigin(0).setInteractive();
        zone.on('pointerdown', (p) => this.paintAt(p.worldX, p.worldY, true));
        zone.on('pointermove', (p) => {
            if (p.isDown) {
                this.paintAt(p.worldX, p.worldY, false);
            }
        });
        this.input.on('pointerup', () => {
            this.lastPoint = null;
        });
    }

    clearSheet(texture = this.paintTexture) {
        const ctx = texture.getContext();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, texture.width, texture.height);
        texture.refresh();
    }

    // Paints from the last point to (x, y) with round, blocky dabs; every dab gets a few
    // glitter specks, and now and then a sparkle twinkles above the sheet.
    paintAt(x, y, start) {
        const px = Math.round(x - this.sheet.x);
        const py = Math.round(y - this.sheet.y);
        const from = start || !this.lastPoint ? { x: px, y: py } : this.lastPoint;
        const ctx = this.paintTexture.getContext();
        const steps = Math.max(1, Math.ceil(Math.hypot(px - from.x, py - from.y) / 2));
        for (let i = 1; i <= steps; i++) {
            this.dab(ctx, Math.round(from.x + ((px - from.x) * i) / steps), Math.round(from.y + ((py - from.y) * i) / steps));
        }
        this.paintTexture.refresh();
        this.lastPoint = { x: px, y: py };
        if (start || Math.random() < 0.08) {
            this.twinkle(x, y);
        }
    }

    dab(ctx, cx, cy) {
        let color = this.paint;
        if (color === 'rainbow') {
            color = RAINBOW[Math.floor(this.rainbowStep++ / 6) % RAINBOW.length];
        }
        ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        for (let dy = -BRUSH; dy <= BRUSH; dy++) {
            const dx = Math.round(Math.sqrt(BRUSH * BRUSH - dy * dy));
            ctx.fillRect(cx - dx, cy + dy, dx * 2 + 1, 1);
        }
        // Glitter: light specks scattered in the paint.
        ctx.fillStyle = Math.random() < 0.5 ? '#ffffff' : '#fff6c8';
        for (let i = 0; i < 2; i++) {
            ctx.fillRect(cx + Phaser.Math.Between(-BRUSH + 1, BRUSH - 1), cy + Phaser.Math.Between(-BRUSH + 1, BRUSH - 1), 1, 1);
        }
    }

    // A little four-point star that shines and fades.
    twinkle(x, y) {
        const g = this.add.graphics().setDepth(30).setPosition(x + Phaser.Math.Between(-S(6), S(6)), y + Phaser.Math.Between(-S(6), S(6)));
        g.fillStyle(0xffffff, 1);
        g.fillRect(-S(3), 0, S(6) + 1, 1);
        g.fillRect(0, -S(3), 1, S(6) + 1);
        g.fillStyle(0xfff09a, 1);
        g.fillRect(-1, -1, 3, 3);
        floatAway(this, g, { dy: -S(6), duration: 600, steps: 4 });
    }

    // Yellow shelves of glitter paint bottles: tap one to paint with it. Below them, a fresh
    // sheet of paper starts a new picture.
    createPaintShelves() {
        const left = this.sheet.x + this.sheet.w + S(30);
        const step = S(26);
        const g = this.add.graphics();
        this.bottles = [];
        [0, 1].forEach((row) => {
            const shelfY = S(92) + row * S(46);
            PixelUI.drawBox(g, left - S(6), shelfY, step * 4 + S(4), S(6), C.shelf, PALETTE.outline);
            g.fillStyle(C.shelfDark, 1);
            g.fillRect(left - S(4), shelfY + S(4), step * 4, 2);
            for (let i = 0; i < 4; i++) {
                const paint = PAINTS[row * 4 + i];
                const bottle = this.add.container(left + i * step + S(9), shelfY).setDepth(6);
                bottle.baseY = shelfY;
                const bg = this.add.graphics();
                this.drawBottle(bg, paint);
                bottle.add(bg);
                // The whole bottle and its cap, as drawn above the shelf.
                this.add.zone(bottle.x - S(12), shelfY - S(34), S(24), S(36)).setOrigin(0)
                    .setInteractive({ useHandCursor: true })
                    .on('pointerup', () => this.pickPaint(paint, bottle));
                this.bottles.push({ paint, bottle });
            }
        });

        // New sheet, under the board: a white page with a sparkle.
        const x = this.sheet.x + Math.round(this.sheet.w / 2);
        const y = this.sheet.y + this.sheet.h + S(36);
        PixelUI.createIconButton(this, x, y, S(32), (ig, size) => {
            const w = Math.round(size * 0.6);
            const h = Math.round(size * 0.8);
            PixelUI.drawBox(ig, -w / 2, -h / 2, w, h, 0xffffff, PALETTE.outline);
            Icons.star(ig, Math.round(w * 0.2), -Math.round(h * 0.15), Math.round(size * 0.18));
        }, () => {
            playSparkle(this);
            this.clearSheet();
            for (let i = 0; i < 5; i++) {
                this.twinkle(this.sheet.x + Phaser.Math.Between(0, this.sheet.w), this.sheet.y + Phaser.Math.Between(0, this.sheet.h));
            }
        });

        this.marker = this.add.graphics().setDepth(5);
        this.pickPaint(this.paint, this.bottles[0].bottle, true);
    }

    // A round glitter bottle with a cat face, standing on (0, 0).
    drawBottle(g, paint) {
        const color = paint === 'rainbow' ? 0xffffff : paint;
        const w = S(18);
        const h = S(22);
        PixelUI.drawBox(g, -w / 2, -h, w, h, color, PALETTE.outline);
        if (paint === 'rainbow') {
            RAINBOW.forEach((c, i) => {
                g.fillStyle(c, 1);
                g.fillRect(-w / 2 + 2, -h + 2 + Math.round((i * (h - 4)) / RAINBOW.length), w - 4, Math.ceil((h - 4) / RAINBOW.length));
            });
        }
        // Cap with cat ears.
        PixelUI.drawBox(g, -S(6), -h - S(7), S(12), S(8), color === 0xffffff ? 0xf7b2cc : color, PALETTE.outline);
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(-S(5), -h - S(10), S(2), S(3));
        g.fillRect(S(3), -h - S(10), S(2), S(3));
        // Sleepy face and glitter.
        g.fillRect(-S(4), -h + S(8), S(3), 1);
        g.fillRect(S(2), -h + S(8), S(3), 1);
        g.fillStyle(0xffffff, 1);
        [[-5, -4], [4, -12], [-2, -15], [5, -6]].forEach(([dx, dy]) => g.fillRect(S(dx), S(dy), 1, 1));
    }

    pickPaint(paint, bottle, quiet = false) {
        this.paint = paint;
        if (!quiet) {
            playNotes(this, [{ freq: 1175, duration: 0.1 }, { freq: 1568, duration: 0.18 }], 'sine', 0.08);
            PixelUI.hop(this, bottle, bottle.baseY, S(4), { duration: 90 });
        }
        // A soft glow behind the chosen bottle.
        this.marker.clear();
        PixelUI.drawBox(this.marker, bottle.x - S(12), bottle.baseY - S(36), S(24), S(36), 0xffffff, ICON_COLORS.pinkDark);
    }

    // --- Pompoms ----------------------------------------------------------------

    // Round white table on a blue stand, with a basket of pompoms on the left.
    createTable(cx) {
        const top = this.floorY - S(26);
        const w = S(112);
        this.table = { cx, top, left: Math.round(cx - w / 2), w };
        const g = this.add.graphics();
        PixelUI.drawBox(g, cx - S(16), top + S(6), S(32), this.floorY - top - S(4), C.tableBase, PALETTE.outline);
        PixelUI.drawBox(g, cx - S(26), this.floorY - S(4), S(52), S(8), C.tableBase, PALETTE.outline);
        PixelUI.drawBox(g, this.table.left, top, w, S(8), C.table, PALETTE.outline);

        // Basket full of pompoms.
        const bx = this.table.left + S(16);
        const basket = this.add.container(bx, top);
        const bg = this.add.graphics();
        [[-S(6), -S(14)], [S(5), -S(15)], [0, -S(19)], [-S(9), -S(19)], [S(9), -S(20)]].forEach(([dx, dy], i) => {
            this.drawFluff(bg, dx, dy, S(5), BEADS[i]);
        });
        PixelUI.drawBox(bg, -S(14), -S(13), S(28), S(13), 0xf3c9a0, PALETTE.outline);
        bg.fillStyle(0xe0ad80, 1);
        for (let x = -S(12); x < S(12); x += S(4)) {
            bg.fillRect(x, -S(11), 1, S(9));
        }
        basket.add(bg);
        // The basket and the pompoms on top, as drawn on the table.
        this.add.zone(bx - S(16), top - S(28), S(32), S(30)).setOrigin(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.newPompom(basket));
        this.basket = basket;
        PixelUI.pulse(this, basket, 0.06);
    }

    // Fluffy ball: a circle with a ragged edge and lighter tufts.
    drawFluff(g, cx, cy, r, color) {
        g.fillStyle(PALETTE.outline, 1);
        PixelUI.fillCircle(g, cx, cy, r + 1);
        g.fillStyle(color, 1);
        PixelUI.fillCircle(g, cx, cy, r);
        const light = Phaser.Display.Color.IntegerToColor(color).lighten(12).color;
        g.fillStyle(light, 1);
        for (let i = 0; i < r * 2; i++) {
            const a = (i * 2.4) % (Math.PI * 2);
            const d = (i * 0.37 * r) % r;
            g.fillRect(Math.round(cx + Math.cos(a) * d), Math.round(cy + Math.sin(a) * d), 1, 1);
        }
    }

    // A pompom jumps out of the basket onto the table; with the table full, the oldest
    // pompom friend hops away to make room.
    newPompom(basket) {
        PixelUI.hop(this, basket, this.table.top, S(3), { duration: 80 });
        const used = this.pompoms.map((p) => p.slot);
        let slot = [...Array(POMPOM_SLOTS).keys()].find((s) => !used.includes(s));
        if (slot === undefined) {
            const oldest = this.pompoms.shift();
            slot = oldest.slot;
            this.tweens.killTweensOf(oldest.container);
            floatAway(this, oldest.container, { dx: S(30), dy: -S(40), duration: 600 });
        }
        const x = this.table.left + S(40) + slot * S(22);
        const groundY = this.table.top - S(9);
        const pompom = {
            slot,
            color: Phaser.Utils.Array.GetRandom(BEADS),
            stage: 0,
            groundY,
            container: this.add.container(basket.x, this.table.top - S(20)).setDepth(10),
            g: this.add.graphics()
        };
        pompom.container.add(pompom.g);
        pompom.container.setSize(S(22), S(22));
        pompom.container.setInteractive({ useHandCursor: true });
        pompom.container.on('pointerup', () => this.decorate(pompom));
        this.drawPompom(pompom);
        this.pompoms.push(pompom);

        playPlop(this);
        this.tweens.add({ targets: pompom.container, x, duration: 450, ease: 'Linear' });
        this.tweens.add({
            targets: pompom.container,
            y: { from: this.table.top - S(40), to: groundY },
            duration: 450,
            ease: 'Bounce.easeOut'
        });
    }

    // Stage 0 is a plain pompom, 1 has googly eyes, 2 also has ears and a smile.
    drawPompom({ g, color, stage }) {
        g.clear();
        const r = S(8);
        if (stage >= 2) {
            [-1, 1].forEach((side) => {
                const ear = [{ x: side * r * 0.9, y: -r * 0.3 }, { x: side * r * 0.8, y: -r * 1.4 }, { x: side * r * 0.15, y: -r * 0.85 }];
                g.fillStyle(PALETTE.outline, 1);
                Icons.fillPolygon(g, Icons.grow(ear, 1.5));
                g.fillStyle(color, 1);
                Icons.fillPolygon(g, ear);
            });
        }
        this.drawFluff(g, 0, 0, r, color);
        if (stage >= 1) {
            [-1, 1].forEach((side) => {
                const ex = side * S(3);
                g.fillStyle(PALETTE.outline, 1);
                PixelUI.fillCircle(g, ex, -S(2), S(3));
                g.fillStyle(0xffffff, 1);
                PixelUI.fillCircle(g, ex, -S(2), S(2));
                g.fillStyle(PALETTE.outline, 1);
                g.fillRect(ex, -S(2), S(2), S(2));
            });
        }
        if (stage >= 2) {
            g.fillStyle(PALETTE.outline, 1);
            g.fillRect(-S(2), S(3), 1, 1);
            g.fillRect(-S(1), S(4), S(2) + 1, 1);
            g.fillRect(S(2), S(3), 1, 1);
            g.fillStyle(ICON_COLORS.pinkDark, 1);
            g.fillRect(-S(5), S(2), S(2), 1);
            g.fillRect(S(4), S(2), S(2), 1);
        }
    }

    // Each tap makes the pompom more of a friend; a finished one hops and squeaks.
    decorate(pompom) {
        const pitch = 600 + BEADS.indexOf(pompom.color) * 90;
        if (pompom.stage < 2) {
            pompom.stage++;
            this.drawPompom(pompom);
            playSparkle(this);
        } else {
            playNotes(this, [{ freq: pitch, duration: 0.08 }, { freq: pitch * 1.5, duration: 0.12 }], 'triangle', 0.12);
            floatHeart(this, pompom.container.x, pompom.container.y - S(16), { depth: 30 });
        }
        PixelUI.hop(this, pompom.container, pompom.groundY, S(pompom.stage === 2 ? 10 : 4), { duration: 140 });
    }

    // --- Tekturzątko --------------------------------------------------------------

    createBox(x) {
        paintPixels(this, 'baby-box', BOX_PIXELS, BOX_COLORS);
        this.boxGroundY = this.floorY + S(26);
        this.box = this.add.container(x, this.boxGroundY).setDepth(20);
        const image = this.add.image(0, 0, 'baby-box').setScale(4).setInteractive({ useHandCursor: true });
        this.box.add(image);
        image.on('pointerup', () => this.happy(this.box, this.boxGroundY, () => {
            playNotes(this, [{ freq: 659, duration: 0.1 }, { freq: 880, duration: 0.1 }, { freq: 659, duration: 0.1 }, { freq: 1047, duration: 0.18 }], 'triangle', 0.1);
        }));
    }
}
