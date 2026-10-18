import { PALETTE, PixelUI, S } from '../ui/pixel.js';
import { getCake } from '../data/characters.js';
import { CHARACTER_SCALE, addCharacter, spriteHalf } from '../gfx/hamster.js';
import { Icons } from '../gfx/icons.js';
import { floatHeart } from '../ui/effects.js';
import { playCharacterSound, playCrunch, playDing, playFanfare, playPlop, playSparkle, playStep, playWhisk } from '../audio/sfx.js';
import { BaseScene } from './BaseScene.js';

const KITCHEN_COLORS = {
    wall: 0xfff1e6,
    tileA: 0xffffff,
    tileB: 0xffe1ec,
    counter: 0xf2d0b5,
    counterEdge: 0xe0b89a,
    cabinet: 0xd4f2e4,
    cabinetDark: 0xbfe8d6,
    handle: 0xc3b3ea,
    oven: 0xf7f9ff,
    ovenPanel: 0xd9ccf5,
    ovenWindow: 0xc3b3ea,
    ovenGlow: 0xffd6b8,
    bowl: 0xcfe8ff,
    bowlInside: 0xb9d9f5,
    batter: 0xfff1c9,
    batterMixed: 0xffe3a3,
    progress: 0xf59bbd
};

// Ingredient key -> how it looks on its button and the blob it leaves in the bowl.
const INGREDIENTS = [
    { key: 'flour', draw: (g, s) => Icons.flour(g, 0, 0, s), blob: 0xffffff },
    { key: 'egg', draw: (g, s) => Icons.egg(g, 0, 0, s), blob: 0xffd86b },
    { key: 'sugar', draw: (g, s) => Icons.sugar(g, 0, 0, s), blob: 0xfff7f0 },
    { key: 'milk', draw: (g, s) => Icons.milk(g, 0, 0, s), blob: 0xe4f1ff }
];

// Decorations for a character's own cake: icing in its colour, sprinkles and its topping.
function cakeDecorations(style) {
    return [
        { key: 'icing', draw: (g, s) => Icons.icing(g, 0, 0, s, style.icing) },
        { key: 'sprinkles', draw: (g, s) => Icons.sprinkles(g, 0, 0, s) },
        { key: 'topping', draw: (g, s) => Icons.topping(g, style.topping, 0, 0, s) }
    ];
}

// Baking a cake for the chosen character, all by tapping:
// ingredients -> mix -> bake -> decorate -> serve. The next step pulses, nothing can fail.
export class KitchenScene extends BaseScene {
    constructor() {
        super('KitchenScene');
    }

    init(data) {
        super.init(data);
        this.character = this.selectedCharacter();
        this.cakeStyle = getCake(this.character);
        this.phase = 'ingredients';
        this.added = [];
        this.mixed = false;
        this.toppings = {};
        this.busy = false;
        this.rowButtons = [];
        this.hintTween = null;
    }

    build({ width, height }) {
        const portrait = height > width;
        this.counterTop = Math.round(height * (portrait ? 0.56 : 0.6));
        this.bowlPos = { x: Math.round(width * (portrait ? 0.52 : 0.48)), y: this.counterTop };

        this.drawWall(width);
        this.createCharacter(Math.round(width * (portrait ? 0.2 : 0.16)));
        this.drawCounter(width, height);
        this.createOven(width);

        this.bowl = this.add.graphics();
        this.drawBowl();
        this.cake = this.add.graphics();

        // On a narrow phone screen the home button moves to the top-left corner, leaving the
        // bottom for the step buttons.
        this.narrow = width < S(250);
        PixelUI.createIconButton(this, S(24), this.narrow ? S(24) : height - S(24), S(32),
            (g, size) => Icons.house(g, 0, 0, size), () => this.goHome());

        this.showIngredientButtons();
    }

    // --- Room ------------------------------------------------------------------

