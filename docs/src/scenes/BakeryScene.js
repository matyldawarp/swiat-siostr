import { PALETTE, PixelUI, S } from '../ui/pixel.js';
import { CHARACTER_SCALE, addCharacter, spriteHalf } from '../gfx/hamster.js';
import { Icons } from '../gfx/icons.js';
import { floatHeart } from '../ui/effects.js';
import { Sweets } from '../ui/sweets.js';
import { playCharacterSound, playCrunch, playFanfare, playPlop, playSparkle } from '../audio/sfx.js';
import { BaseScene } from './BaseScene.js';

const BAKERY_COLORS = {
    wallA: 0xfff1e6,
    wallB: 0xffe8ef,
    counter: 0xf2d0b5,
    counterEdge: 0xe0b89a,
    front: 0xf7d6e4,
    frontDark: 0xf0c2d6,
    caseGlass: 0xeef8ff,
    caseShelf: 0xd9ccf5,
    plate: 0xffffff
};

// Cream colours on the first row of buttons; the sprinkles shaker comes after them.
const CREAMS = [0xf7b2cc, 0xd9ccf5, 0xbfe8d6, 0xfff1c9, 0xd8b39c];
// Toppings on the second row (keys of CAKE_TOPPINGS; npm run check verifies them).
export const BAKERY_TOPPINGS = ['cherry', 'strawberry', 'star', 'heart', 'candle'];

// Cupcakes on display, kept between visits on this device.
const SHELF_SIZE = 8;
const STORAGE_KEY = 'swiat-siostr-bakery-shelf';

function loadShelf() {
    try {
        const shelf = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(shelf) ? shelf.slice(0, SHELF_SIZE) : [];
    } catch {
        return [];
    }
}

function saveShelf(shelf) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(shelf));
    } catch {
        // Storage blocked: the display lasts until the page is closed.
    }
}

// The sweet shop: decorate a cupcake by tapping (cream, sprinkles, a topping, in any
// order), then the big heart puts it in the display case. Tapping a cupcake on display
// gives it to the character to eat. Nothing can go wrong; the next step pulses.
export class BakeryScene extends BaseScene {
    constructor() {
        super('BakeryScene');
    }

    init(data) {
        super.init(data);
        this.character = this.selectedCharacter();
        this.shelf = loadShelf();
        this.busy = false;
        this.hintTween = null;
        this.newCupcake();
    }

    newCupcake() {
        this.design = { cream: null, sprinkles: false, topping: null };
    }

    build({ width, height }) {
        this.counterTop = Math.round(height * 0.6);
        this.cupcakePos = { x: Math.round(width * 0.5), y: this.counterTop - S(4) };

        this.drawRoom(width);
        this.createDisplayCase(width);
        this.createCharacter(Math.round(width * 0.15));
        this.drawCounter(width, height);

        this.cupcake = this.add.graphics();
        this.drawCupcake();

        this.mapButton = PixelUI.createIconButton(this, S(24), height - S(24), S(32),
            (g, size) => Icons.map(g, 0, 0, size), () => this.goToMap());

        this.createButtons(width, height);
        this.updateHint();
    }

    // --- Room -------------------------------------------------------------------

    // Striped wallpaper over the whole window (view.bleed).
    drawRoom() {
        const C = BAKERY_COLORS;
        const b = this.view.bleed;
        const g = this.add.graphics();
        const stripe = S(10);
        const firstX = Math.floor(b.x / stripe) * stripe;
        for (let x = firstX; x < b.x + b.width; x += stripe) {
            g.fillStyle(Math.abs(Math.floor(x / stripe)) % 2 ? C.wallB : C.wallA, 1);
            g.fillRect(x, b.y, stripe, this.counterTop - b.y);
        }
    }

    // Glass display case on the wall with a slot for each cupcake on display.
    createDisplayCase(width) {
        const C = BAKERY_COLORS;
        const g = this.add.graphics();
        const caseW = Math.min(width - S(150), S(300));
        const left = Math.round(width * 0.58 - caseW / 2);
        const top = S(38);
        const caseH = S(52);
        PixelUI.drawBox(g, left, top, caseW, caseH, C.caseGlass, PALETTE.outline);
        g.fillStyle(C.caseShelf, 1);
        g.fillRect(left + 2, top + caseH - S(6), caseW - 4, S(4));
        // Glass shine.
        g.fillStyle(0xffffff, 1);
        for (let i = 0; i < S(8); i++) {
            g.fillRect(left + S(5) + i, top + S(12) - i, 1, 1);
        }

        const slotW = (caseW - S(8)) / SHELF_SIZE;
        this.slots = [];
        for (let i = 0; i < SHELF_SIZE; i++) {
            this.slots.push({ x: Math.round(left + S(4) + slotW * (i + 0.5)), bottom: top + caseH - S(6) });
        }
        this.slotW = slotW;
        this.shelfGraphics = this.add.graphics();
        this.shelfZones = [];
        this.drawShelf();
    }

