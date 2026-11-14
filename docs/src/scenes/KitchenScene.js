import { PALETTE, PixelUI, S } from '../ui/pixel.js';
import { CHARACTER_SCALE, addCharacter, spriteHalf } from '../gfx/hamster.js';
import { addImage, addPattern, setImage } from '../gfx/images.js';
import { floatHeart } from '../ui/effects.js';
import { Sweets } from '../ui/sweets.js';
import { playCharacterSound, playCrunch, playDing, playFanfare, playPlop, playSparkle, playStep, playWhisk } from '../audio/sfx.js';
import { BaseScene } from './BaseScene.js';

// Pictures of this scene: docs/assets/gfx/kuchnia/ (the character's cake in layers:
// tort-<id>, lukier-<id>, posypka, dodatek-<id>; -kes-1 and -kes-2 after bites).
const P = 'kuchnia/';
const KITCHEN_COLORS = {
    wall: 0xfff1e6,
    counter: 0xf2d0b5,
    counterEdge: 0xe0b89a,
    cabinetDark: 0xbfe8d6
};

// Ingredients: the picture on its button, the one flying into the bowl, the blob it leaves.
const INGREDIENTS = [
    { key: 'flour', icon: 'ikony64/maka', piece: 'kuchnia/maka', blob: 'kuchnia/kleks-maka' },
    { key: 'egg', icon: 'ikony64/jajko', piece: 'kuchnia/jajko', blob: 'kuchnia/kleks-jajko' },
    { key: 'sugar', icon: 'ikony64/cukier', piece: 'kuchnia/cukier', blob: 'kuchnia/kleks-cukier' },
    { key: 'milk', icon: 'ikony64/mleko', piece: 'kuchnia/mleko', blob: 'kuchnia/kleks-mleko' }
];