    drawWall(width) {
        const C = KITCHEN_COLORS;
        const g = this.add.graphics();
        const top = this.counterTop;

        g.fillStyle(C.wall, 1);
        g.fillRect(0, 0, width, top);

        // Tiled splashback above the counter.
        const tile = S(8);
        const tilesTop = top - S(40);
        for (let y = tilesTop; y < top; y += tile) {
            for (let x = 0; x < width; x += tile) {
                const odd = (Math.floor(x / tile) + Math.floor((y - tilesTop) / tile)) % 2;
                g.fillStyle(odd ? C.tileB : C.tileA, 1);
                g.fillRect(x, y, tile, Math.min(tile, top - y));
            }
        }

        // Window with sky and a cloud.
        const winW = S(60);
        const winH = S(42);
        const winX = Math.round(width * 0.42 - winW / 2);
        const winY = Math.max(S(10), Math.round(tilesTop * 0.4 - winH / 2));
        PixelUI.drawBox(g, winX, winY, winW, winH, PALETTE.sky[0], PALETTE.outline);
        Icons.cloud(g, winX + Math.round(winW * 0.55), winY + Math.round(winH * 0.5), S(26), S(14));
        g.fillStyle(0xffffff, 1);
        g.fillRect(winX + Math.round(winW / 2) - 1, winY + 2, 2, winH - 4);

        // Shelf with a heart.
        const shelfY = winY + winH + S(10);
        if (shelfY < tilesTop - S(6)) {
            g.fillStyle(PALETTE.outline, 1);
            g.fillRect(winX - S(4), shelfY, winW + S(8), 3);
            Icons.heart(g, winX + Math.round(winW / 2), shelfY - S(6), S(12));
        }
    }

    // The character stands behind the counter, so the counter is drawn after it.
    createCharacter(x) {
        const scale = CHARACTER_SCALE;
        // Whole face above the counter, paws hidden behind it.
        this.charGroundY = this.counterTop + S(3) - spriteHalf(scale);
        const char = addCharacter(this, this.character, x, this.charGroundY, {
            onTap: () => {
                playCharacterSound(this, this.character.sound);
                this.heartAt(this.char.x, this.char.y - S(30));
                PixelUI.hop(this, this.char, this.charGroundY, S(4));
            }
        });
        this.char = char.container;
        this.charImage = char.image;
        this.mouth = { x, y: this.charGroundY + 1.5 * scale };
    }

    drawCounter(width, height) {
        const C = KITCHEN_COLORS;
        const g = this.add.graphics();
        const top = this.counterTop;
        const slab = S(12);

        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(0, top, width, slab + 1);
        g.fillStyle(C.counter, 1);
        g.fillRect(0, top + 1, width, slab - 2);
        g.fillStyle(C.counterEdge, 1);
        g.fillRect(0, top + slab - 3, width, 2);

        // Cabinets underneath, down to the button row.
        const cabTop = top + slab + 1;
        const cabBottom = height - S(52);
        if (cabBottom - cabTop > S(16)) {
            const doorW = S(56);
            for (let x = S(6); x + doorW < width; x += doorW + S(6)) {
                PixelUI.drawBox(g, x, cabTop + S(4), doorW, cabBottom - cabTop - S(4), C.cabinet, PALETTE.outline);
                g.fillStyle(C.handle, 1);
                g.fillRect(x + Math.round(doorW / 2) - S(6), cabTop + S(10), S(12), S(3));
            }
        }
        g.fillStyle(C.cabinetDark, 1);
        g.fillRect(0, cabBottom, width, height - cabBottom);
    }

    createOven(width) {
        const C = KITCHEN_COLORS;
        const w = S(64);
        const h = S(54);
        const cx = width - S(46);
        const bottom = this.counterTop;
        const left = Math.round(cx - w / 2);
        const top = bottom - h;
        this.ovenPos = { x: cx, top, bottom };

        const container = this.add.container(cx, bottom);
        const g = this.add.graphics({ x: -cx, y: -bottom });
        PixelUI.drawBox(g, left, top, w, h, C.oven, PALETTE.outline);
        g.fillStyle(C.ovenPanel, 1);
        g.fillRect(left + 2, top + 2, w - 4, S(9));
        g.fillStyle(PALETTE.outline, 1);
        PixelUI.fillCircle(g, left + S(10), top + S(6), S(2));
        PixelUI.fillCircle(g, left + w - S(10), top + S(6), S(2));
        g.fillRect(left + S(8), top + S(14), w - S(16), 2);
        container.add(g);

        // Window: redrawn to glow while baking.
        this.ovenWindow = { x: left + S(8), y: top + S(19), w: w - S(16), h: h - S(25) };
        this.ovenGlass = this.add.graphics({ x: -cx, y: -bottom });
        container.add(this.ovenGlass);
        this.drawOvenGlass(false);
        this.oven = container;

        // Progress squares above the oven, filled while baking.
        this.progress = this.add.graphics();

        const zone = this.add.zone(cx, top + h / 2, w, h).setInteractive({ useHandCursor: true });
        zone.on('pointerup', () => this.bake());
    }

