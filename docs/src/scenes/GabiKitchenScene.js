import { PALETTE, PixelUI, S } from '../ui/pixel.js';
import { addCharacter } from '../gfx/hamster.js';
import { addImage, addPattern, setImage } from '../gfx/images.js';
import { floatAway, floatHeart } from '../ui/effects.js';
import { addCatElevator } from '../ui/catElevator.js';
import {
    playCharacterSound, playCrunch, playDing, playFanfare, playNotes, playPlop, playSparkle, playWhisk
} from '../audio/sfx.js';
import { BaseScene } from './BaseScene.js';

// Pictures of this scene: docs/assets/gfx/kuchnia-lakotka/.
const P = 'kuchnia-lakotka/';
const MINT = 0x9fe6d4;
const SPRINKLES = [0xf28aa5, 0xffc08a, 0xfff09a, 0x7fcf9a, 0x9fd0f5, 0xc3b3ea];
const CHERRIES_FOR_PARTY = 5;

// Łakotek's kitchen in Gabi's house, everything to tap: the oven bakes cupcakes (tap the
// tray to share them), every tap on the cake adds a cherry until there is a party, the cat
// fridge opens and hands out a strawberry, the pink cupboard and the hood open up, and
// the pans ring like bells. Nothing can go wrong; every tap ends in something sweet. The
// cat elevator on the right rides to the other rooms. Łakotek (Cakey Cat) is a white
// cupcake kitten with sprinkles on its head and a striped paper case.
export class GabiKitchenScene extends BaseScene {
    constructor() {
        super('GabiKitchenScene');
    }

    init(data) {
        super.init(data);
        this.character = this.selectedCharacter();
        this.cherries = 0;
        this.baking = false;
        this.trayReady = false;
        this.fridgeOpen = false;
        this.cupboardOpen = false;
        this.feedTurn = 0;
    }

    build({ width, height }) {
        this.floorY = Math.round(height * 0.8);
        this.counterTop = this.floorY - S(62);
        this.drawRoom();

        this.stoveX = Math.round(width * 0.22);
        this.cakeX = Math.round(width * 0.46);
        this.fridgeX = Math.round(width * 0.72);
        this.createHood();
        this.createStove();
        this.createShelf();
        this.createCupboard();
        this.createCake();
        this.createFridge();
        this.createCakey(Math.round(width * 0.82));

        this.charGroundY = this.floorY + S(30);
        const char = addCharacter(this, this.character, Math.round(width * 0.58), this.charGroundY, {
            depth: 20,
            onTap: () => {
                playCharacterSound(this, this.character.sound);
                floatHeart(this, this.char.x, this.char.y - S(30), { depth: 30 });
                PixelUI.hop(this, this.char, this.charGroundY, S(4));
            }
        });
        this.char = char.container;
        addCatElevator(this, width - S(30), this.floorY, { rider: this.char });
    }

    // --- Room -------------------------------------------------------------------

    // Cream wall full of sprinkles under a mint band with cat ears, and a tiled floor.
    drawRoom() {
        const b = this.view.bleed;
        addPattern(this, b.x, b.y, b.width, this.floorY - b.y, P + 'tapeta');

        // Mint band along the top with two cat ears.
        const bandBottom = S(12);
        this.add.rectangle(b.x, b.y, b.width, bandBottom - b.y, MINT).setOrigin(0);
        this.add.rectangle(b.x, bandBottom, b.width, 1, PALETTE.outline).setOrigin(0);
        [0.35, 0.65].forEach((f) => addImage(this, Math.round(this.view.width * f), bandBottom, P + 'uszko-opaski'));

        addPattern(this, b.x, this.floorY, b.width, b.y + b.height - this.floorY, P + 'podloga');
        this.add.rectangle(b.x, this.floorY, b.width, 1, PALETTE.outline).setOrigin(0);
    }

    // A zone that calls onTap; kept so it can be switched off.
    tapZone(x, y, w, h, onTap) {
        return this.add.zone(x, y, w, h).setOrigin(0).setInteractive({ useHandCursor: true }).on('pointerup', onTap);
    }

    // --- Hood -------------------------------------------------------------------

    // Cat-faced cooker hood over the stove: a tap opens its eyes and puffs out steam.
    createHood() {
        const cx = this.stoveX;
        const top = S(44);
        const h = S(28);
        const w = S(70);
        addImage(this, cx, top, P + 'okap');
        this.hood = { cx, eyeY: top + Math.round(h * 0.45), top, h };
        this.hoodFace = addImage(this, cx, this.hood.eyeY, P + 'okap-buzia-spi');
        this.tapZone(cx - w / 2, top - S(8), w, h + S(8), () => this.puffSteam());
    }

    puffSteam() {
        playWhisk(this);
        setImage(this.hoodFace, P + 'okap-buzia-patrzy');
        this.time.delayedCall(700, () => setImage(this.hoodFace, P + 'okap-buzia-spi'));
        for (let i = 0; i < 4; i++) {
            const puff = addImage(this, this.stoveX + (i - 1.5) * S(12), this.hood.top + this.hood.h + S(10), P + (i % 2 ? 'para-duza' : 'para-mala')).setDepth(25);
            floatAway(this, puff, { dy: -S(30), duration: 900, delay: i * 120 });
        }
    }

