import { ICON_COLORS, PALETTE, PixelUI, S } from '../ui/pixel.js';
import { CHARACTERS } from '../data/characters.js';
import { CHARACTER_SCALE, addCharacter, createHamsterTextures, spriteHalf } from '../gfx/hamster.js';
import { addImage, addPattern, setImage } from '../gfx/images.js';
import { Illness } from '../ui/illness.js';
import { floatHeart, floatZ, walkBob } from '../ui/effects.js';
import { playCharacterSound, playDing, playDoorbell, playFanfare, playLullaby, playPat } from '../audio/sfx.js';
import { BaseScene } from './BaseScene.js';

// Pictures of this scene: docs/assets/gfx/szpital/.
const P = 'szpital/';
const HOSPITAL_COLORS = {
    wall: 0xe4f1ff,
    wainscot: 0xf7d6e4
};
// Steps of the thermometer's rising column (szpital/termometr-0 ... -6).
const THERMOMETER_STEPS = 6;

// Treatment steps, suggested in this order (the next one pulses) but any order works.
const TREATMENTS = ['thermometer', 'syrup', 'plaster'];

export class HospitalScene extends BaseScene {
    constructor() {
        super('HospitalScene');
    }

    init(data) {
        super.init(data);
        this.character = this.selectedCharacter();
        this.busy = false;
        this.done = new Set();
        this.toolButtons = {};
        this.sickBubble = null;
        this.resting = false;
        this.visitor = null;
        this.visitorBusy = false;
        // The other hamster comes to visit.
        this.friend = CHARACTERS.find((c) => c.id !== this.character.id) || null;
    }

    build({ width, height }) {
        const floorY = Math.round(height * 0.66);
        this.floorY = floorY;

        this.drawRoom(width, height, floorY);
        this.createDoor(width, floorY);
        this.createBed(Math.round(width * 0.46), floorY);
        this.createTools(width, height);

        // Bottom-right: rest in bed, and invite the other hamster.
        PixelUI.createIconButton(this, width - S(26), height - S(26), S(36), 'ikony64/ksiezyc', () => this.toggleRest());
        if (this.friend) {
            createHamsterTextures(this, this.friend);
            const visit = PixelUI.createIconButton(this, width - S(26), height - S(70), S(36), null, () => this.visit());
            visit.add(this.add.image(0, 0, this.friend.id).setScale(2));
        }

        this.updateHints();
    }

    drawRoom(width, height, floorY) {
        const C = HOSPITAL_COLORS;
        // Wall and floor reach the edges of the whole window, beyond the stage.
        const b = this.view.bleed;

        this.add.rectangle(b.x, b.y, b.width, floorY - b.y, C.wall).setOrigin(0);
        this.add.rectangle(b.x, floorY - S(10), b.width, S(10), C.wainscot).setOrigin(0);
        this.add.rectangle(b.x, floorY, b.width, 1, PALETTE.outline).setOrigin(0);
        // Checkered floor, lined up with the stage's left edge.
        addPattern(this, b.x, floorY + 1, b.width, b.y + b.height - floorY - 1, P + 'podloga');

        // Cross sign on the wall.
        addImage(this, Math.round(width * 0.16), Math.round(floorY * 0.32), P + 'znak');

        // Window with sky and a cloud, left of the door on the right wall.
        const winW = S(56);
        const winH = S(40);
        addImage(this, Math.round(width * 0.72 - winW / 2), Math.round(floorY * 0.28 - winH / 2), P + 'okno');
    }

    createDoor(width, floorY) {
        this.door = { x: width - S(30), bottom: floorY, w: S(34), h: S(62) };
        this.doorImage = addImage(this, this.door.x, this.door.bottom, P + 'drzwi');
    }

    // Open: the doorway to the corridor with the door swung against the wall.
    drawDoor(open) {
        setImage(this.doorImage, P + (open ? 'drzwi-otwarte' : 'drzwi'));
    }