    drawOvenGlass(glowing, withTin = false) {
        const C = KITCHEN_COLORS;
        const { x, y, w, h } = this.ovenWindow;
        const g = this.ovenGlass;
        g.clear();
        PixelUI.drawBox(g, x, y, w, h, glowing ? C.ovenGlow : C.ovenWindow, PALETTE.outline);
        if (withTin) {
            g.fillStyle(PALETTE.outline, 1);
            g.fillRect(x + S(6), y + h - S(9), w - S(12), S(6));
            g.fillStyle(glowing ? 0xf6d098 : C.batterMixed, 1);
            g.fillRect(x + S(6) + 1, y + h - S(9) + 1, w - S(12) - 2, S(4));
        }
    }

    drawProgress(done) {
        const g = this.progress;
        const count = 8;
        const size = S(5);
        const gap = 2;
        const totalW = count * size + (count - 1) * gap;
        const left = Math.round(this.ovenPos.x - totalW / 2);
        const y = this.ovenPos.top - S(10);
        g.clear();
        for (let i = 0; i < count; i++) {
            g.fillStyle(PALETTE.outline, 1);
            g.fillRect(left + i * (size + gap) - 1, y - 1, size + 2, size + 2);
            g.fillStyle(i < done ? KITCHEN_COLORS.progress : 0xffffff, 1);
            g.fillRect(left + i * (size + gap), y, size, size);
        }
    }

    // --- Bowl --------------------------------------------------------------------

    drawBowl() {
        const C = KITCHEN_COLORS;
        const g = this.bowl;
        const { x, y } = this.bowlPos;
        const rx = S(30);
        const depth = S(24);
        const rimY = y - depth;
        g.clear();

        // Bowl body: lower half of an ellipse.
        g.fillStyle(PALETTE.outline, 1);
        for (let dy = 0; dy <= depth; dy++) {
            const half = Math.round((rx + 1) * Math.sqrt(1 - (dy / (depth + 1)) ** 2));
            g.fillRect(x - half, rimY + dy, half * 2 + 1, 1);
        }
        g.fillStyle(C.bowl, 1);
        for (let dy = 1; dy < depth; dy++) {
            const half = Math.round(rx * Math.sqrt(1 - (dy / depth) ** 2)) - 1;
            g.fillRect(x - half, rimY + dy, half * 2 + 1, 1);
        }
        g.fillStyle(0xffffff, 1);
        g.fillRect(x - Math.round(rx * 0.6), rimY + S(6), 3, S(5));

        // Opening seen from slightly above.
        const openRy = S(6);
        g.fillStyle(PALETTE.outline, 1);
        Icons.fillEllipse(g, x, rimY, rx + 1, openRy + 1);
        const filled = this.added.length > 0;
        g.fillStyle(filled ? (this.mixed ? C.batterMixed : C.batter) : C.bowlInside, 1);
        Icons.fillEllipse(g, x, rimY, rx - 1, openRy - 1);

        if (filled && !this.mixed) {
            // A blob for each ingredient that went in.
            this.added.forEach((key, i) => {
                const ingredient = INGREDIENTS.find((ing) => ing.key === key);
                g.fillStyle(ingredient.blob, 1);
                const bx = x + Math.round((i - 1.5) * rx * 0.4);
                PixelUI.fillCircle(g, bx, rimY - 1 + (i % 2), S(3));
            });
        } else if (this.mixed) {
            // Swirl.
            g.fillStyle(0xf6d098, 1);
            g.fillRect(x - S(10), rimY, S(8), 1);
            g.fillRect(x + S(2), rimY - 2, S(9), 1);
            g.fillRect(x - S(4), rimY + 2, S(10), 1);
        }
    }

    // --- Bottom row of buttons ----------------------------------------------------

    setRow(defs) {
        this.rowButtons.forEach((b) => b.destroy());
        this.rowButtons = [];
        const size = S(36);
        // Centred in the space right of the home button (or the whole width when it sits at
        // the top), packed tighter on narrow screens, in more rows when one is not enough.
        const left = this.narrow ? S(6) : S(52);
        const right = this.view.width - S(6);
        const perRow = Math.max(1, Math.min(defs.length, Math.floor((right - left) / (size + S(4)))));
        const rows = Math.ceil(defs.length / perRow);
        const centerX = (left + right) / 2;
        defs.forEach((def, i) => {
            const row = Math.floor(i / perRow);
            const inRow = row < rows - 1 ? perRow : defs.length - row * perRow;
            const gap = Math.min(S(46), (right - left) / inRow);
            const x = Math.round(centerX + ((i % perRow) - (inRow - 1) / 2) * gap);
            const y = this.view.height - S(30) - (rows - 1 - row) * (size + S(6));
            const button = PixelUI.createIconButton(this, x, y, size, def.draw, () => def.onTap(button));
            button.key = def.key;
            this.rowButtons.push(button);
        });
    }

