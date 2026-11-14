import { PALETTE, PixelUI, S } from '../ui/pixel.js';
import { CHARACTER_SCALE, addCharacter, spriteHalf } from '../gfx/hamster.js';
import { addImage, addPattern } from '../gfx/images.js';
import { floatHeart } from '../ui/effects.js';
import { Sweets } from '../ui/sweets.js';
import { playCharacterSound, playCrunch, playFanfare, playPlop, playSparkle } from '../audio/sfx.js';
import { BaseScene } from './BaseScene.js';

// Pictures of this scene: docs/assets/gfx/cukiernia/. A cupcake is layers on top of each
// other, all anchored on the middle of the cup's base: papilotka, then biszkopt (no cream)
// or krem-<colour>, posypka and the topping; -mini ones sit in the display case.
const P = 'cukiernia/';
const BAKERY_COLORS = {
    counter: 0xf2d0b5,
    counterEdge: 0xe0b89a,
    front: 0xf7d6e4
};

// Cream colours on the first row of buttons; the sprinkles shaker comes after them.
// The colour is what the saved display case remembers; the name picks the pictures.
const CREAMS = [
    { color: 0xf7b2cc, name: 'rozowy' },
    { color: 0xd9ccf5, name: 'liliowy' },
    { color: 0xbfe8d6, name: 'mietowy' },
    { color: 0xfff1c9, name: 'waniliowy' },
    { color: 0xd8b39c, name: 'czekoladowy' }
];
// Toppings on the second row (keys of CAKE_TOPPINGS; npm run check verifies them).
export const BAKERY_TOPPINGS = ['cherry', 'strawberry', 'star', 'heart', 'candle'];
// Topping key -> its pictures' name.
const TOPPING_NAMES = { cherry: 'wisienka', strawberry: 'truskawka', star: 'gwiazdka', heart: 'serduszko', candle: 'swieczka' };

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

// Fills `container` (placed on the middle of the cup's base) with the layers of a cupcake
// decorated as `design`; `small` for the display case. Without cream it shows the bare sponge.
function fillCupcake(scene, container, design, small) {
    const size = small ? '-mini' : '';
    container.removeAll(true);
    const layers = [P + 'papilotka' + size];
    if (design.cream) {
        const cream = CREAMS.find((c) => c.color === design.cream) || CREAMS[0];
        layers.push(`${P}krem-${cream.name}${size}`);
        if (design.sprinkles) {
            layers.push(P + 'posypka' + size);
        }
        if (TOPPING_NAMES[design.topping]) {
            layers.push(P + TOPPING_NAMES[design.topping] + size);
        }
    } else {
        layers.push(P + 'biszkopt' + size);
    }
    container.add(layers.map((key) => addImage(scene, 0, 0, key)));
    return container;
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

        this.cupcake = this.add.container(this.cupcakePos.x, this.cupcakePos.y);
        this.drawCupcake();

        this.createButtons(width, height);
        this.updateHint();
    }

    // --- Room -------------------------------------------------------------------

    // Striped wallpaper over the whole window (view.bleed).
    drawRoom() {
        const b = this.view.bleed;
        addPattern(this, b.x, b.y, b.width, this.counterTop - b.y, P + 'tapeta');
    }

    // Glass display case on the wall with a slot for each cupcake on display.
    createDisplayCase(width) {
        const caseW = Math.min(width - S(150), S(300));
        const left = Math.round(width * 0.58 - caseW / 2);
        const top = S(38);
        const caseH = S(52);
        addImage(this, left, top, P + 'gablota');

        const slotW = (caseW - S(8)) / SHELF_SIZE;
        this.slots = [];
        for (let i = 0; i < SHELF_SIZE; i++) {
            this.slots.push({ x: Math.round(left + S(4) + slotW * (i + 0.5)), bottom: top + caseH - S(6) });
        }
        this.slotW = slotW;
        this.shelfCupcakes = this.add.container(0, 0);
        this.shelfZones = [];
        this.drawShelf();
    }

    drawShelf() {
        this.shelfCupcakes.removeAll(true);
        this.shelfZones.forEach((z) => z.destroy());
        this.shelfZones = [];
        const w = Math.round(Math.min(this.slotW - S(4), S(28)));
        this.shelf.forEach((design, i) => {
            const slot = this.slots[i];
            this.shelfCupcakes.add(fillCupcake(this, this.add.container(slot.x, slot.bottom), design, true));
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
        const top = this.counterTop;
        const slab = S(12);

        this.add.rectangle(b.x, top, b.width, slab + 1, PALETTE.outline).setOrigin(0);
        this.add.rectangle(b.x, top + 1, b.width, slab - 2, C.counter).setOrigin(0);
        this.add.rectangle(b.x, top + slab - 3, b.width, 2, C.counterEdge).setOrigin(0);

        // Front panels down to the stage's bottom, plain front below it.
        const frontTop = top + slab + 1;
        this.add.rectangle(b.x, frontTop, b.width, b.y + b.height - frontTop, C.front).setOrigin(0);
        addPattern(this, b.x, frontTop, b.width, height - frontTop, P + 'lada');

        // Plate under the cupcake.
        addImage(this, this.cupcakePos.x, top - 1, P + 'talerz');
    }

    drawCupcake() {
        fillCupcake(this, this.cupcake, this.design, false);
    }

    // --- Buttons ------------------------------------------------------------------

    // Two rows: cream colours plus sprinkles, then toppings; the big heart is "done".
    createButtons(width, height) {
        const size = S(32);
        const gap = S(40);
        const centerX = Math.round(width * 0.47);
        const rowY = [height - S(64), height - S(24)];
        const place = (i, count) => Math.round(centerX + (i - (count - 1) / 2) * gap);

        const creamDefs = CREAMS.map(({ color, name }) => ({
            icon: `ikony64/krem-${name}`,
            onTap: () => this.choose('cream', color),
            isChosen: () => this.design.cream === color
        }));
        creamDefs.push({
            icon: 'ikony64/posypka',
            onTap: () => this.choose('sprinkles', !this.design.sprinkles),
            isChosen: () => this.design.sprinkles
        });
        const toppingDefs = BAKERY_TOPPINGS.map((key) => ({
            icon: `ikony64/dodatek-${TOPPING_NAMES[key]}`,
            onTap: () => this.choose('topping', this.design.topping === key ? null : key),
            isChosen: () => this.design.topping === key
        }));

        this.buttons = [];
        [creamDefs, toppingDefs].forEach((defs, row) => {
            defs.forEach((def, i) => {
                const button = PixelUI.createIconButton(this, place(i, defs.length), rowY[row], size, def.icon, def.onTap);
                // Small heart marks what is on the cupcake now.
                const mark = addImage(this, S(12), -S(12), 'ikony/serce-15');
                button.add(mark);
                button.mark = mark;
                button.isChosen = def.isChosen;
                button.row = row;
                this.buttons.push(button);
            });
        });

        this.doneButton = PixelUI.createIconButton(this, width - S(42), height - S(44), S(44),
            'ikony64/serce-mniejsze', () => this.finish());
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

        const flying = fillCupcake(this, this.add.container(this.cupcakePos.x, this.cupcakePos.y), design, false).setDepth(20);
        this.cupcake.removeAll(true);
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

        const flying = fillCupcake(this, this.add.container(slot.x, slot.bottom), design, true).setDepth(20);
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

    // Back on the map in front of the bakery.
    goBack() {
        this.registry.set('mapLocation', 'bakery');
        super.goBack();
    }
}
