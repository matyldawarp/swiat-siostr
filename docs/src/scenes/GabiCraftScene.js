import { PALETTE, PixelUI, S } from '../ui/pixel.js';
import { addCharacter } from '../gfx/hamster.js';
import { addImage, addPattern, setImage } from '../gfx/images.js';
import { floatAway, floatHeart } from '../ui/effects.js';
import { addCatElevator } from '../ui/catElevator.js';
import { playNotes, playPlop, playSparkle } from '../audio/sfx.js';
import { BaseScene } from './BaseScene.js';

// Pictures of this scene: docs/assets/gfx/pracownia/.
const P = 'pracownia/';
const WALL = 0xfdfaf6;
// The glitter paints on the shelves, each with its bottle picture; 'rainbow' changes
// colour as you paint.
const PAINTS = [
    { color: 0xf59bbd, bottle: 'farba-rozowa' },
    { color: 0xffb37a, bottle: 'farba-pomaranczowa' },
    { color: 0xffe066, bottle: 'farba-zolta' },
    { color: 0x8fd9a0, bottle: 'farba-zielona' },
    { color: 0x8cc4f2, bottle: 'farba-niebieska' },
    { color: 0xc3a6f0, bottle: 'farba-fioletowa' },
    { color: 0xffd27a, bottle: 'farba-zlota' },
    { color: 'rainbow', bottle: 'farba-teczowa' }
];
const RAINBOW = [0xf59bbd, 0xffb37a, 0xffe066, 0x8fd9a0, 0x8cc4f2, 0xc3a6f0];
// Pompom colours (pictures pompon-<name>, -oczy with eyes, -uszy with ears too).
const POMPOM_COLORS = ['malinowy', 'brzoskwiniowy', 'zolty', 'zielony', 'niebieski', 'fioletowy', 'rozowy'];
const POMPOM_STAGES = ['', '-oczy', '-uszy'];
const BRUSH = 4;
const POMPOM_SLOTS = 4;
const PAINT_KEY = 'craft-painting';

// Tekturzątko's craft room in Gabi's house. Paint on the cork board with glittery paints
// (pick a bottle on the yellow shelves, paint with a finger, the paper icon starts a new
// sheet), make pompom friends on the table (the basket gives a pompom, taps give it eyes
// and then ears, after that it hops), and jingle the bead garlands. The cat elevator on
// the right rides to the other rooms. Tekturzątko (Baby Box) is a cardboard box cat.
export class GabiCraftScene extends BaseScene {
    constructor() {
        super('GabiCraftScene');
    }

