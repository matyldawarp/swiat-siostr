import { PALETTE, PixelUI, S } from '../ui/pixel.js';
import { addCharacter, paintPixels } from '../gfx/hamster.js';
import { ICON_COLORS, Icons } from '../gfx/icons.js';
import { floatAway, floatHeart } from '../ui/effects.js';
import {
    playCharacterSound, playCrunch, playDing, playFanfare, playNotes, playPlop, playSparkle, playWhisk
} from '../audio/sfx.js';
import { BaseScene } from './BaseScene.js';

const K = {
    wall: 0xfbeee0,
    floor: 0xfff8ea,
    floorLine: 0xf0e4cc,
    mint: 0x9fe6d4,
    mintDark: 0x7fd2c0,
    mintLight: 0xc4f2e6,
    steel: 0xe4e6f0,
    steelDark: 0xc8cbdc,
    pink: 0xf7a6c8,
    pinkDark: 0xee8fb8,
    tray: 0xc8b4f0,
    glow: 0xffd9a0,
    cream: 0xfff7fb
};
const SPRINKLES = [0xf28aa5, 0xffc08a, 0xfff09a, 0x7fcf9a, 0x9fd0f5, 0xc3b3ea];
const CHERRIES_FOR_PARTY = 5;

// Łakotek (Cakey Cat): a white cupcake kitten with sprinkles on its head, happy closed
// eyes and a striped pink and blue paper case.
const CAKEY_PIXELS = [
    '...O........O...',
    '..OWO......OWO..',
    '.OWKWOOOOOOWKWO.',
    '.OWWWRWWWBWWYWO.',
    'OWWGWWWWYWWWWRWO',
    'OWWWWWWWWWWWWWWO',
    'OWWWEWWWWWWEWWWO',
    'OWWEWEWWWWEWEWWO',
    'OWKKWWWNNWWWKKWO',
    'OWWWWWWEEWWWWWWO',
    '.OWWWWWWWWWWWWO.',
    'OLLLLLLLLLLLLLLO',
    '.OLSLSLSLSLSLSO.',
    '..OLSLSLSLSLSO..',
    '...OSSSSSSSSO...',
    '....OOOOOOOO....'
];
const CAKEY_COLORS = {
    O: PALETTE.outline, E: PALETTE.outline, W: 0xffffff, K: 0xf7b2cc, N: 0xf59bbd,
    R: 0xf28aa5, B: 0x9fd0f5, Y: 0xffd27a, G: 0x7fcf9a, L: 0xf7b2cc, S: 0xa8d4f5
};