    hint(button) {
        if (this.hintTween) {
            this.hintTween.stop();
            this.hintTween.targets.forEach((t) => t.setScale(1));
            this.hintTween = null;
        }
        if (button) {
            this.hintTween = PixelUI.pulse(this, button);
        }
    }

    markDone(button) {
        button.setAlpha(0.45);
        button.done = true;
        const mark = this.add.graphics();
        Icons.heart(mark, S(13), -S(13), S(12));
        button.add(mark);
    }

    showIngredientButtons() {
        const defs = INGREDIENTS.map((ing) => ({
            key: ing.key,
            draw: ing.draw,
            onTap: (button) => this.addIngredient(ing, button)
        }));
        defs.push({ key: 'whisk', draw: (g, s) => Icons.whisk(g, 0, 0, s), onTap: (button) => this.mix(button) });
        this.setRow(defs);
        this.whiskButton = this.rowButtons[this.rowButtons.length - 1];
        this.whiskButton.setAlpha(0.45);
        this.hint(this.rowButtons[0]);
    }

    // --- Steps ------------------------------------------------------------------

    addIngredient(ingredient, button) {
        if (this.busy || this.phase !== 'ingredients' || button.done) {
            return;
        }
        this.busy = true;
        this.markDone(button);

        const piece = this.add.graphics({ x: button.x, y: button.y }).setDepth(20);
        ingredient.draw(piece, S(26));
        this.tweens.add({
            targets: piece,
            x: this.bowlPos.x,
            y: this.bowlPos.y - S(34),
            duration: 450,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: piece,
                    y: this.bowlPos.y - S(24),
                    alpha: 0,
                    duration: 200,
                    onComplete: () => {
                        piece.destroy();
                        playPlop(this);
                        this.added.push(ingredient.key);
                        this.drawBowl();
                        this.busy = false;
                        this.afterIngredient();
                    }
                });
            }
        });
    }

    afterIngredient() {
        const next = this.rowButtons.find((b) => b.key !== 'whisk' && !b.done);
        if (next) {
            this.hint(next);
            return;
        }
        this.whiskButton.setAlpha(1);
        this.hint(this.whiskButton);
    }

    mix(button) {
        if (this.busy || this.phase !== 'ingredients' || this.added.length < INGREDIENTS.length) {
            return;
        }
        this.busy = true;
        this.markDone(button);
        this.hint(null);

        const whisk = this.add.graphics({ x: this.bowlPos.x, y: this.bowlPos.y - S(36) }).setDepth(20);
        Icons.whisk(whisk, 0, 0, S(30));
        let strokes = 0;
        this.time.addEvent({
            delay: 160,
            repeat: 9,
            callback: () => {
                strokes++;
                whisk.x = this.bowlPos.x + (strokes % 2 ? S(8) : -S(8));
                playWhisk(this);
                if (strokes === 5) {
                    this.mixed = true;
                    this.drawBowl();
                }
                if (strokes === 10) {
                    whisk.destroy();
                    this.heartAt(this.bowlPos.x, this.bowlPos.y - S(40));
                    this.phase = 'bake';
                    this.busy = false;
                    this.hint(this.oven);
                }
            }
        });
    }

    bake() {
        if (this.busy || this.phase !== 'bake') {
            return;
        }
        this.busy = true;
        this.hint(null);

        // Batter goes into a tin and into the oven.
        const tin = this.add.graphics({ x: this.bowlPos.x, y: this.bowlPos.y - S(30) }).setDepth(20);
        tin.fillStyle(PALETTE.outline, 1);
        tin.fillRect(-S(16), -S(4), S(32), S(8));
        tin.fillStyle(KITCHEN_COLORS.batterMixed, 1);
        tin.fillRect(-S(16) + 1, -S(4) + 1, S(32) - 2, S(5));
        this.added = [];
        this.mixed = false;
        this.bowl.setVisible(false);

        const win = this.ovenWindow;
        this.tweens.add({
            targets: tin,
            x: win.x + win.w / 2,
            y: win.y + win.h / 2,
            duration: 600,
            ease: 'Quad.easeInOut',
            onComplete: () => {
                tin.destroy();
                this.drawOvenGlass(true, true);
                this.runOven();
            }
        });
    }

    runOven() {
        let step = 0;
        this.drawProgress(0);
        this.time.addEvent({
            delay: 450,
            repeat: 7,
            callback: () => {
                step++;
                this.drawProgress(step);
                this.drawOvenGlass(step % 2 === 1, true);
                playStep(this);
                if (step === 8) {
                    playDing(this);
                    this.time.delayedCall(400, () => this.takeOutCake());
                }
            }
        });
    }

    takeOutCake() {
        this.drawOvenGlass(false);
        this.progress.clear();
        this.phase = 'decorate';
        this.drawCake();
        this.cake.setAlpha(0);
        this.tweens.add({ targets: this.cake, alpha: 1, duration: 400 });
        this.heartAt(this.bowlPos.x, this.bowlPos.y - S(44));
        this.busy = false;

        const defs = cakeDecorations(this.cakeStyle).map((t) => ({ key: t.key, draw: t.draw, onTap: (button) => this.addTopping(t, button) }));
        defs.push({ key: 'serve', draw: (g, s) => Icons.heart(g, 0, 0, s), onTap: () => this.serve() });
        this.setRow(defs);
        this.hint(this.rowButtons[0]);
    }

    drawCake(bite = 0) {
        this.cake.clear();
        Icons.characterCake(this.cake, this.character, this.bowlPos.x, this.bowlPos.y, S(56), {
            icing: Boolean(this.toppings.icing),
            sprinkles: Boolean(this.toppings.sprinkles),
            topping: Boolean(this.toppings.topping),
            bite
        });
    }

    addTopping(topping, button) {
        if (this.busy || this.phase !== 'decorate' || button.done) {
            return;
        }
        this.markDone(button);
        this.toppings[topping.key] = true;
        this.drawCake();
        playSparkle(this);
        this.heartAt(this.bowlPos.x, this.bowlPos.y - S(44));

        const next = this.rowButtons.find((b) => b.key !== 'serve' && !b.done);
        this.hint(next || this.rowButtons.find((b) => b.key === 'serve'));
    }

    // The character eats the cake in three bites.
    serve() {
        if (this.busy || this.phase !== 'decorate') {
            return;
        }
        this.busy = true;
        this.phase = 'eating';
        this.hint(null);
        this.rowButtons.forEach((b) => b.setAlpha(0.45));
        this.biteCake(1);
    }

    biteCake(bite) {
        const piece = this.add.graphics({ x: this.bowlPos.x + S(16), y: this.bowlPos.y - S(14) }).setDepth(20);
        piece.fillStyle(PALETTE.outline, 1);
        piece.fillRect(-S(5) - 1, -S(4) - 1, S(10) + 2, S(8) + 2);
        piece.fillStyle(this.cakeStyle.sponge, 1);
        piece.fillRect(-S(5), -S(4), S(10), S(8));
        piece.fillStyle(this.toppings.icing ? this.cakeStyle.icing : 0xfff7e8, 1);
        piece.fillRect(-S(5), -S(4), S(10), S(3));

        this.drawCake(bite / 3);
        this.tweens.add({
            targets: piece,
            x: this.mouth.x,
            y: this.mouth.y,
            duration: 450,
            ease: 'Quad.easeOut',
            onComplete: () => {
                piece.destroy();
                this.chew(() => (bite < 3 ? this.biteCake(bite + 1) : this.finish()));
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

    finish() {
        playFanfare(this);
        playCharacterSound(this, this.character.sound);
        for (let i = 0; i < 6; i++) {
            this.time.delayedCall(i * 120, () => this.heartAt(
                this.char.x + Phaser.Math.Between(-S(20), S(20)),
                this.char.y - S(28)
            ));
        }
        PixelUI.hop(this, this.char, this.charGroundY, S(8), { duration: 160, repeat: 2 });

        // Bake again, or go home.
        this.setRow([{
            key: 'again',
            draw: (g, s) => Icons.characterCake(g, this.character, 0, Math.round(s * 0.3), Math.round(s * 0.8)),
            onTap: () => this.scene.restart({ resized: true })
        }]);
        this.hint(this.rowButtons[0]);
        this.busy = false;
    }

    heartAt(x, y) {
        floatHeart(this, x, y, { depth: 30 });
    }

    goHome() {
        PixelUI.fadeTo(this, 'TerrariumScene');
    }
}
