import { PALETTE, PixelUI, S } from '../ui/pixel.js';
import { addCharacter } from '../gfx/hamster.js';
import { ICON_COLORS, Icons } from '../gfx/icons.js';
import { floatHeart } from '../ui/effects.js';
import { playCharacterSound, playDoorbell, playFanfare, playNotes, playPat, playSparkle } from '../audio/sfx.js';
import { BaseScene } from './BaseScene.js';

// One note per window, low floor to high: tapping them all plays a little scale.
const WINDOW_NOTES = [784, 880, 587, 659, 440, 523];
const KITTEN_COLORS = { head: 0xfff0f6, ear: 0xf7b2cc };

// Gabi's dollhouse, a big toy to tap: windows light up with a kitten peeking out (each
// with its own note), the round eyes in the roof blink, the heart nose purrs and the door
// opens with a doorbell and leads into Łakotek's kitchen (GabiKitchenScene). Lighting
// every window makes the whole house cheer.
export class GabiHouseScene extends BaseScene {
    constructor() {
        super('GabiHouseScene');
    }

    init(data) {
        super.init(data);
        this.character = this.selectedCharacter();
        this.lit = new Set();
        this.cheering = false;
    }

    build({ width, height }) {
        this.floorY = Math.round(height * 0.9);
        this.drawGarden();

        this.house = this.add.container(0, 0);
        const g = this.add.graphics();
        this.layout = Icons.gabiHouse(g, Math.round(width * 0.58), this.floorY, S(190), S(222));
        this.house.add(g);
        this.windowLights = this.layout.windows.map(() => this.add.graphics());
        this.overlay = this.add.graphics();
        this.house.add([...this.windowLights, this.overlay]);

        this.createTapZones();

        this.charGroundY = this.floorY - S(12);
        const char = addCharacter(this, this.character, Math.round(width * 0.17), this.charGroundY, {
            onTap: () => {
                playCharacterSound(this, this.character.sound);
                floatHeart(this, this.char.x, this.char.y - S(30), { depth: 30 });
                PixelUI.hop(this, this.char, this.charGroundY, S(4));
            }
        });
        this.char = char.container;
    }

    // Sky, soft hills and a lawn over the whole window (view.bleed).
    drawGarden() {
        const b = this.view.bleed;
        const g = this.add.graphics();
        const bandH = Math.ceil((this.floorY - b.y) / PALETTE.sky.length);
        PALETTE.sky.forEach((color, i) => {
            g.fillStyle(color, 1);
            g.fillRect(b.x, b.y + i * bandH, b.width, bandH + 1);
        });
        g.fillStyle(PALETTE.hillBack, 1);
        for (let x = b.x; x < b.x + b.width; x++) {
            const y = this.floorY - S(40) - Math.round(Math.sin(x / S(60)) * S(10));
            g.fillRect(x, y, 1, this.floorY - y);
        }
        g.fillStyle(PALETTE.hillFront, 1);
        g.fillRect(b.x, this.floorY - S(6), b.width, b.y + b.height - this.floorY + S(6));
        g.fillStyle(PALETTE.hillFrontLight, 1);
        g.fillRect(b.x, this.floorY - S(6), b.width, S(2));
        for (let i = 0; i < b.width / S(14); i++) {
            g.fillStyle(Phaser.Utils.Array.GetRandom([0xf7b2cc, 0xfff1c9, 0xd9ccf5, 0xffffff]), 1);
            g.fillRect(Phaser.Math.Between(b.x, b.x + b.width), Phaser.Math.Between(this.floorY - S(4), b.y + b.height), 2, 2);
        }
    }

    createTapZones() {
        const zone = (x, y, w, h, onTap) => {
            this.add.zone(x, y, w, h).setOrigin(0).setInteractive({ useHandCursor: true }).on('pointerup', onTap);
        };
        const pad = S(4);
        this.layout.windows.forEach((win, i) => zone(win.x - pad, win.y - pad, win.w + pad * 2, win.h + pad * 2, () => this.toggleWindow(i)));
        this.layout.eyes.forEach((eye) => zone(eye.x - eye.r - pad, eye.y - eye.r - pad, (eye.r + pad) * 2, (eye.r + pad) * 2, () => this.blink(eye)));
        const { nose, door } = this.layout;
        zone(nose.x - S(10), nose.y - S(8), S(20), S(16), () => this.purr());
        zone(door.x - pad, door.y - S(14), door.w + pad * 2, door.h + S(14), () => this.openDoor());
    }

    // A window lights up with a kitten waving from it, or goes dark again.
    toggleWindow(i) {
        if (this.cheering) {
            return;
        }
        const win = this.layout.windows[i];
        const light = this.windowLights[i];
        light.clear();
        if (this.lit.has(i)) {
            this.lit.delete(i);
            playNotes(this, [{ freq: WINDOW_NOTES[i] / 2, duration: 0.2 }], 'sine', 0.1);
            return;
        }
        this.lit.add(i);
        const glow = S(4);
        light.fillStyle(win.color, 0.5);
        light.fillRect(win.x - glow, win.y - glow, win.w + glow * 2, win.h + glow * 2);
        Icons.gabiWindow(light, win, 0xfffbe8);
        this.drawKitten(light, win.x + Math.round(win.w / 2), win.y + win.h - 2, Math.round(win.h * 0.7), win.color);
        playNotes(this, [{ freq: WINDOW_NOTES[i], duration: 0.3 }], 'triangle', 0.13);
        floatHeart(this, win.x + win.w / 2, win.y - S(4), { depth: 30 });

        if (this.lit.size === this.layout.windows.length) {
            this.time.delayedCall(400, () => this.cheer());
        }
    }

