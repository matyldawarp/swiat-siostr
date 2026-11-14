import { PALETTE, PixelUI, S } from '../ui/pixel.js';
import { addCharacter } from '../gfx/hamster.js';
import { addImage, addPattern, setImage } from '../gfx/images.js';
import { floatHeart } from '../ui/effects.js';
import { playCharacterSound, playDoorbell, playFanfare, playNotes, playPat, playSparkle } from '../audio/sfx.js';
import { rideTo, showRoomPicker } from '../ui/catElevator.js';
import { BaseScene } from './BaseScene.js';

// Pictures of this scene: docs/assets/gfx/domek-gabi/.
const P = 'domek-gabi/';

// Where the parts of the house picture are on the stage: windows (top-left corners, each
// with its picture name; one note per window, low floor to high, so tapping them all
// plays a little scale), the door, the round roof eyes (middles) and the heart nose.
const WINDOW_W = 58;
const WINDOW_H = 34;
const WINDOWS = [
    { x: 224, y: 189, name: 'rozowe', note: 784 },
    { x: 344, y: 189, name: 'zielone', note: 880 },
    { x: 224, y: 248, name: 'turkusowe', note: 587 },
    { x: 344, y: 248, name: 'fioletowe', note: 659 },
    { x: 224, y: 307, name: 'zolte', note: 440 },
    { x: 344, y: 307, name: 'pomaranczowe', note: 523 }
].map((win) => ({ ...win, w: WINDOW_W, h: WINDOW_H }));
const DOOR = { x: 291, y: 316, w: 44, h: 36 };
const EYES = [{ x: 253, y: 117, r: 26 }, { x: 373, y: 117, r: 26 }];
const NOSE = { x: 313, y: 133 };