    drawShelf() {
        const g = this.shelfGraphics;
        g.clear();
        this.shelfZones.forEach((z) => z.destroy());
        this.shelfZones = [];
        const w = Math.round(Math.min(this.slotW - S(4), S(28)));
        this.shelf.forEach((design, i) => {
            const slot = this.slots[i];
            Icons.cupcake(g, slot.x, slot.bottom, w, design);
            // Tap a cupcake on display to give it to the character.
            const zone = this.add.zone(slot.x, slot.bottom - w / 2, this.slotW, w + S(10)).setInteractive({ useHandCursor: true });
            zone.on('pointerup', () => this.eatFromShelf(i));
            this.shelfZones.push(zone);
        });
    }

    // The character stands behind the counter, so the counter is drawn after it.
    createCharacter(x) {
        const scale = CHARACTER_SCALE;
        this.charGroundY = this.counterTop + S(3) - spriteHalf(scale);
        const char = addCharacter(this, this.character, x, this.charGroundY, {
            onTap: () => {
                playCharacterSound(this, this.character.sound);
                floatHeart(this, this.char.x, this.char.y - S(30), { depth: 30 });
                PixelUI.hop(this, this.char, this.charGroundY, S(4));
            }
        });
        this.char = char.container;
        this.charImage = char.image;
        this.mouth = { x, y: this.charGroundY + 1.5 * scale };
    }

    // Counter top, a plate for the cupcake, and the shop counter's front down to the bottom.
    drawCounter(width, height) {
        const C = BAKERY_COLORS;
        const b = this.view.bleed;
        const g = this.add.graphics();
        const top = this.counterTop;
        const slab = S(12);

        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(b.x, top, b.width, slab + 1);
        g.fillStyle(C.counter, 1);
        g.fillRect(b.x, top + 1, b.width, slab - 2);
        g.fillStyle(C.counterEdge, 1);
        g.fillRect(b.x, top + slab - 3, b.width, 2);

        // Front panels with little hearts.
        const frontTop = top + slab + 1;
        g.fillStyle(C.front, 1);
        g.fillRect(b.x, frontTop, b.width, b.y + b.height - frontTop);
        const panel = S(48);
        const firstX = Math.floor(b.x / panel) * panel;
        for (let x = firstX; x < b.x + b.width; x += panel) {
            g.fillStyle(C.frontDark, 1);
            g.fillRect(x, frontTop, 2, height - frontTop);
        }

        // Plate under the cupcake.
        const { x } = this.cupcakePos;
        g.fillStyle(PALETTE.outline, 1);
        Icons.fillEllipse(g, x, top - 1, S(30) + 1, S(4) + 1);
        g.fillStyle(C.plate, 1);
        Icons.fillEllipse(g, x, top - 1, S(30), S(4));
    }

    drawCupcake() {
        this.cupcake.clear();
        Icons.cupcake(this.cupcake, this.cupcakePos.x, this.cupcakePos.y, S(56), this.design);
    }

    // --- Buttons ------------------------------------------------------------------

    // Two rows: cream colours plus sprinkles, then toppings; the big heart is "done".
    createButtons(width, height) {
        const size = S(32);
        const gap = S(40);
        const centerX = Math.round(width * 0.47);
        const rowY = [height - S(64), height - S(24)];
        const place = (i, count) => Math.round(centerX + (i - (count - 1) / 2) * gap);

        const creamDefs = CREAMS.map((color) => ({
            draw: (g, s) => Icons.icing(g, 0, 0, s, color),
            onTap: () => this.choose('cream', color),
            isChosen: () => this.design.cream === color
        }));
        creamDefs.push({
            draw: (g, s) => Icons.sprinkles(g, 0, 0, s),
            onTap: () => this.choose('sprinkles', !this.design.sprinkles),
            isChosen: () => this.design.sprinkles
        });
        const toppingDefs = BAKERY_TOPPINGS.map((key) => ({
            draw: (g, s) => Icons.topping(g, key, 0, Math.round(s * 0.1), s),
            onTap: () => this.choose('topping', this.design.topping === key ? null : key),
            isChosen: () => this.design.topping === key
        }));

        this.buttons = [];
        [creamDefs, toppingDefs].forEach((defs, row) => {
            defs.forEach((def, i) => {
                const button = PixelUI.createIconButton(this, place(i, defs.length), rowY[row], size, def.draw, def.onTap);
                // Small heart marks what is on the cupcake now.
                const mark = this.add.graphics();
                Icons.heart(mark, S(12), -S(12), S(10));
                button.add(mark);
                button.mark = mark;
                button.isChosen = def.isChosen;
                button.row = row;
                this.buttons.push(button);
            });
        });

        this.doneButton = PixelUI.createIconButton(this, width - S(42), height - S(44), S(44),
            (g, s) => Icons.heart(g, 0, 0, Math.round(s * 0.8)), () => this.finish());
        this.refreshButtons();
    }

