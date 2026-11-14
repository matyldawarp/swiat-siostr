import { PALETTE, PixelUI, S } from '../ui/pixel.js';
import { CHARACTER_SCALE, addCharacter, spriteHalf } from '../gfx/hamster.js';
import { addImage, addPattern } from '../gfx/images.js';
import { floatAway, floatHeart } from '../ui/effects.js';
import { Sweets } from '../ui/sweets.js';
import { playBubble, playCharacterSound, playDing, playFanfare, playSparkle, playWhisk } from '../audio/sfx.js';
import { BaseScene } from './BaseScene.js';

// Pictures of this scene: docs/assets/gfx/dentysta/.
const P = 'dentysta/';
const DENTIST_COLORS = {
    wall: 0xe8f4ff,
    wainscot: 0xd4f2e4,
    chairBase: 0xd9ccf5,
    water: 0x9fd0f5
};

// Leftover sweets on the teeth: soft pastel crumbs, nothing scary (dentysta/okruszek-1 ... -5).
const CRUMB_PICTURES = 5;
// Sparkles when a crumb comes off: visible on white teeth (dentysta/iskierka-1 ... -4).
const SPARKLE_PICTURES = 4;
// Brush strokes over a crumb before it comes off.
const STROKES_TO_CLEAN = 4;


// The dentist, all by tapping: the mirror opens a close-up of the character's smile,
// the toothbrush follows a finger to scrub off leftover sweets (a tap on a crumb works
// too), the cup rinses away the foam, and a "beautiful smile" sticker ends the visit.
// The next tool pulses; nothing hurts and nothing can go wrong.
export class DentistScene extends BaseScene {
    constructor() {
        super('DentistScene');
    }

    init(data) {
        super.init(data);
        this.character = this.selectedCharacter();
        // 'start' -> 'open' (mouth shown) -> 'brushing' -> 'clean' -> 'rinsed'
        this.step = 'start';
        this.busy = false;
        this.crumbs = [];
        this.foam = [];
        this.hintTween = null;
    }

    build({ width, height }) {
        this.floorY = Math.round(height * 0.7);
        this.drawRoom(width, height);
        this.createChair(Math.round(width * 0.24));
        this.createMouthPanel(Math.round(width * 0.62), Math.round(height * 0.38));
        this.createTools(width, height);

        this.updateHint();
    }

    // --- Room -------------------------------------------------------------------

    // Wall and checkered floor over the whole window (view.bleed), and a ceiling lamp.
    drawRoom(width) {
        const C = DENTIST_COLORS;
        const b = this.view.bleed;
        const floorY = this.floorY;

        this.add.rectangle(b.x, b.y, b.width, floorY - b.y, C.wall).setOrigin(0);
        this.add.rectangle(b.x, floorY - S(10), b.width, S(10), C.wainscot).setOrigin(0);
        this.add.rectangle(b.x, floorY, b.width, 1, PALETTE.outline).setOrigin(0);
        addPattern(this, b.x, floorY + 1, b.width, b.y + b.height - floorY - 1, P + 'podloga');

        // Tooth poster on the wall.
        addImage(this, Math.round(width * 0.9), Math.round(floorY * 0.62), P + 'plakat');
    }

    // Reclining pastel chair with the character sitting in it, and a lamp above.
    createChair(cx) {
        const floorY = this.floorY;
        const seatTop = floorY - S(34);

        // Lamp on an arm from the ceiling.
        const lampX = cx + S(30);
        const lampY = S(46);
        const top = this.view.bleed.y;
        this.add.rectangle(lampX - 1, top, 3, lampY - top, DENTIST_COLORS.chairBase).setOrigin(0);
        addImage(this, lampX, lampY, P + 'lampa');

        // Base, seat and the backrest leaning back on the left.
        addImage(this, cx, floorY, P + 'fotel');

        // Sits on the seat.
        this.charGroundY = seatTop + S(4) - spriteHalf(CHARACTER_SCALE);
        const char = addCharacter(this, this.character, cx, this.charGroundY, {
            onTap: () => {
                playCharacterSound(this, this.character.sound);
                floatHeart(this, this.char.x, this.char.y - S(30), { depth: 30 });
                PixelUI.hop(this, this.char, this.charGroundY, S(4));
            }
        });
        this.char = char.container;
        this.charImage = char.image;
        this.face = { x: cx + S(10), y: this.charGroundY };
    }