    // A round kitten head standing on (cx, bottom), in the window's colour around the eyes.
    drawKitten(g, cx, bottom, size, color) {
        const O = PALETTE.outline;
        const r = Math.round(size / 2);
        const cy = bottom - r;
        [-1, 1].forEach((side) => {
            const ear = [
                { x: cx + side * r * 0.95, y: cy - r * 0.2 },
                { x: cx + side * r * 0.8, y: cy - r * 1.3 },
                { x: cx + side * r * 0.15, y: cy - r * 0.8 }
            ];
            g.fillStyle(O, 1);
            Icons.fillPolygon(g, Icons.grow(ear, 1.5));
            g.fillStyle(KITTEN_COLORS.ear, 1);
            Icons.fillPolygon(g, ear);
        });
        g.fillStyle(O, 1);
        PixelUI.fillCircle(g, cx, cy, r + 1);
        g.fillStyle(KITTEN_COLORS.head, 1);
        PixelUI.fillCircle(g, cx, cy, r);
        g.fillStyle(color, 1);
        g.fillRect(cx - r + 2, cy + Math.round(r * 0.35), r * 2 - 3, Math.max(1, Math.round(r * 0.25)));
        const eye = Math.max(1, Math.round(r / 4));
        g.fillStyle(O, 1);
        g.fillRect(cx - Math.round(r * 0.45) - Math.floor(eye / 2), cy - Math.round(r * 0.15), eye, eye + 1);
        g.fillRect(cx + Math.round(r * 0.45) - Math.floor(eye / 2), cy - Math.round(r * 0.15), eye, eye + 1);
        g.fillStyle(ICON_COLORS.pinkDark, 1);
        g.fillRect(cx - Math.floor(eye / 2), cy + Math.round(r * 0.1), eye + 1, eye);
    }

    // Every window is lit: the house hops, hearts fly, then the lights go out one by one
    // so the game can start over.
    cheer() {
        this.cheering = true;
        playFanfare(this);
        PixelUI.hop(this, this.house, 0, S(6), { duration: 160, repeat: 2 });
        PixelUI.hop(this, this.char, this.charGroundY, S(8), { duration: 160, repeat: 2 });
        this.layout.windows.forEach((win, i) => {
            floatHeart(this, win.x + win.w / 2, win.y, { depth: 30, delay: i * 120 });
        });
        this.layout.windows.forEach((win, i) => {
            this.time.delayedCall(1800 + i * 200, () => {
                this.windowLights[i].clear();
                this.lit.delete(i);
                if (!this.lit.size) {
                    this.cheering = false;
                }
            });
        });
    }

    // A roof eye closes for a moment.
    blink(eye) {
        playPat(this);
        const g = this.add.graphics();
        this.house.add(g);
        g.fillStyle(PALETTE.outline, 1);
        PixelUI.fillCircle(g, eye.x, eye.y, eye.r + 1);
        g.fillStyle(0xf2a6dc, 1);
        PixelUI.fillCircle(g, eye.x, eye.y, eye.r);
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(eye.x - eye.r + 2, eye.y, eye.r * 2 - 3, 2);
        this.time.delayedCall(260, () => g.destroy());
    }

    // The heart nose purrs and sends up hearts.
    purr() {
        playNotes(this, [
            { freq: 196, duration: 0.15 },
            { freq: 220, duration: 0.15 },
            { freq: 196, duration: 0.25 }
        ], 'sine', 0.12);
        const { x, y } = this.layout.nose;
        [0, 1, 2].forEach((i) => floatHeart(this, x + (i - 1) * S(8), y, { depth: 30, delay: i * 120 }));
    }

    // Ding-dong: the door swings open to a warm light, the character hops for joy and
    // goes in, to Łakotek's kitchen.
    openDoor() {
        if (this.doorOpen || this.leaving) {
            return;
        }
        this.doorOpen = true;
        playDoorbell(this);
        const { door } = this.layout;
        this.overlay.clear();
        PixelUI.drawBox(this.overlay, door.x, door.y, door.w, door.h, 0xfff1c9, PALETTE.outline);
        this.overlay.fillStyle(0x9fd0f5, 1);
        this.overlay.fillRect(door.x + 2, door.y + 2, Math.max(2, Math.round(door.w * 0.18)), door.h - 3);
        PixelUI.hop(this, this.char, this.charGroundY, S(8), { duration: 160, repeat: 1 });
        this.time.delayedCall(300, () => {
            playSparkle(this);
            floatHeart(this, door.x + door.w / 2, door.y, { depth: 30 });
        });
        this.time.delayedCall(900, () => PixelUI.fadeTo(this, 'GabiKitchenScene'));
    }

    goBack() {
        this.registry.set('mapLocation', 'gabi');
        super.goBack();
    }
}