    init(data) {
        super.init(data);
        this.character = this.selectedCharacter();
        this.paint = PAINTS[0].color;
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

    // Plain wall and a floor of boards over the whole window (view.bleed).
    drawRoom() {
        const b = this.view.bleed;
        this.add.rectangle(b.x, b.y, b.width, this.floorY - b.y, WALL).setOrigin(0);
        addPattern(this, b.x, this.floorY, b.width, b.y + b.height - this.floorY, P + 'podloga');
        this.add.rectangle(b.x, this.floorY, b.width, 1, PALETTE.outline).setOrigin(0);
    }

    // Two strings of beads across the top; a tap makes them swing and jingle.
    createGarlands(width) {
        [[S(10), S(14), 'girlanda-gorna'], [S(22), S(12), 'girlanda-dolna']].forEach(([y, sag, name], n) => {
            const garland = this.add.container(0, 0, [addImage(this, 0, 0, P + name)]);
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
        addImage(this, frame.x, frame.y, P + 'tablica');

        // The sheet: a canvas texture with one texel per game pixel, so paint stays blocky.
        const sheet = { x: frame.x + S(11), y: frame.y + S(11), w: frame.w - S(22), h: frame.h - S(22) };
        this.sheet = sheet;
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
        const star = addImage(this, Math.round(x) + Phaser.Math.Between(-S(6), S(6)), Math.round(y) + Phaser.Math.Between(-S(6), S(6)), P + 'iskierka').setDepth(30);
        floatAway(this, star, { dy: -S(6), duration: 600, steps: 4 });
    }

    // Yellow shelves of glitter paint bottles: tap one to paint with it. Below them, a fresh
    // sheet of paper starts a new picture.
    createPaintShelves() {
        const left = this.sheet.x + this.sheet.w + S(30);
        const step = S(26);
        this.marker = addImage(this, 0, 0, P + 'wybrana-farba').setDepth(5);
        this.bottles = [];
        [0, 1].forEach((row) => {
            const shelfY = S(92) + row * S(46);
            addImage(this, left - S(6), shelfY, P + 'polka');
            for (let i = 0; i < 4; i++) {
                const { color: paint, bottle: picture } = PAINTS[row * 4 + i];
                const bottle = this.add.container(left + i * step + S(9), shelfY, [addImage(this, 0, 0, P + picture)]).setDepth(6);
                bottle.baseY = shelfY;
                // The whole bottle and its cap, standing on the shelf.
                this.add.zone(bottle.x - S(12), shelfY - S(34), S(24), S(36)).setOrigin(0)
                    .setInteractive({ useHandCursor: true })
                    .on('pointerup', () => this.pickPaint(paint, bottle));
                this.bottles.push({ paint, bottle });
            }
        });

        // New sheet, under the board: a white page with a sparkle.
        const x = this.sheet.x + Math.round(this.sheet.w / 2);
        const y = this.sheet.y + this.sheet.h + S(36);
        PixelUI.createIconButton(this, x, y, S(32), 'ikony64/nowa-kartka', () => {
            playSparkle(this);
            this.clearSheet();
            for (let i = 0; i < 5; i++) {
                this.twinkle(this.sheet.x + Phaser.Math.Between(0, this.sheet.w), this.sheet.y + Phaser.Math.Between(0, this.sheet.h));
            }
        });

        this.pickPaint(this.paint, this.bottles[0].bottle, true);
    }

    pickPaint(paint, bottle, quiet = false) {
        this.paint = paint;
        if (!quiet) {
            playNotes(this, [{ freq: 1175, duration: 0.1 }, { freq: 1568, duration: 0.18 }], 'sine', 0.08);
            PixelUI.hop(this, bottle, bottle.baseY, S(4), { duration: 90 });
        }
        // A soft glow behind the chosen bottle.
        this.marker.setPosition(bottle.x - S(12), bottle.baseY - S(36));
    }

    // --- Pompoms ----------------------------------------------------------------

    // Round white table on a blue stand, with a basket of pompoms on the left.
    createTable(cx) {
        const top = this.floorY - S(26);
        const w = S(112);
        this.table = { cx, top, left: Math.round(cx - w / 2), w };
        addImage(this, cx, top, P + 'stol');

        // Basket full of pompoms.
        const bx = this.table.left + S(16);
        const basket = this.add.container(bx, top, [addImage(this, 0, 0, P + 'koszyk')]);
        // The basket and the pompoms on top, as drawn on the table.
        this.add.zone(bx - S(16), top - S(28), S(32), S(30)).setOrigin(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', () => this.newPompom(basket));
        this.basket = basket;
        PixelUI.pulse(this, basket, 0.06);
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
        const colorIndex = Phaser.Math.Between(0, POMPOM_COLORS.length - 1);
        const pompom = {
            slot,
            colorIndex,
            stage: 0,
            groundY,
            container: this.add.container(basket.x, this.table.top - S(20)).setDepth(10),
            image: addImage(this, 0, 0, `${P}pompon-${POMPOM_COLORS[colorIndex]}`)
        };
        pompom.container.add(pompom.image);
        pompom.container.setSize(S(22), S(22));
        pompom.container.setInteractive({ useHandCursor: true });
        pompom.container.on('pointerup', () => this.decorate(pompom));
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

    // Each tap makes the pompom more of a friend (googly eyes, then ears and a smile); a
    // finished one hops and squeaks.
    decorate(pompom) {
        const pitch = 600 + pompom.colorIndex * 90;
        if (pompom.stage < 2) {
            pompom.stage++;
            setImage(pompom.image, `${P}pompon-${POMPOM_COLORS[pompom.colorIndex]}${POMPOM_STAGES[pompom.stage]}`);
            playSparkle(this);
        } else {
            playNotes(this, [{ freq: pitch, duration: 0.08 }, { freq: pitch * 1.5, duration: 0.12 }], 'triangle', 0.12);
            floatHeart(this, pompom.container.x, pompom.container.y - S(16), { depth: 30 });
        }
        PixelUI.hop(this, pompom.container, pompom.groundY, S(pompom.stage === 2 ? 10 : 4), { duration: 140 });
    }

    // --- Tekturzątko --------------------------------------------------------------

    createBox(x) {
        this.boxGroundY = this.floorY + S(26);
        this.box = this.add.container(x, this.boxGroundY).setDepth(20);
        const image = addImage(this, 0, 0, P + 'tekturzatko').setScale(4).setInteractive({ useHandCursor: true });
        this.box.add(image);
        image.on('pointerup', () => this.happy(this.box, this.boxGroundY, () => {
            playNotes(this, [{ freq: 659, duration: 0.1 }, { freq: 880, duration: 0.1 }, { freq: 659, duration: 0.1 }, { freq: 1047, duration: 0.18 }], 'triangle', 0.1);
        }));
    }
}