    // --- Stove and oven ---------------------------------------------------------

    createStove() {
        const cx = this.stoveX;
        const w = S(80);
        const left = Math.round(cx - w / 2);
        const top = this.counterTop;

        // Steel back panel with three little cat heads, the hob and the mint oven.
        addImage(this, left, top, P + 'kuchenka');
        // The oven's window; baking makes it glow.
        this.oven = addImage(this, left + S(8), top + S(23), P + 'piekarnik');
        this.tapZone(left, top + S(11), w, this.floorY - top - S(11), () => this.bake());

        // The tray of cupcakes appears on the hob when they are baked.
        this.tray = addImage(this, cx, top, P + 'blacha').setDepth(5).setVisible(false);
        this.trayZone = this.tapZone(left + S(6), top - S(18), w - S(12), S(20), () => this.shareCupcakes());
        this.trayZone.disableInteractive();
    }

    // The oven glows for a moment, then a tray of cupcakes is ready on the hob.
    bake() {
        if (this.baking || this.trayReady) {
            if (this.trayReady) {
                PixelUI.hop(this, this.tray, this.counterTop, S(3), { duration: 90 });
            }
            return;
        }
        this.baking = true;
        playWhisk(this);
        setImage(this.oven, P + 'piekarnik-goracy');
        this.time.delayedCall(1300, () => {
            this.baking = false;
            this.trayReady = true;
            setImage(this.oven, P + 'piekarnik');
            playDing(this);
            this.tray.setVisible(true);
            this.trayZone.setInteractive({ useHandCursor: true });
            PixelUI.hop(this, this.tray, this.counterTop, S(4), { duration: 120 });
        });
    }

    // Tap the baked tray: the cupcakes fly to Łakotek and the character.
    shareCupcakes() {
        if (!this.trayReady) {
            return;
        }
        this.trayReady = false;
        this.trayZone.disableInteractive();
        this.tray.setVisible(false);
        [-1, 0, 1].forEach((i) => {
            this.time.delayedCall((i + 1) * 250, () => {
                this.giveTreat(this.stoveX + i * S(16), this.counterTop - S(10), P + 'babeczka');
            });
        });
    }

    // --- Shelf with hanging pans -----------------------------------------------

    // Pink shelf with a plant and a cat mug; the pans hanging under it ring when tapped.
    createShelf() {
        const cx = this.cakeX;
        const y = S(66);
        addImage(this, cx, y, P + 'polka');

        const notes = [1319, 1568, 1760];
        ['patelnia-fioletowa', 'lopatka', 'patelnia-szara'].forEach((name, n) => {
            const pan = addImage(this, cx + (n - 1) * S(22), y + S(10), P + name);
            this.tapZone(pan.x - S(10), pan.y, S(20), S(28), () => {
                playNotes(this, [{ freq: notes[n], duration: 0.35 }], 'sine', 0.1);
                this.tweens.add({ targets: pan, angle: { from: 18, to: 0 }, duration: 500, ease: 'Bounce.easeOut' });
            });
        });
    }

    // --- Cupboard and cake ------------------------------------------------------

    createCupboard() {
        const cx = this.cakeX;
        const w = S(76);
        const left = Math.round(cx - w / 2);
        addImage(this, left - S(3), this.counterTop, P + 'blat');
        this.cupboard = { left, top: this.counterTop + S(8), w, h: this.floorY - this.counterTop - S(8) };
        this.cupboardImage = addImage(this, left, this.cupboard.top, P + 'szafka');
        this.tapZone(left, this.cupboard.top, w, this.cupboard.h, () => this.openCupboard());
    }

    // Opens on a shelf of stacked cat pots for a moment.
    openCupboard() {
        if (this.cupboardOpen) {
            return;
        }
        this.cupboardOpen = true;
        playPlop(this);
        setImage(this.cupboardImage, P + 'szafka-otwarta');
        floatHeart(this, this.cakeX, this.cupboard.top, { depth: 30 });
        this.time.delayedCall(1500, () => {
            setImage(this.cupboardImage, P + 'szafka');
            this.cupboardOpen = false;
        });
    }

    // Two-tier party cake on the counter; each tap puts a cherry on top.
    createCake() {
        this.cake = this.add.container(0, 0).setDepth(4);
        this.cake.add(addImage(this, this.cakeX, this.counterTop, P + 'tort'));
        this.cherryImages = [];
        this.tapZone(this.cakeX - S(26), this.counterTop - S(62), S(52), S(62), () => this.addCherry());
    }