    createBed(cx, floorY) {
        const bedW = S(130);
        const left = Math.round(cx - bedW / 2);
        const legH = S(12);
        const frameH = S(6);
        const mattressH = S(8);
        const bottom = floorY + S(14);
        const frameTop = bottom - legH - frameH;
        const mattressTop = frameTop - mattressH;
        this.bed = { left, right: left + bedW, mattressTop, bottom };

        // Headboard on the left, legs, frame, mattress and pillow.
        addImage(this, left, mattressTop, P + 'lozko');

        // Hamster sits on the mattress next to the pillow.
        const scale = CHARACTER_SCALE;
        const hx = left + S(52);
        // Sits on the mattress; the blanket then covers only up to its paws.
        const hy = mattressTop - spriteHalf(scale) - S(2);
        this.hamsterGroundY = hy;
        const hamster = addCharacter(this, this.character, hx, hy, {
            onTap: () => {
                if (this.resting) {
                    this.wakeFromRest();
                    return;
                }
                playCharacterSound(this, this.character.sound);
                this.showHearts(1);
            }
        });
        this.hamster = hamster.container;
        this.hamsterImage = hamster.image;

        // Still has its cold on arrival: bubble stays until the treatment is done.
        if (Illness.isSick(this)) {
            this.sickBubble = Illness.createBubble(this).setDepth(20);
            this.sickBubble.setPosition(hx + S(30), hy - spriteHalf(scale) - S(12));
            this.sneezeTimer = this.time.addEvent({
                delay: 5000,
                loop: true,
                callback: () => {
                    if (!this.busy) {
                        Illness.sneeze(this, this.hamsterImage, this.hamster, this.character, this.spots.mouth, this.hamsterGroundY);
                    }
                }
            });
        }

        // Points on the hamster the tools go to (in world coordinates).
        this.spots = {
            mouth: { x: hx, y: hy + 1.5 * scale },
            armpit: { x: hx + 7 * scale, y: hy + 2 * scale },
            cheek: { x: hx + 4 * scale, y: hy + 0.5 * scale }
        };

        // Blanket over the hamster's lower half.
        addImage(this, hx - S(26), mattressTop - S(10), P + 'koldra');
    }

    createTools(width, height) {
        const size = S(40);
        const gap = S(56);
        const y = height - S(30);
        const icons = {
            thermometer: 'ikony64/termometr',
            syrup: 'ikony64/lyzka',
            plaster: 'ikony64/plaster'
        };

        TREATMENTS.forEach((key, i) => {
            const x = Math.round(width / 2 + (i - 1) * gap);
            this.toolButtons[key] = PixelUI.createIconButton(this, x, y, size, icons[key], () => this.useTool(key));
        });
    }

    // The next suggested tool pulses; used tools fade out.
    updateHints() {
        Object.values(this.toolButtons).forEach((b) => {
            if (b.pulseTween) {
                b.pulseTween.stop();
                b.pulseTween = null;
                b.setScale(1);
            }
        });
        const next = TREATMENTS.find((k) => !this.done.has(k));
        if (next) {
            const button = this.toolButtons[next];
            button.pulseTween = PixelUI.pulse(this, button);
        }
    }

    useTool(key) {
        if (this.busy || this.done.has(key)) {
            return;
        }
        this.busy = true;
        const button = this.toolButtons[key];
        button.setAlpha(0.4);

        const actions = {
            thermometer: () => this.measureTemperature(button),
            syrup: () => this.giveSyrup(button),
            plaster: () => this.stickPlaster(button)
        };
        actions[key]();
    }

    // Moves the picture `key` from the button to `to`, then calls onArrive.
    flyTool(button, to, key, onArrive) {
        const tool = addImage(this, button.x, button.y, key).setDepth(20);
        this.tweens.add({
            targets: tool,
            x: Math.round(to.x),
            y: Math.round(to.y),
            duration: 450,
            ease: 'Quad.easeOut',
            onComplete: () => onArrive(tool)
        });
    }