// Gabi's dollhouse, a big toy to tap: windows light up with a kitten peeking out (each
// with its own note), the round eyes in the roof blink, the heart nose purrs and the door
// opens with a doorbell and shows the rooms inside (ui/catElevator.js) to go to. Lighting
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

        // The house standing on (cx, floorY); its parts sit where WINDOWS, DOOR, EYES and NOSE say.
        this.house = this.add.container(0, 0);
        this.house.add(addImage(this, Math.round(width * 0.58), this.floorY, P + 'dom'));
        this.windowImages = WINDOWS.map((win) => addImage(this, win.x, win.y, `${P}okno-${win.name}`));
        this.eyeImages = EYES.map((eye) => addImage(this, eye.x, eye.y, P + 'oko'));
        this.door = addImage(this, DOOR.x, DOOR.y, P + 'drzwi');
        this.house.add([...this.windowImages, ...this.eyeImages, addImage(this, NOSE.x, NOSE.y, P + 'nosek'), this.door]);

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
        // Hills: a pattern of one wave, from the hilltops down to the lawn.
        addPattern(this, b.x, this.floorY - S(50), b.width, S(44), P + 'wzgorza');
        const lawnTop = this.floorY - S(6);
        this.add.rectangle(b.x, lawnTop, b.width, b.y + b.height - lawnTop, PALETTE.hillFront).setOrigin(0);
        this.add.rectangle(b.x, lawnTop, b.width, S(2), PALETTE.hillFrontLight).setOrigin(0);
        addPattern(this, b.x, this.floorY - S(4), b.width, b.y + b.height - this.floorY + S(4), P + 'kwiatki');
    }

    createTapZones() {
        const zone = (x, y, w, h, onTap) => {
            this.add.zone(x, y, w, h).setOrigin(0).setInteractive({ useHandCursor: true }).on('pointerup', onTap);
        };
        const pad = S(4);
        WINDOWS.forEach((win, i) => zone(win.x - pad, win.y - pad, win.w + pad * 2, win.h + pad * 2, () => this.toggleWindow(i)));
        EYES.forEach((eye, i) => zone(eye.x - eye.r - pad, eye.y - eye.r - pad, (eye.r + pad) * 2, (eye.r + pad) * 2, () => this.blink(i)));
        zone(NOSE.x - S(10), NOSE.y - S(8), S(20), S(16), () => this.purr());
        zone(DOOR.x - pad, DOOR.y - S(14), DOOR.w + pad * 2, DOOR.h + S(14), () => this.openDoor());
    }

    // A window lights up with a kitten waving from it, or goes dark again.
    toggleWindow(i) {
        if (this.cheering) {
            return;
        }
        const win = WINDOWS[i];
        if (this.lit.has(i)) {
            this.lit.delete(i);
            setImage(this.windowImages[i], `${P}okno-${win.name}`);
            playNotes(this, [{ freq: win.note / 2, duration: 0.2 }], 'sine', 0.1);
            return;
        }
        this.lit.add(i);
        setImage(this.windowImages[i], `${P}okno-${win.name}-swieci`);
        playNotes(this, [{ freq: win.note, duration: 0.3 }], 'triangle', 0.13);
        floatHeart(this, win.x + win.w / 2, win.y - S(4), { depth: 30 });

        if (this.lit.size === WINDOWS.length) {
            this.time.delayedCall(400, () => this.cheer());
        }
    }

    // Every window is lit: the house hops, hearts fly, then the lights go out one by one
    // so the game can start over.
    cheer() {
        this.cheering = true;
        playFanfare(this);
        PixelUI.hop(this, this.house, 0, S(6), { duration: 160, repeat: 2 });
        PixelUI.hop(this, this.char, this.charGroundY, S(8), { duration: 160, repeat: 2 });
        WINDOWS.forEach((win, i) => {
            floatHeart(this, win.x + win.w / 2, win.y, { depth: 30, delay: i * 120 });
        });
        WINDOWS.forEach((win, i) => {
            this.time.delayedCall(1800 + i * 200, () => {
                setImage(this.windowImages[i], `${P}okno-${win.name}`);
                this.lit.delete(i);
                if (!this.lit.size) {
                    this.cheering = false;
                }
            });
        });
    }

    // A roof eye closes for a moment.
    blink(i) {
        playPat(this);
        const eye = this.eyeImages[i];
        setImage(eye, P + 'oko-mruga');
        if (eye.openTimer) {
            eye.openTimer.remove();
        }
        eye.openTimer = this.time.delayedCall(260, () => setImage(eye, P + 'oko'));
    }

    // The heart nose purrs and sends up hearts.
    purr() {
        playNotes(this, [
            { freq: 196, duration: 0.15 },
            { freq: 220, duration: 0.15 },
            { freq: 196, duration: 0.25 }
        ], 'sine', 0.12);
        const { x, y } = NOSE;
        [0, 1, 2].forEach((i) => floatHeart(this, x + (i - 1) * S(8), y, { depth: 30, delay: i * 120 }));
    }

    // Ding-dong: the door swings open to a warm light, the character hops for joy and the
    // rooms to go to show up as buttons; tapping elsewhere shuts the door again.
    openDoor() {
        if (this.doorOpen || this.leaving) {
            return;
        }
        this.doorOpen = true;
        playDoorbell(this);
        const door = DOOR;
        setImage(this.door, P + 'drzwi-otwarte');
        PixelUI.hop(this, this.char, this.charGroundY, S(8), { duration: 160, repeat: 1 });
        this.time.delayedCall(300, () => {
            playSparkle(this);
            floatHeart(this, door.x + door.w / 2, door.y, { depth: 30 });
        });
        this.time.delayedCall(400, () => {
            showRoomPicker(this, door.x + door.w / 2, door.y - S(50), {
                onPick: (room) => rideTo(this, room),
                onCancel: () => {
                    setImage(this.door, P + 'drzwi');
                    this.doorOpen = false;
                }
            });
        });
    }

    goBack() {
        this.registry.set('mapLocation', 'gabi');
        super.goBack();
    }
}