    // Cherries in a row on the top tier.
    drawCherries() {
        this.cherryImages.forEach((cherry) => cherry.destroy());
        const top = this.counterTop - S(37);
        this.cherryImages = Array.from({ length: this.cherries }, (_, i) => {
            const x = Math.round(this.cakeX + (i - (CHERRIES_FOR_PARTY - 1) / 2) * S(6));
            return addImage(this, x, top - S(2), P + 'wisienka');
        });
        this.cake.add(this.cherryImages);
    }

    addCherry() {
        if (this.cherries >= CHERRIES_FOR_PARTY) {
            return;
        }
        this.cherries++;
        playSparkle(this);
        this.drawCherries();
        PixelUI.hop(this, this.cake, 0, S(2), { duration: 80 });
        this.sprinkleBurst(this.cakeX, this.counterTop - S(40));
        if (this.cherries === CHERRIES_FOR_PARTY) {
            this.time.delayedCall(400, () => this.party());
        }
    }

    // All cherries are on: a cake party, then the cake is shared and gets fresh cherries.
    party() {
        playFanfare(this);
        PixelUI.hop(this, this.cakey, this.cakeyGroundY, S(10), { duration: 160, repeat: 2 });
        PixelUI.hop(this, this.char, this.charGroundY, S(8), { duration: 160, repeat: 2 });
        for (let i = 0; i < 6; i++) {
            this.time.delayedCall(i * 150, () => this.sprinkleBurst(this.cakeX + Phaser.Math.Between(-S(60), S(60)), S(90)));
        }
        this.time.delayedCall(1300, () => {
            this.cherries = 0;
            this.drawCherries();
            this.giveTreat(this.cakeX, this.counterTop - S(40), P + 'kawalek-tortu');
        });
    }

    sprinkleBurst(x, y) {
        for (let i = 0; i < 8; i++) {
            const bit = this.add.rectangle(x, y, i % 2 ? S(4) : 2, i % 2 ? 2 : S(4), SPRINKLES[i % SPRINKLES.length]).setDepth(30);
            const angle = (i / 8) * Math.PI * 2;
            floatAway(this, bit, { dx: Math.cos(angle) * S(24), dy: Math.sin(angle) * S(24) - S(8), duration: 600 });
        }
    }

    // --- Fridge -----------------------------------------------------------------

    // Mint cat-shaped fridge with a sleepy face; a tap opens it and out comes a strawberry.
    createFridge() {
        const w = S(72);
        const left = Math.round(this.fridgeX - w / 2);
        const top = this.floorY - S(148);
        this.fridge = { left, top, w, h: this.floorY - top };
        addImage(this, this.fridgeX, top, P + 'lodowka-uszy');
        this.fridgeImage = addImage(this, left, top, P + 'lodowka');
        this.tapZone(left, top - S(10), w, this.fridge.h + S(10), () => this.openFridge());
    }

    // Inside: white shelves with milk, a strawberry and a jelly.
    openFridge() {
        if (this.fridgeOpen) {
            return;
        }
        this.fridgeOpen = true;
        playNotes(this, [{ freq: 660, duration: 0.12 }, { freq: 880, duration: 0.2 }], 'sine', 0.1);
        setImage(this.fridgeImage, P + 'lodowka-otwarta');
        const shelf1 = Math.round(this.fridge.top + this.fridge.h * 0.62 * 0.45);
        this.time.delayedCall(500, () => this.giveTreat(this.fridgeX + S(14), shelf1 - S(7), P + 'truskawka'));
        this.time.delayedCall(1600, () => {
            setImage(this.fridgeImage, P + 'lodowka');
            this.fridgeOpen = false;
        });
    }

    // --- Łakotek and treats -----------------------------------------------------

    createCakey(x) {
        this.cakeyGroundY = this.floorY + S(26);
        this.cakey = this.add.container(x, this.cakeyGroundY).setDepth(20);
        const image = addImage(this, 0, 0, P + 'lakotek').setScale(4).setInteractive({ useHandCursor: true });
        this.cakey.add(image);
        image.on('pointerup', () => {
            playNotes(this, [{ freq: 988, duration: 0.08 }, { freq: 1175, duration: 0.08 }, { freq: 1480, duration: 0.14 }], 'triangle', 0.12);
            floatHeart(this, this.cakey.x, this.cakey.y - S(30), { depth: 30 });
            PixelUI.hop(this, this.cakey, this.cakeyGroundY, S(6));
        });
    }

    // The treat picture `key` flies from (x, y) to Łakotek or the character, taking turns,
    // and gets eaten with a crunch and a heart.
    giveTreat(x, y, key) {
        const toCakey = this.feedTurn++ % 2 === 0;
        const target = toCakey ? this.cakey : this.char;
        const groundY = toCakey ? this.cakeyGroundY : this.charGroundY;
        const treat = addImage(this, x, y, key).setDepth(40);
        this.tweens.add({
            targets: treat,
            x: target.x,
            y: groundY - S(10),
            duration: 600,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                treat.destroy();
                playCrunch(this);
                floatHeart(this, target.x, groundY - S(30), { depth: 30 });
                PixelUI.hop(this, target, groundY, S(5));
            }
        });
    }
}