// Łakotek's kitchen in Gabi's house, everything to tap: the oven bakes cupcakes (tap the
// tray to share them), every tap on the cake adds a cherry until there is a party, the cat
// fridge opens and hands out a strawberry, the pink cupboard and the hood open up, and
// the pans ring like bells. Nothing can go wrong; every tap ends in something sweet.
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
        this.createCakey(Math.round(width * 0.89));

        this.charGroundY = this.floorY + S(30);
        const char = addCharacter(this, this.character, Math.round(width * 0.6), this.charGroundY, {
            depth: 20,
            onTap: () => {
                playCharacterSound(this, this.character.sound);
                floatHeart(this, this.char.x, this.char.y - S(30), { depth: 30 });
                PixelUI.hop(this, this.char, this.charGroundY, S(4));
            }
        });
        this.char = char.container;
    }

    // --- Room -------------------------------------------------------------------

    // Cream wall full of sprinkles under a mint band with cat ears, and a tiled floor.
    drawRoom() {
        const b = this.view.bleed;
        const g = this.add.graphics();
        g.fillStyle(K.wall, 1);
        g.fillRect(b.x, b.y, b.width, this.floorY - b.y);
        for (let i = 0; i < (b.width * this.floorY) / 1400; i++) {
            g.fillStyle(Phaser.Utils.Array.GetRandom(SPRINKLES), 1);
            const x = Phaser.Math.Between(b.x, b.x + b.width);
            const y = Phaser.Math.Between(b.y + S(16), this.floorY - S(4));
            if (i % 2) {
                g.fillRect(x, y, S(4), 2);
            } else {
                g.fillRect(x, y, 2, S(4));
            }
        }

        // Mint band along the top with two cat ears.
        const bandBottom = S(12);
        g.fillStyle(K.mint, 1);
        g.fillRect(b.x, b.y, b.width, bandBottom - b.y);
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(b.x, bandBottom, b.width, 1);
        [0.35, 0.65].forEach((f) => {
            const x = Math.round(this.view.width * f);
            const ear = [{ x: x - S(16), y: bandBottom }, { x: x - S(6), y: bandBottom + S(12) }, { x: x + S(4), y: bandBottom }];
            g.fillStyle(PALETTE.outline, 1);
            Icons.fillPolygon(g, Icons.grow(ear, 1.5));
            g.fillStyle(K.mint, 1);
            Icons.fillPolygon(g, ear);
        });

        g.fillStyle(K.floor, 1);
        g.fillRect(b.x, this.floorY, b.width, b.y + b.height - this.floorY);
        g.fillStyle(K.floorLine, 1);
        for (let y = this.floorY + S(14); y < b.y + b.height; y += S(18)) {
            g.fillRect(b.x, y, b.width, 1);
        }
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(b.x, this.floorY, b.width, 1);
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
        const g = this.add.graphics();
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(cx - S(9) - 1, S(12), S(18) + 2, top - S(12));
        g.fillStyle(K.steel, 1);
        g.fillRect(cx - S(9), S(12), S(18), top - S(12));
        [-1, 1].forEach((side) => {
            const ear = [{ x: cx + side * w * 0.42, y: top + 2 }, { x: cx + side * w * 0.36, y: top - S(8) }, { x: cx + side * w * 0.2, y: top + 2 }];
            g.fillStyle(PALETTE.outline, 1);
            Icons.fillPolygon(g, Icons.grow(ear, 1.5));
            g.fillStyle(K.mintLight, 1);
            Icons.fillPolygon(g, ear);
        });
        const body = [{ x: cx - w * 0.3, y: top }, { x: cx + w * 0.3, y: top }, { x: cx + w / 2, y: top + h }, { x: cx - w / 2, y: top + h }];
        g.fillStyle(PALETTE.outline, 1);
        Icons.fillPolygon(g, Icons.grow(body, 1.5));
        g.fillStyle(K.mintLight, 1);
        Icons.fillPolygon(g, body);
        g.fillStyle(K.pink, 1);
        g.fillRect(cx - w / 2, top + h - S(4), w, S(4));
        this.hoodFace = this.add.graphics();
        this.hood = { cx, eyeY: top + Math.round(h * 0.45), noseY: top + Math.round(h * 0.62), top, h };
        this.drawHoodFace(false);
        this.tapZone(cx - w / 2, top - S(8), w, h + S(8), () => this.puffSteam());
    }

    drawHoodFace(awake) {
        const { cx, eyeY, noseY } = this.hood;
        const g = this.hoodFace;
        g.clear();
        g.fillStyle(PALETTE.outline, 1);
        [-1, 1].forEach((side) => {
            const x = cx + side * S(10);
            if (awake) {
                g.fillRect(x - S(2), eyeY - S(2), S(4), S(4));
            } else {
                g.fillRect(x - S(3), eyeY, S(6), 2);
            }
        });
        g.fillStyle(ICON_COLORS.pinkDark, 1);
        g.fillRect(cx - S(2), noseY, S(4), S(2));
    }

    puffSteam() {
        playWhisk(this);
        this.drawHoodFace(true);
        this.time.delayedCall(700, () => this.drawHoodFace(false));
        for (let i = 0; i < 4; i++) {
            const puff = this.add.graphics().setDepth(25);
            puff.fillStyle(0xffffff, 0.9);
            PixelUI.fillCircle(puff, 0, 0, S(4 + (i % 2) * 2));
            puff.setPosition(this.stoveX + (i - 1.5) * S(12), this.hood.top + this.hood.h + S(10));
            floatAway(this, puff, { dy: -S(30), duration: 900, delay: i * 120 });
        }
    }

    // --- Stove and oven ---------------------------------------------------------

    createStove() {
        const cx = this.stoveX;
        const w = S(80);
        const left = Math.round(cx - w / 2);
        const top = this.counterTop;
        const g = this.add.graphics();

        // Steel back panel with three little cat heads, and the hob.
        PixelUI.drawBox(g, left + S(4), top - S(30), w - S(8), S(32), K.steel, PALETTE.outline);
        [-1, 0, 1].forEach((i) => this.drawCatHead(g, cx + i * S(22), top - S(18), S(7), K.steelDark));
        PixelUI.drawBox(g, left, top, w, S(12), K.steel, PALETTE.outline);
        [-1, 0, 1].forEach((i) => {
            g.fillStyle(PALETTE.outline, 1);
            PixelUI.fillCircle(g, cx + i * S(22), top + S(6), S(3));
            g.fillStyle(K.steelDark, 1);
            PixelUI.fillCircle(g, cx + i * S(22), top + S(6), S(2));
        });

        // Mint oven with a window; baking makes it glow.
        PixelUI.drawBox(g, left, top + S(11), w, this.floorY - top - S(11), K.mint, PALETTE.outline);
        g.fillStyle(K.mintDark, 1);
        g.fillRect(left + S(8), top + S(16), w - S(16), S(3));
        this.ovenWindow = { x: left + S(8), y: top + S(23), w: w - S(16), h: S(24) };
        this.ovenG = this.add.graphics();
        this.drawOven(false);
        this.tapZone(left, top + S(11), w, this.floorY - top - S(11), () => this.bake());

        // The tray of cupcakes appears on the hob when they are baked.
        this.trayG = this.add.graphics().setDepth(5);
        this.trayZone = this.tapZone(left + S(6), top - S(18), w - S(12), S(20), () => this.shareCupcakes());
        this.trayZone.disableInteractive();
    }

    // Small cat head outline (cooker panel decoration).
    drawCatHead(g, cx, cy, r, color) {
        g.fillStyle(color, 1);
        PixelUI.fillCircle(g, cx, cy, r);
        Icons.fillPolygon(g, [{ x: cx - r, y: cy - r * 0.2 }, { x: cx - r * 0.8, y: cy - r * 1.5 }, { x: cx - r * 0.1, y: cy - r * 0.8 }]);
        Icons.fillPolygon(g, [{ x: cx + r, y: cy - r * 0.2 }, { x: cx + r * 0.8, y: cy - r * 1.5 }, { x: cx + r * 0.1, y: cy - r * 0.8 }]);
        g.fillStyle(K.steel, 1);
        PixelUI.fillCircle(g, cx, cy, Math.max(1, r - S(2)));
    }

    drawOven(hot) {
        const { x, y, w, h } = this.ovenWindow;
        const g = this.ovenG;
        g.clear();
        PixelUI.drawBox(g, x, y, w, h, hot ? K.glow : K.mintDark, PALETTE.outline);
        // Cat-shaped cookies on the rack.
        g.fillStyle(hot ? 0xf0b878 : K.mint, 1);
        [-1, 0, 1].forEach((i) => PixelUI.fillCircle(g, x + w / 2 + i * S(14), y + h / 2 + S(2), S(4)));
    }

    // The oven glows for a moment, then a tray of cupcakes is ready on the hob.
    bake() {
        if (this.baking || this.trayReady) {
            if (this.trayReady) {
                PixelUI.hop(this, this.trayG, 0, S(3), { duration: 90 });
            }
            return;
        }
        this.baking = true;
        playWhisk(this);
        this.drawOven(true);
        this.time.delayedCall(1300, () => {
            this.baking = false;
            this.trayReady = true;
            this.drawOven(false);
            playDing(this);
            this.drawTray();
            this.trayZone.setInteractive({ useHandCursor: true });
            PixelUI.hop(this, this.trayG, 0, S(4), { duration: 120 });
        });
    }

    drawTray() {
        const g = this.trayG;
        const cx = this.stoveX;
        const y = this.counterTop - 1;
        g.clear();
        PixelUI.drawBox(g, cx - S(26), y - S(5), S(52), S(6), K.tray, PALETTE.outline);
        [-1, 0, 1].forEach((i) => this.drawCupcake(g, cx + i * S(16), y - S(4), S(6)));
    }

    // Pink-frosted cupcake standing on (cx, bottom).
    drawCupcake(g, cx, bottom, r) {
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(cx - r, bottom - r - 1, r * 2 + 1, r + 1);
        PixelUI.fillCircle(g, cx, bottom - r - S(2), r + 1);
        g.fillStyle(K.tray, 1);
        g.fillRect(cx - r + 1, bottom - r, r * 2 - 1, r - 1);
        g.fillStyle(0xf59bd0, 1);
        PixelUI.fillCircle(g, cx, bottom - r - S(2), r);
        g.fillStyle(0xffffff, 1);
        g.fillRect(cx - S(2), bottom - r - S(5), 2, 2);
    }

    // Tap the baked tray: the cupcakes fly to Łakotek and the character.
    shareCupcakes() {
        if (!this.trayReady) {
            return;
        }
        this.trayReady = false;
        this.trayZone.disableInteractive();
        this.trayG.clear();
        [-1, 0, 1].forEach((i) => {
            this.time.delayedCall((i + 1) * 250, () => {
                this.giveTreat(this.stoveX + i * S(16), this.counterTop - S(10), (g) => this.drawCupcake(g, 0, S(6), S(6)));
            });
        });
    }

    // --- Shelf with hanging pans -----------------------------------------------

    // Pink shelf with a plant and a cat mug; the pans hanging under it ring when tapped.
    createShelf() {
        const cx = this.cakeX;
        const y = S(66);
        const g = this.add.graphics();
        PixelUI.drawBox(g, cx - S(40), y, S(80), S(6), K.pink, PALETTE.outline);
        // Plant in a white pot.
        PixelUI.drawBox(g, cx - S(30), y - S(10), S(12), S(10), ICON_COLORS.white, PALETTE.outline);
        g.fillStyle(0x7fcf9a, 1);
        g.fillRect(cx - S(25), y - S(18), 2, S(8));
        PixelUI.fillCircle(g, cx - S(28), y - S(18), S(3));
        PixelUI.fillCircle(g, cx - S(20), y - S(19), S(3));
        // Cat mug.
        this.drawCatHead(g, cx + S(26), y - S(7), S(6), 0xf7c6e0);
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(cx + S(23), y - S(7), 2, 2);
        g.fillRect(cx + S(28), y - S(7), 2, 2);
        // Rail with hooks.
        g.fillStyle(K.steelDark, 1);
        g.fillRect(cx - S(34), y + S(9), S(68), 2);

        const notes = [1319, 1568, 1760];
        [-1, 0, 1].forEach((i, n) => {
            const pan = this.add.container(cx + i * S(22), y + S(10));
            const pg = this.add.graphics();
            pg.fillStyle(PALETTE.outline, 1);
            pg.fillRect(-1, 0, 2, S(10));
            if (n === 1) {
                // A spatula in the middle.
                PixelUI.drawBox(pg, -S(5), S(10), S(10), S(10), K.mint, PALETTE.outline);
            } else {
                PixelUI.fillCircle(pg, 0, S(18), S(8) + 1);
                pg.fillStyle(n ? K.steelDark : 0xc3b3ea, 1);
                PixelUI.fillCircle(pg, 0, S(18), S(8));
            }
            pan.add(pg);
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
        const g = this.add.graphics();
        PixelUI.drawBox(g, left - S(3), this.counterTop, w + S(6), S(9), ICON_COLORS.white, PALETTE.outline);
        this.cupboard = { left, top: this.counterTop + S(8), w, h: this.floorY - this.counterTop - S(8) };
        this.cupboardG = this.add.graphics();
        this.drawCupboard(false);
        this.tapZone(left, this.cupboard.top, w, this.cupboard.h, () => this.openCupboard());
    }

    drawCupboard(open) {
        const { left, top, w, h } = this.cupboard;
        const g = this.cupboardG;
        g.clear();
        if (open) {
            // Shelf with stacked cat pots, like the purple and pink ones in the picture.
            PixelUI.drawBox(g, left, top, w, h, 0xfbe4ef, PALETTE.outline);
            g.fillStyle(PALETTE.outline, 1);
            g.fillRect(left + 2, top + Math.round(h * 0.55), w - 4, 1);
            [[0.3, 0xd9b4f5], [0.7, 0xf59bd0]].forEach(([f, color]) => {
                const x = Math.round(left + w * f);
                PixelUI.drawBox(g, x - S(11), top + Math.round(h * 0.55) - S(14), S(22), S(14), color, PALETTE.outline);
                PixelUI.drawBox(g, x - S(11), top + h - S(16), S(22), S(13), color, PALETTE.outline);
            });
            return;
        }
        const doorW = Math.floor(w / 2);
        [0, 1].forEach((i) => {
            PixelUI.drawBox(g, left + i * doorW, top, doorW + (i ? w % 2 : 0), h, K.pink, PALETTE.outline);
            g.fillStyle(K.pinkDark, 1);
            g.fillRect(left + i * doorW + S(5), top + S(5), doorW - S(10), h - S(10));
            g.fillStyle(PALETTE.outline, 1);
            const hx = left + doorW + (i ? S(5) : -S(7));
            g.fillRect(hx, top + Math.round(h * 0.4), S(2), S(6));
        });
    }

    openCupboard() {
        if (this.cupboardOpen) {
            return;
        }
        this.cupboardOpen = true;
        playPlop(this);
        this.drawCupboard(true);
        floatHeart(this, this.cakeX, this.cupboard.top, { depth: 30 });
        this.time.delayedCall(1500, () => {
            this.drawCupboard(false);
            this.cupboardOpen = false;
        });
    }

    // Two-tier party cake on the counter; each tap puts a cherry on top.
    createCake() {
        this.cakeG = this.add.graphics().setDepth(4);
        this.drawCake();
        this.tapZone(this.cakeX - S(26), this.counterTop - S(62), S(52), S(62), () => this.addCherry());
    }

    drawCake() {
        const g = this.cakeG;
        const cx = this.cakeX;
        const base = this.counterTop;
        g.clear();
        const tiers = [
            { w: S(46), h: S(20), y: base - S(20) },
            { w: S(34), h: S(18), y: base - S(37) }
        ];
        tiers.forEach((t) => {
            PixelUI.drawBox(g, cx - t.w / 2, t.y, t.w, t.h, ICON_COLORS.white, PALETTE.outline);
            g.fillStyle(0xf59bd0, 1);
            g.fillRect(cx - t.w / 2 + 2, t.y + 2, t.w - 4, S(5));
            for (let x = cx - t.w / 2 + 3; x < cx + t.w / 2 - 3; x += S(5)) {
                g.fillRect(x, t.y + S(5) + 2, S(2), S(2));
            }
            for (let i = 0; i < 6; i++) {
                g.fillStyle(SPRINKLES[i], 1);
                g.fillRect(Math.round(cx - t.w / 2 + 4 + ((i * 7 + 3) % (t.w - 10))), t.y + S(10) + (i % 2) * S(3), S(3), 2);
            }
        });
        // Cherries in a row on the top tier.
        const top = tiers[1].y;
        for (let i = 0; i < this.cherries; i++) {
            const x = Math.round(cx + (i - (CHERRIES_FOR_PARTY - 1) / 2) * S(6));
            g.fillStyle(PALETTE.outline, 1);
            PixelUI.fillCircle(g, x, top - S(2), S(3) + 1);
            g.fillStyle(0xf26a8a, 1);
            PixelUI.fillCircle(g, x, top - S(2), S(3));
            g.fillStyle(0xffffff, 1);
            g.fillRect(x - 1, top - S(4), 1, 1);
        }
    }

    addCherry() {
        if (this.cherries >= CHERRIES_FOR_PARTY) {
            return;
        }
        this.cherries++;
        playSparkle(this);
        this.drawCake();
        PixelUI.hop(this, this.cakeG, 0, S(2), { duration: 80 });
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
            this.drawCake();
            this.giveTreat(this.cakeX, this.counterTop - S(40), (g) => this.drawSlice(g));
        });
    }

    drawSlice(g) {
        g.fillStyle(PALETTE.outline, 1);
        Icons.fillPolygon(g, [{ x: -S(7) - 1, y: S(7) + 1 }, { x: S(7) + 1, y: S(7) + 1 }, { x: S(7) + 1, y: -S(5) - 1 }]);
        g.fillStyle(ICON_COLORS.white, 1);
        Icons.fillPolygon(g, [{ x: -S(7), y: S(7) }, { x: S(7), y: S(7) }, { x: S(7), y: -S(5) }]);
        g.fillStyle(0xf59bd0, 1);
        g.fillRect(-S(1), S(2), S(8), S(2));
        g.fillStyle(0xf26a8a, 1);
        PixelUI.fillCircle(g, S(6), -S(6), S(2));
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
        const g = this.add.graphics();
        [-1, 1].forEach((side) => {
            const ear = [
                { x: this.fridgeX + side * w * 0.5, y: top + S(10) },
                { x: this.fridgeX + side * w * 0.42, y: top - S(12) },
                { x: this.fridgeX + side * w * 0.12, y: top + 2 }
            ];
            g.fillStyle(PALETTE.outline, 1);
            Icons.fillPolygon(g, Icons.grow(ear, 1.5));
            g.fillStyle(K.mint, 1);
            Icons.fillPolygon(g, ear);
        });
        this.fridgeG = this.add.graphics();
        this.drawFridge(false);
        this.tapZone(left, top - S(10), w, this.fridge.h + S(10), () => this.openFridge());
    }

    drawFridge(open) {
        const { left, top, w, h } = this.fridge;
        const cx = this.fridgeX;
        const g = this.fridgeG;
        const split = top + Math.round(h * 0.62);
        g.clear();
        PixelUI.drawBox(g, left, top, w, h, K.mint, PALETTE.outline);
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(left + 2, split, w - 4, 1);
        g.fillStyle(K.mintDark, 1);
        g.fillRect(left + S(8), split + S(10), S(14), S(3));
        if (open) {
            // Inside: white shelves with milk, a strawberry and a jelly.
            PixelUI.drawBox(g, left + S(5), top + S(5), w - S(10), split - top - S(8), 0xffffff, PALETTE.outline);
            g.fillStyle(K.steelDark, 1);
            [0.45, 0.8].forEach((f) => g.fillRect(left + S(6), Math.round(top + (split - top) * f), w - S(12), 2));
            const shelf1 = Math.round(top + (split - top) * 0.45);
            const shelf2 = Math.round(top + (split - top) * 0.8);
            PixelUI.drawBox(g, cx - S(20), shelf1 - S(18), S(10), S(18), 0xeaf4ff, PALETTE.outline);
            this.drawStrawberry(g, cx + S(14), shelf1 - S(7));
            PixelUI.drawBox(g, cx - S(8), shelf2 - S(12), S(16), S(12), 0xc3b3ea, PALETTE.outline);
            return;
        }
        // Sleepy cat face and whiskers on the big door.
        const faceY = top + Math.round(h * 0.25);
        g.fillStyle(K.mintDark, 1);
        [-1, 1].forEach((side) => {
            g.fillRect(cx + side * S(12) - S(4), faceY, S(8), S(2));
            g.fillRect(cx + side * S(22) - S(4), faceY + S(8), S(8), 1);
            g.fillRect(cx + side * S(22) - S(4), faceY + S(12), S(8), 1);
        });
        g.fillRect(cx - S(2), faceY + S(6), S(4), S(2));
        g.fillRect(cx - S(4), faceY + S(10), S(8), 1);
        g.fillRect(left + S(8), faceY + S(30), S(3), S(16));
    }

    drawStrawberry(g, cx, cy) {
        const r = S(6);
        g.fillStyle(PALETTE.outline, 1);
        PixelUI.fillCircle(g, cx, cy, r + 1);
        g.fillStyle(0xf26a8a, 1);
        PixelUI.fillCircle(g, cx, cy, r);
        g.fillStyle(0x7fcf9a, 1);
        g.fillRect(cx - S(4), cy - r - 1, S(8), S(2));
        g.fillStyle(0xfff09a, 1);
        [[-2, 0], [2, -1], [0, 3], [-3, 3], [3, 2]].forEach(([dx, dy]) => g.fillRect(cx + S(dx), cy + S(dy), 1, 1));
    }

    openFridge() {
        if (this.fridgeOpen) {
            return;
        }
        this.fridgeOpen = true;
        playNotes(this, [{ freq: 660, duration: 0.12 }, { freq: 880, duration: 0.2 }], 'sine', 0.1);
        this.drawFridge(true);
        const shelf1 = Math.round(this.fridge.top + this.fridge.h * 0.62 * 0.45);
        this.time.delayedCall(500, () => this.giveTreat(this.fridgeX + S(14), shelf1 - S(7), (g) => this.drawStrawberry(g, 0, 0)));
        this.time.delayedCall(1600, () => {
            this.drawFridge(false);
            this.fridgeOpen = false;
        });
    }

    // --- Łakotek and treats -----------------------------------------------------

    createCakey(x) {
        paintPixels(this, 'cakey', CAKEY_PIXELS, CAKEY_COLORS);
        this.cakeyGroundY = this.floorY + S(26);
        this.cakey = this.add.container(x, this.cakeyGroundY).setDepth(20);
        const image = this.add.image(0, 0, 'cakey').setScale(4).setInteractive({ useHandCursor: true });
        this.cakey.add(image);
        image.on('pointerup', () => {
            playNotes(this, [{ freq: 988, duration: 0.08 }, { freq: 1175, duration: 0.08 }, { freq: 1480, duration: 0.14 }], 'triangle', 0.12);
            floatHeart(this, this.cakey.x, this.cakey.y - S(30), { depth: 30 });
            PixelUI.hop(this, this.cakey, this.cakeyGroundY, S(6));
        });
    }

    // A treat drawn by `draw` (around 0, 0) flies from (x, y) to Łakotek or the character,
    // taking turns, and gets eaten with a crunch and a heart.
    giveTreat(x, y, draw) {
        const toCakey = this.feedTurn++ % 2 === 0;
        const target = toCakey ? this.cakey : this.char;
        const groundY = toCakey ? this.cakeyGroundY : this.charGroundY;
        const treat = this.add.graphics().setDepth(40).setPosition(x, y);
        draw(treat);
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