    measureTemperature(button) {
        const to = { x: this.spots.armpit.x, y: this.spots.armpit.y };
        this.flyTool(button, to, P + 'termometr-0', (tool) => {
            const reading = { step: 0 };
            this.tweens.add({
                targets: reading,
                step: THERMOMETER_STEPS,
                duration: 1400,
                ease: 'Stepped',
                easeParams: [THERMOMETER_STEPS],
                onUpdate: () => setImage(tool, `${P}termometr-${Math.round(reading.step)}`),
                onComplete: () => {
                    playDing(this);
                    this.time.delayedCall(400, () => {
                        tool.destroy();
                        this.finishStep('thermometer');
                    });
                }
            });
        });
    }

    giveSyrup(button) {
        const size = S(40);
        const bowlOffset = size / 2 - Math.round(size * 0.22) - 1;
        const to = { x: this.spots.mouth.x + bowlOffset, y: this.spots.mouth.y };
        this.flyTool(button, to, P + 'lyzka-pelna', (tool) => {
            const id = this.character.id;
            let bite = 0;
            this.time.addEvent({
                delay: 160,
                repeat: 5,
                callback: () => {
                    bite++;
                    this.hamsterImage.setTexture(bite % 2 ? `${id}-chew` : id);
                    if (bite === 1) {
                        setImage(tool, P + 'lyzka-pusta');
                        playCharacterSound(this, this.character.sound);
                    }
                    if (bite === 6) {
                        this.hamsterImage.setTexture(id);
                        this.tweens.add({
                            targets: tool,
                            alpha: 0,
                            duration: 300,
                            onComplete: () => {
                                tool.destroy();
                                this.finishStep('syrup');
                            }
                        });
                    }
                }
            });
        });
    }

    stickPlaster(button) {
        this.flyTool(button, this.spots.cheek, P + 'plaster', (tool) => {
            // Stays on the cheek: move it into the hamster so it follows its hops.
            tool.setPosition(tool.x - this.hamster.x, tool.y - this.hamster.y);
            this.hamster.add(tool);
            playPat(this);
            PixelUI.hop(this, this.hamster, this.hamsterGroundY, S(3), {
                duration: 100,
                onComplete: () => this.finishStep('plaster')
            });
        });
    }

    finishStep(key) {
        this.done.add(key);
        this.busy = false;
        this.showHearts(2);

        // Small heart on the used tool marks it as done.
        const button = this.toolButtons[key];
        button.add(addImage(this, S(14), -S(14), 'ikony/serce-18'));

        this.updateHints();
        if (this.done.size === TREATMENTS.length) {
            this.time.delayedCall(500, () => this.celebrate());
        }
    }

    showHearts(count) {
        for (let i = 0; i < count; i++) {
            floatHeart(this, this.hamster.x + Phaser.Math.Between(-S(16), S(16)), this.hamster.y - S(30), { delay: i * 150 });
        }
    }

    // "Brave patient" sticker, then the back button invites the trip home.
    celebrate() {
        const cx = Math.round(this.view.width / 2);
        const cy = S(44);

        playFanfare(this);
        this.showHearts(5);

        // Healthy again.
        Illness.setSick(this, false);
        if (this.sneezeTimer) {
            this.sneezeTimer.remove();
        }
        if (this.sickBubble) {
            const bubble = this.sickBubble;
            this.sickBubble = null;
            this.tweens.add({ targets: bubble, alpha: 0, duration: 300, onComplete: () => bubble.destroy() });
        }

        const star = addImage(this, cx, cy, P + 'naklejka').setDepth(30).setScale(0);
        this.tweens.add({ targets: star, scale: 1, duration: 500, ease: 'Back.easeOut' });

        const label = PixelUI.addTitle(this, cx, cy + S(36), 'Dzielny pacjent!', S(14)).setDepth(30).setAlpha(0);
        this.tweens.add({ targets: label, alpha: 1, delay: 300, duration: 400 });

        PixelUI.hop(this, this.hamster, this.hamsterGroundY, S(8), { duration: 160, repeat: 2 });

        this.registry.set('stickers', (this.registry.get('stickers') || 0) + 1);
        PixelUI.pulse(this, this.backButton);
    }