    refreshButtons() {
        this.buttons.forEach((b) => b.mark.setVisible(b.isChosen()));
        this.doneButton.setAlpha(this.design.cream ? 1 : 0.45);
    }

    // The next suggested step pulses: a cream first, then the heart.
    updateHint() {
        if (this.hintTween) {
            this.hintTween.stop();
            this.hintTween.targets.forEach((t) => t.setScale(1));
            this.hintTween = null;
        }
        if (this.busy) {
            return;
        }
        const target = this.design.cream ? this.doneButton : this.buttons[0];
        this.hintTween = PixelUI.pulse(this, target);
    }

    // --- Decorating ---------------------------------------------------------------

    choose(part, value) {
        if (this.busy) {
            return;
        }
        this.design[part] = value;
        this.drawCupcake();
        if (part === 'cream') {
            playPlop(this);
        } else {
            playSparkle(this);
        }
        floatHeart(this, this.cupcakePos.x + Phaser.Math.Between(-S(14), S(14)), this.cupcakePos.y - S(50), { depth: 30 });
        this.refreshButtons();
        this.updateHint();
    }

    // The finished cupcake goes into the display case; a fresh one appears on the plate.
    finish() {
        if (this.busy || !this.design.cream) {
            if (!this.design.cream) {
                // Not yet: the cream buttons wiggle to show where to start.
                PixelUI.hop(this, this.buttons[0], this.buttons[0].y, S(4), { duration: 90 });
            }
            return;
        }
        this.busy = true;
        this.updateHint();

        // A full case makes room by letting the oldest cupcake go.
        if (this.shelf.length >= SHELF_SIZE) {
            this.shelf.shift();
            this.drawShelf();
        }
        const slot = this.slots[this.shelf.length];
        const design = { ...this.design };

        const flying = this.add.graphics({ x: this.cupcakePos.x, y: this.cupcakePos.y }).setDepth(20);
        Icons.cupcake(flying, 0, 0, S(56), design);
        this.cupcake.clear();
        playFanfare(this);
        this.tweens.add({
            targets: flying,
            x: slot.x,
            y: slot.bottom,
            scale: Math.min(this.slotW - S(4), S(28)) / S(56),
            duration: 650,
            ease: 'Quad.easeInOut',
            onComplete: () => {
                flying.destroy();
                this.shelf.push(design);
                saveShelf(this.shelf);
                this.drawShelf();
                for (let i = 0; i < 3; i++) {
                    floatHeart(this, slot.x + Phaser.Math.Between(-S(10), S(10)), slot.bottom - S(30), { depth: 30, delay: i * 120 });
                }
                PixelUI.hop(this, this.char, this.charGroundY, S(8), { duration: 160, repeat: 1 });
                playCharacterSound(this, this.character.sound);

                // A fresh, bare cupcake pops onto the plate.
                this.newCupcake();
                this.drawCupcake();
                this.cupcake.setAlpha(0);
                this.tweens.add({ targets: this.cupcake, alpha: 1, duration: 300 });
                this.busy = false;
                this.refreshButtons();
                this.updateHint();
            }
        });
    }

    // The character eats a cupcake from the display case.
    eatFromShelf(index) {
        if (this.busy || !this.shelf[index]) {
            return;
        }
        this.busy = true;
        this.updateHint();
        const design = this.shelf[index];
        const slot = this.slots[index];
        this.shelf.splice(index, 1);
        saveShelf(this.shelf);
        this.drawShelf();

        const w = Math.min(this.slotW - S(4), S(28));
        const flying = this.add.graphics({ x: slot.x, y: slot.bottom }).setDepth(20);
        Icons.cupcake(flying, 0, 0, w, design);
        this.tweens.add({
            targets: flying,
            x: this.mouth.x,
            y: this.mouth.y + S(6),
            duration: 600,
            ease: 'Quad.easeInOut',
            onComplete: () => {
                flying.destroy();
                Sweets.add(this);
                this.chew(() => {
                    playCharacterSound(this, this.character.sound);
                    for (let i = 0; i < 3; i++) {
                        floatHeart(this, this.char.x + Phaser.Math.Between(-S(16), S(16)), this.char.y - S(28), { depth: 30, delay: i * 120 });
                    }
                    PixelUI.hop(this, this.char, this.charGroundY, S(6), { duration: 150 });
                    this.busy = false;
                    this.updateHint();
                });
            }
        });
    }

    chew(onDone) {
        const id = this.character.id;
        let frame = 0;
        this.time.addEvent({
            delay: 130,
            repeat: 5,
            callback: () => {
                frame++;
                this.charImage.setTexture(frame % 2 ? `${id}-chew` : id);
                if (frame % 2) {
                    playCrunch(this);
                }
                if (frame === 6) {
                    this.charImage.setTexture(id);
                    onDone();
                }
            }
        });
    }

    goToMap() {
        this.registry.set('mapLocation', 'bakery');
        PixelUI.fadeTo(this, 'MapScene');
    }
}