    // --- Close-up of the smile -----------------------------------------------------

    // A speech-bubble-like panel with the character's open mouth: lips, gums and two
    // rows of teeth. Hidden until the mirror (or the toothbrush) opens it.
    createMouthPanel(cx, cy) {
        const w = S(170);
        const h = S(104);
        this.panelRect = { x: cx - w / 2, y: cy - h / 2, w, h };

        // The picture has the tail towards the character's face, bottom left.
        const picture = addImage(this, 0, 0, P + 'buzia');

        // Middles of the teeth in the picture, where crumbs land: six on the top gum,
        // six on the bottom one.
        const lipH = Math.round(h * 0.78);
        const teeth = 6;
        const tw = S(20);
        const rowLeft = -Math.round((teeth * tw) / 2);
        const gumTop = -Math.round(lipH / 2) + S(7);
        const gumBottom = Math.round(lipH / 2) - S(7);
        this.teeth = [];
        const topH = S(22);
        const bottomH = S(18);
        for (let i = 0; i < teeth; i++) {
            const x = rowLeft + i * tw;
            this.teeth.push({ x: x + tw / 2, y: gumTop + S(3) + topH / 2 });
            this.teeth.push({ x: x + tw / 2, y: gumBottom - S(3) - bottomH / 2 });
        }

        this.panel = this.add.container(cx, cy, [picture]).setDepth(10).setScale(0).setVisible(false);

        // Brushing: the brush follows the finger over the panel and scrubs what it touches.
        const zone = this.add.zone(cx, cy, w, h).setInteractive().setDepth(11);
        zone.on('pointerdown', (pointer) => this.scrub(pointer, true));
        zone.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.scrub(pointer, false);
            }
        });
        zone.on('pointerup', () => this.moveBrush(null));
        zone.on('pointerout', () => this.moveBrush(null));
        this.panelZone = zone;
    }

    // Opens the close-up with an "aaa" and puts leftover sweets on some teeth.
    openMouth(onOpen) {
        if (this.step !== 'start') {
            onOpen?.();
            return;
        }
        this.step = 'open';
        this.charImage.setTexture(`${this.character.id}-chew`);
        playCharacterSound(this, this.character.sound);

        // Three crumbs, and one more for each sweet eaten since the last check-up.
        const count = Math.min(this.teeth.length, 3 + Math.min(5, Sweets.count(this)));
        const spots = Phaser.Utils.Array.Shuffle([...this.teeth]).slice(0, count);
        spots.forEach((tooth) => this.addCrumb(tooth));

        this.panel.setVisible(true);
        this.tweens.add({
            targets: this.panel,
            scale: 1,
            duration: 350,
            ease: 'Back.easeOut',
            onComplete: () => onOpen?.()
        });
    }

    // A little cluster of sweet crumbs on a tooth.
    addCrumb(tooth) {
        const key = `${P}okruszek-${Phaser.Math.Between(1, CRUMB_PICTURES)}`;
        const g = addImage(this, tooth.x + Phaser.Math.Between(-S(2), S(2)), tooth.y + Phaser.Math.Between(-S(2), S(2)), key);
        this.panel.add(g);
        this.crumbs.push({ g, strokes: 0, cleaned: false });
    }

    // --- Brushing -------------------------------------------------------------------

    startBrushing() {
        if (this.step === 'clean' || this.step === 'rinsed' || this.busy) {
            playDing(this);
            return;
        }
        this.openMouth(() => {
            if (this.step === 'open') {
                this.step = 'brushing';
            }
            this.updateHint();
        });
        if (!this.brush) {
            this.brush = addImage(this, 0, 0, P + 'szczoteczka').setDepth(40);
        }
        // Waits on the panel's edge until a finger picks it up.
        this.moveBrush(null);
        this.brush.setVisible(true);
    }

    // Puts the brush under the finger, or back at its resting spot on the panel's edge.
    moveBrush(pointer) {
        if (!this.brush) {
            return;
        }
        if (pointer) {
            this.brush.setPosition(Math.round(pointer.worldX - S(14)), Math.round(pointer.worldY + S(2)));
        } else {
            const r = this.panelRect;
            this.brush.setPosition(r.x + r.w - S(16), r.y + r.h + S(10));
        }
    }

    scrub(pointer, tap) {
        if (this.step !== 'brushing' || this.busy) {
            if (tap && (this.step === 'open' || this.step === 'start')) {
                // Not brushing yet: the tool to tap next shows itself.
                const next = this.step === 'start' ? this.tools.mirror : this.tools.toothbrush;
                PixelUI.hop(this, next, next.y, S(4), { duration: 90 });
            }
            return;
        }
        this.moveBrush(pointer);
        const x = pointer.worldX - this.panel.x;
        const y = pointer.worldY - this.panel.y;

        // Count a stroke only once the finger has moved a little, or on a tap.
        const last = this.lastScrub;
        if (!tap && last && Phaser.Math.Distance.Between(last.x, last.y, x, y) < S(4)) {
            return;
        }
        this.lastScrub = { x, y };

        const now = this.time.now;
        if (!this.lastWhisk || now - this.lastWhisk > 140) {
            playWhisk(this);
            this.lastWhisk = now;
        }
        this.addFoam(x, y);

        this.crumbs.filter((c) => !c.cleaned && Phaser.Math.Distance.Between(c.g.x, c.g.y, x, y) < S(16))
            .forEach((c) => {
                c.strokes += tap ? 2 : 1;
                c.g.setAlpha(1 - c.strokes / (STROKES_TO_CLEAN + 1));
                if (c.strokes >= STROKES_TO_CLEAN) {
                    this.cleanCrumb(c);
                }
            });
    }

    // A dab of white foam where the brush went; rinsed away at the end.
    addFoam(x, y) {
        if (this.foam.length > 40) {
            return;
        }
        // Radius 3 to 6: dentysta/piana-3 ... -6.
        const g = addImage(this, Math.round(x), Math.round(y), `${P}piana-${Phaser.Math.Between(S(2), S(4))}`);
        this.panel.add(g);
        this.foam.push(g);
    }

    cleanCrumb(crumb) {
        crumb.cleaned = true;
        playSparkle(this);
        this.tweens.add({ targets: crumb.g, scale: 0, duration: 200, onComplete: () => crumb.g.destroy() });
        this.sparkleAt(this.panel.x + crumb.g.x, this.panel.y + crumb.g.y);

        if (this.crumbs.every((c) => c.cleaned)) {
            this.step = 'clean';
            this.time.delayedCall(400, () => {
                this.brush.setVisible(false);
                this.tools.toothbrush.mark.setVisible(true);
                floatHeart(this, this.char.x, this.char.y - S(30), { depth: 30 });
                this.updateHint();
            });
        }
    }

    // Small plus-shaped sparkles flying out of a spot.
    sparkleAt(x, y) {
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const g = addImage(this, x, y, `${P}iskierka-${(i % SPARKLE_PICTURES) + 1}`).setDepth(30);
            floatAway(this, g, { dx: Math.round(Math.cos(angle) * S(14)), dy: Math.round(Math.sin(angle) * S(12)), duration: 500, steps: 4 });
        }
    }

    // --- Rinsing and the sticker ---------------------------------------------------------

    rinse() {
        if (this.step !== 'clean' || this.busy) {
            // Not yet: the tool that comes first shows itself.
            const next = this.step === 'start' ? this.tools.mirror : this.tools.toothbrush;
            if (this.step !== 'rinsed') {
                PixelUI.hop(this, next, next.y, S(4), { duration: 90 });
            }
            return;
        }
        this.busy = true;
        this.updateHint();

        const cup = addImage(this, this.tools.cup.x, this.tools.cup.y, P + 'kubek').setDepth(40);
        const r = this.panelRect;
        this.tweens.add({
            targets: cup,
            x: r.x + r.w / 2,
            y: r.y - S(8),
            duration: 450,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.tweens.add({ targets: cup, angle: 60, duration: 200 });
                // Drops of water over the teeth, then the foam is gone.
                for (let i = 0; i < 10; i++) {
                    this.time.delayedCall(i * 70, () => this.waterDrop(r.x + Phaser.Math.Between(S(20), r.w - S(20)), r.y + S(10)));
                }
                this.time.delayedCall(500, () => {
                    this.foam.forEach((f) => this.tweens.add({ targets: f, alpha: 0, duration: 400, onComplete: () => f.destroy() }));
                    this.foam = [];
                });
                this.time.delayedCall(1100, () => {
                    cup.destroy();
                    this.step = 'rinsed';
                    this.tools.cup.mark.setVisible(true);
                    this.teeth.forEach((t, i) => this.time.delayedCall(i * 60,
                        () => this.sparkleAt(this.panel.x + t.x, this.panel.y + t.y)));
                    playDing(this);
                    this.time.delayedCall(800, () => this.celebrate());
                });
            }
        });
    }

    waterDrop(x, y) {
        const g = this.add.rectangle(Math.round(x) - 1, Math.round(y) - S(2), S(2), S(4), DENTIST_COLORS.water).setOrigin(0).setDepth(35);
        if (Math.random() < 0.5) {
            playBubble(this);
        }
        floatAway(this, g, { dy: this.panelRect.h - S(20), duration: 500, steps: 6 });
    }

    // "Beautiful smile" sticker; the back button then invites the way home.
    celebrate() {
        const cx = Math.round(this.view.width / 2);
        const cy = S(40);
        playFanfare(this);
        Sweets.reset(this);
        this.registry.set('stickers', (this.registry.get('stickers') || 0) + 1);

        this.charImage.setTexture(this.character.id);
        this.tweens.add({ targets: this.panel, scale: 0, duration: 300, onComplete: () => this.panel.setVisible(false) });

        const star = addImage(this, cx, cy, P + 'naklejka').setDepth(50).setScale(0);
        this.tweens.add({ targets: star, scale: 1, duration: 500, ease: 'Back.easeOut' });
        const label = PixelUI.addTitle(this, cx, cy + S(34), 'Piękny uśmiech!', S(14)).setDepth(50).setAlpha(0);
        this.tweens.add({ targets: label, alpha: 1, delay: 300, duration: 400 });

        PixelUI.hop(this, this.char, this.charGroundY, S(8), { duration: 160, repeat: 2 });
        for (let i = 0; i < 5; i++) {
            floatHeart(this, this.char.x + Phaser.Math.Between(-S(16), S(16)), this.char.y - S(30), { depth: 30, delay: i * 150 });
        }
        this.busy = false;
        this.updateHint();
    }

    // --- Tool buttons ------------------------------------------------------------------

    createTools(width, height) {
        const size = S(40);
        const gap = S(56);
        const y = height - S(30);
        const defs = {
            mirror: { icon: 'ikony64/lusterko', onTap: () => this.useMirror() },
            toothbrush: { icon: 'ikony64/szczoteczka', onTap: () => this.startBrushing() },
            cup: { icon: 'ikony64/kubek', onTap: () => this.rinse() }
        };
        this.tools = {};
        Object.entries(defs).forEach(([key, def], i) => {
            const button = PixelUI.createIconButton(this, Math.round(width / 2 + (i - 1) * gap), y, size, def.icon, def.onTap);
            // Small heart marks a step that is done.
            const mark = addImage(this, S(14), -S(14), 'ikony/serce-18').setVisible(false);
            button.add(mark);
            button.mark = mark;
            this.tools[key] = button;
        });
    }

    useMirror() {
        if (this.step === 'rinsed') {
            // After the sticker: another check-up from the start.
            this.scene.restart({ resized: true });
            return;
        }
        if (this.step !== 'start') {
            playDing(this);
            return;
        }
        playDing(this);
        this.tools.mirror.mark.setVisible(true);
        this.openMouth(() => this.updateHint());
    }

    // The next step pulses: mirror, toothbrush, cup, then (after the sticker) the map.
    updateHint() {
        if (this.hintTween) {
            this.hintTween.stop();
            this.hintTween.targets.forEach((t) => t.setScale(1));
            this.hintTween = null;
        }
        if (this.busy) {
            return;
        }
        const next = {
            start: this.tools.mirror,
            open: this.tools.toothbrush,
            brushing: null,
            clean: this.tools.cup,
            rinsed: this.backButton
        }[this.step];
        if (next) {
            this.hintTween = PixelUI.pulse(this, next);
        }
    }

    // Back on the map in front of the dentist.
    goBack() {
        this.registry.set('mapLocation', 'dentist');
        super.goBack();
    }
}