    // --- Resting in bed --------------------------------------------------------

    toggleRest() {
        if (this.resting) {
            this.wakeFromRest();
        } else if (!this.busy) {
            this.rest();
        }
    }

    rest() {
        this.busy = true;
        this.resting = true;
        this.hamsterImage.setTexture(`${this.character.id}-blink`);

        // Soft lavender dimming, never dark.
        this.restOverlay = this.add.rectangle(0, 0, this.view.width, this.view.height, ICON_COLORS.lavender, 0)
            .setOrigin(0)
            .setDepth(15);
        this.tweens.add({ targets: this.restOverlay, fillAlpha: 0.35, duration: 600 });

        playLullaby(this);
        let count = 0;
        this.zzzTimer = this.time.addEvent({
            delay: 900,
            loop: true,
            callback: () => floatZ(this, this.hamster.x + S(26), this.hamster.y - S(28), count++)
        });
        this.restTimer = this.time.delayedCall(7000, () => this.wakeFromRest());
    }

    wakeFromRest() {
        if (!this.resting) {
            return;
        }
        this.resting = false;
        this.zzzTimer.remove();
        this.restTimer.remove();

        const overlay = this.restOverlay;
        this.tweens.add({ targets: overlay, fillAlpha: 0, duration: 500, onComplete: () => overlay.destroy() });

        this.hamsterImage.setTexture(this.character.id);
        this.showHearts(3);
        PixelUI.hop(this, this.hamster, this.hamsterGroundY, S(6), {
            duration: 140,
            onComplete: () => {
                this.busy = false;
            }
        });
    }

    // --- Visits from the other hamster ----------------------------------------

    visit() {
        if (!this.friend || this.visitorBusy) {
            return;
        }
        if (this.visitor) {
            this.greet();
            return;
        }
        this.visitorBusy = true;

        playDoorbell(this);
        this.time.delayedCall(500, () => {
            this.drawDoor(true);

            const half = spriteHalf(CHARACTER_SCALE);
            const groundY = this.floorY + S(8) - half;
            this.visitorGroundY = groundY;
            const visitor = addCharacter(this, this.friend, this.door.x, groundY, { depth: 12, onTap: () => this.greet() });
            this.visitor = visitor.container;
            this.visitorImage = visitor.image;

            const targetX = Math.min(this.bed.right + S(6) + half, this.door.x);
            const hop = walkBob(this, this.visitorImage);
            this.tweens.add({
                targets: this.visitor,
                x: targetX,
                duration: Math.max(400, (this.door.x - targetX) * 14),
                onComplete: () => {
                    hop.stop();
                    this.visitorImage.y = 0;
                    this.drawDoor(false);
                    this.giveGift();
                }
            });
        });
    }

    // The visitor hands over a flower that stays on the blanket.
    giveGift() {
        const gift = addImage(this, this.visitor.x, this.visitor.y, P + 'kwiatek').setDepth(13);
        const to = { x: Math.round(this.hamster.x + S(34)), y: Math.round(this.bed.mattressTop - S(14)) };

        playCharacterSound(this, this.friend.sound);
        this.tweens.add({
            targets: gift,
            x: to.x,
            y: to.y,
            duration: 500,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.time.delayedCall(250, () => playCharacterSound(this, this.character.sound));
                this.showHearts(3);
                this.heartAt(this.visitor.x, this.visitor.y - S(30));
                this.visitorBusy = false;
            }
        });
    }

    greet() {
        if (this.visitorBusy) {
            return;
        }
        playCharacterSound(this, this.friend.sound);
        this.heartAt(this.visitor.x, this.visitor.y - S(30));
        PixelUI.hop(this, this.visitor, this.visitorGroundY, S(6));
    }

    heartAt(x, y) {
        floatHeart(this, x, y);
    }

    // Back on the map in front of the hospital.
    goBack() {
        this.registry.set('mapLocation', 'hospital');
        super.goBack();
    }
}