// Decorations for a character's own cake: icing in its colour, sprinkles and its topping.
function cakeDecorations(character) {
    return [
        { key: 'icing', icon: `ikony64/lukier-${character.id}` },
        { key: 'sprinkles', icon: 'ikony64/posypka' },
        { key: 'topping', icon: `ikony64/dodatek-${character.id}` }
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
        this.phase = 'ingredients';
        this.added = [];
        this.mixed = false;
        this.toppings = {};
        this.busy = false;
        this.rowButtons = [];
        this.hintTween = null;
    }

    build({ width, height }) {
        this.counterTop = Math.round(height * 0.6);
        this.bowlPos = { x: Math.round(width * 0.48), y: this.counterTop };

        this.drawWall(width);
        this.createCharacter(Math.round(width * 0.16));
        this.drawCounter(width, height);
        this.createOven(width);

        this.createBowl();
        this.createCake();

        this.showIngredientButtons();
    }

    // --- Room ------------------------------------------------------------------

    // Wall and splashback reach the edges of the whole window (view.bleed), beyond the stage.
    drawWall(width) {
        const top = this.counterTop;
        const b = this.view.bleed;
        this.add.rectangle(b.x, b.y, b.width, top - b.y, KITCHEN_COLORS.wall).setOrigin(0);

        // Tiled splashback above the counter.
        const tilesTop = top - S(40);
        addPattern(this, b.x, tilesTop, b.width, top - tilesTop, P + 'kafelki');

        // Window with sky and a cloud, and a shelf with a heart under it.
        const winW = S(60);
        const winH = S(42);
        const winX = Math.round(width * 0.42 - winW / 2);
        const winY = Math.max(S(10), Math.round(tilesTop * 0.4 - winH / 2));
        addImage(this, winX, winY, P + 'okno');
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

    // Counter and cabinets, also continued across the whole window (view.bleed).
    drawCounter(width, height) {
        const C = KITCHEN_COLORS;
        const top = this.counterTop;
        const slab = S(12);
        const b = this.view.bleed;

        this.add.rectangle(b.x, top, b.width, slab + 1, PALETTE.outline).setOrigin(0);
        this.add.rectangle(b.x, top + 1, b.width, slab - 2, C.counter).setOrigin(0);
        this.add.rectangle(b.x, top + slab - 3, b.width, 2, C.counterEdge).setOrigin(0);

        // Cabinets underneath, down to the button row; doors repeat out to the window edges.
        const cabTop = top + slab + 1;
        const cabBottom = height - S(52);
        if (cabBottom - cabTop > S(16)) {
            const doorW = S(56);
            const step = doorW + S(6);
            const firstX = S(6) - Math.ceil((S(6) - b.x) / step) * step;
            for (let x = firstX; x < b.x + b.width; x += step) {
                addImage(this, x, cabTop + S(4), P + 'drzwiczki');
            }
        }
        this.add.rectangle(b.x, cabBottom, b.width, b.y + b.height - cabBottom, C.cabinetDark).setOrigin(0);
    }

    createOven(width) {
        const w = S(64);
        const h = S(54);
        const cx = width - S(46);
        const bottom = this.counterTop;
        const left = Math.round(cx - w / 2);
        const top = bottom - h;
        this.ovenPos = { x: cx, top, bottom };

        // Oven anchored on the middle of its base, so the hint pulse grows it from there.
        const container = this.add.container(cx, bottom);
        container.add(addImage(this, 0, 0, P + 'piekarnik'));

        // Window: shows the tin and glows while baking.
        this.ovenWindow = { x: left + S(8), y: top + S(19), w: w - S(16), h: h - S(25) };
        this.ovenGlass = addImage(this, this.ovenWindow.x - cx, this.ovenWindow.y - bottom, P + 'szybka');
        container.add(this.ovenGlass);
        this.oven = container;

        // Progress squares above the oven, filled while baking.
        const count = 8;
        const size = S(5);
        const gap = 2;
        const totalW = count * size + (count - 1) * gap;
        const progressLeft = Math.round(cx - totalW / 2);
        this.progress = Array.from({ length: count }, (_, i) =>
            addImage(this, progressLeft + i * (size + gap), top - S(10), P + 'kratka').setVisible(false));

        const zone = this.add.zone(cx, top + h / 2, w, h).setInteractive({ useHandCursor: true });
        zone.on('pointerup', () => this.bake());
    }

    drawOvenGlass(glowing, withTin = false) {
        const key = withTin ? (glowing ? 'szybka-z-forma-goraca' : 'szybka-z-forma') : 'szybka';
        setImage(this.ovenGlass, P + key);
    }

    drawProgress(done) {
        this.progress.forEach((square, i) => setImage(square.setVisible(true), P + (i < done ? 'kratka-pelna' : 'kratka')));
    }

    // --- Bowl --------------------------------------------------------------------

    // The bowl, the batter on top of it and a blob for each ingredient that went in.
    createBowl() {
        const { x, y } = this.bowlPos;
        this.bowl = this.add.container(0, 0);
        this.batter = addImage(this, x, y, P + 'miska-ciasto').setVisible(false);
        this.bowl.add([addImage(this, x, y, P + 'miska'), this.batter]);
        this.blobs = [];
    }

    drawBowl() {
        const { x, y } = this.bowlPos;
        const rx = S(30);
        const rimY = y - S(24);
        const filled = this.added.length > 0;
        this.batter.setVisible(filled);
        if (filled) {
            setImage(this.batter, P + (this.mixed ? 'miska-ciasto-wymieszane' : 'miska-ciasto'));
        }
        this.blobs.forEach((blob) => blob.destroy());
        this.blobs = [];
        if (filled && !this.mixed) {
            this.blobs = this.added.map((key, i) => {
                const ingredient = INGREDIENTS.find((ing) => ing.key === key);
                const bx = x + Math.round((i - 1.5) * rx * 0.4);
                return addImage(this, bx, rimY - 1 + (i % 2), ingredient.blob);
            });
            this.bowl.add(this.blobs);
        }
    }

    // --- Bottom row of buttons ----------------------------------------------------

    setRow(defs) {
        this.rowButtons.forEach((b) => b.destroy());
        this.rowButtons = [];
        const size = S(36);
        const y = this.view.height - S(30);
        // Centred in the space right of the home button, packed tighter on narrow screens.
        const left = S(52);
        const right = this.view.width - S(6);
        const gap = Math.min(S(46), (right - left) / defs.length);
        const centerX = (left + right) / 2;
        defs.forEach((def, i) => {
            const x = Math.round(centerX + (i - (defs.length - 1) / 2) * gap);
            const button = PixelUI.createIconButton(this, x, y, size, def.icon, () => def.onTap(button));
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
        button.add(addImage(this, S(13), -S(13), 'ikony/serce-18'));
    }

    showIngredientButtons() {
        const defs = INGREDIENTS.map((ing) => ({
            key: ing.key,
            icon: ing.icon,
            onTap: (button) => this.addIngredient(ing, button)
        }));
        defs.push({ key: 'whisk', icon: 'ikony64/trzepaczka', onTap: (button) => this.mix(button) });
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

        const piece = addImage(this, button.x, button.y, ingredient.piece).setDepth(20);
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

        const whisk = addImage(this, this.bowlPos.x, this.bowlPos.y - S(36), P + 'trzepaczka').setDepth(20);
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
        const tin = addImage(this, this.bowlPos.x, this.bowlPos.y - S(30), P + 'forma').setDepth(20);
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
        this.progress.forEach((square) => square.setVisible(false));
        this.phase = 'decorate';
        this.drawCake();
        this.cake.setVisible(true).setAlpha(0);
        this.tweens.add({ targets: this.cake, alpha: 1, duration: 400 });
        this.heartAt(this.bowlPos.x, this.bowlPos.y - S(44));
        this.busy = false;

        const defs = cakeDecorations(this.character).map((t) => ({ key: t.key, icon: t.icon, onTap: (button) => this.addTopping(t, button) }));
        defs.push({ key: 'serve', icon: 'ikony64/serce', onTap: () => this.serve() });
        this.setRow(defs);
        this.hint(this.rowButtons[0]);
    }

    // The cake on the plate in layers (sponge, icing, sprinkles, topping), shown once baked.
    createCake() {
        const { x, y } = this.bowlPos;
        const id = this.character.id;
        this.cakeLayers = {
            base: addImage(this, x, y, `${P}tort-${id}`),
            icing: addImage(this, x, y, `${P}lukier-${id}`),
            sprinkles: addImage(this, x, y, P + 'posypka'),
            topping: addImage(this, x, y, `${P}dodatek-${id}`)
        };
        this.cake = this.add.container(0, 0, Object.values(this.cakeLayers)).setVisible(false);
    }

    // `bites`: how many of the three bites have been eaten from the right side.
    drawCake(bites = 0) {
        const id = this.character.id;
        const layers = this.cakeLayers;
        const suffix = bites ? `-kes-${bites}` : '';
        const eaten = bites >= 3;
        setImage(layers.base, eaten ? P + 'talerzyk' : `${P}tort-${id}${suffix}`);
        layers.icing.setVisible(!eaten && Boolean(this.toppings.icing));
        layers.sprinkles.setVisible(!eaten && Boolean(this.toppings.sprinkles));
        if (!eaten) {
            setImage(layers.icing, `${P}lukier-${id}${suffix}`);
            setImage(layers.sprinkles, `${P}posypka${suffix}`);
        }
        // The topping goes with the second bite.
        layers.topping.setVisible(bites < 2 && Boolean(this.toppings.topping));
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
        const key = `${P}kawalek-${this.character.id}${this.toppings.icing ? '' : '-bez-lukru'}`;
        const piece = addImage(this, this.bowlPos.x + S(16), this.bowlPos.y - S(14), key).setDepth(20);

        this.drawCake(bite);
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

    // The whole cake is eaten: a sweet the dentist will find later.
    finish() {
        Sweets.add(this);
        playFanfare(this);
        playCharacterSound(this, this.character.sound);
        for (let i = 0; i < 6; i++) {
            this.time.delayedCall(i * 120, () => this.heartAt(
                this.char.x + Phaser.Math.Between(-S(20), S(20)),
                this.char.y - S(28)
            ));
        }
        PixelUI.hop(this, this.char, this.charGroundY, S(8), { duration: 160, repeat: 2 });

        // Bake again, or go back home (the back button).
        this.setRow([{
            key: 'again',
            icon: `ikony64/tort-${this.character.id}`,
            onTap: () => this.scene.restart({ resized: true })
        }]);
        this.hint(this.rowButtons[0]);
        this.busy = false;
    }

    heartAt(x, y) {
        floatHeart(this, x, y, { depth: 30 });
    }
}
