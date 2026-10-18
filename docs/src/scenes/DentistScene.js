import { PALETTE, PixelUI, S } from '../ui/pixel.js';
import { CHARACTER_SCALE, addCharacter, spriteHalf } from '../gfx/hamster.js';
import { ICON_COLORS, Icons } from '../gfx/icons.js';
import { floatAway, floatHeart } from '../ui/effects.js';
import { Sweets } from '../ui/sweets.js';
import { playBubble, playCharacterSound, playDing, playFanfare, playSparkle, playWhisk } from '../audio/sfx.js';
import { BaseScene } from './BaseScene.js';

const DENTIST_COLORS = {
    wall: 0xe8f4ff,
    wainscot: 0xd4f2e4,
    tileA: 0xffffff,
    tileB: 0xe4f1ff,
    chair: 0xf7b2cc,
    chairDark: 0xeea0bd,
    chairBase: 0xd9ccf5,
    lamp: 0xfff1c9,
    lips: 0xf28aa5,
    mouth: 0xf0a0b4,
    gums: 0xf7b2cc,
    foam: 0xffffff,
    foamShade: 0xe4f1ff,
    water: 0x9fd0f5
};

// Leftover sweets on the teeth: soft pastel crumbs, nothing scary.
const CRUMB_COLORS = [0xd8b39c, 0xf59bbd, 0xc9a07a, 0xc3b3ea, 0xf6d98b];
// Sparkles when a crumb comes off: visible on white teeth.
const SPARKLE_COLORS = [0xf6d98b, 0xf59bbd, 0xc3b3ea, 0x9fd6b8];
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

        this.mapButton = PixelUI.createIconButton(this, S(24), height - S(24), S(32),
            (g, size) => Icons.map(g, 0, 0, size), () => this.goToMap());

        this.updateHint();
    }

    // --- Room -------------------------------------------------------------------

    // Wall and checkered floor over the whole window (view.bleed), and a ceiling lamp.
    drawRoom(width) {
        const C = DENTIST_COLORS;
        const b = this.view.bleed;
        const g = this.add.graphics();
        const floorY = this.floorY;

        g.fillStyle(C.wall, 1);
        g.fillRect(b.x, b.y, b.width, floorY - b.y);
        g.fillStyle(C.wainscot, 1);
        g.fillRect(b.x, floorY - S(10), b.width, S(10));
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(b.x, floorY, b.width, 1);

        const tile = S(12);
        const firstX = Math.floor(b.x / tile) * tile;
        for (let y = floorY + 1; y < b.y + b.height; y += tile) {
            for (let x = firstX; x < b.x + b.width; x += tile) {
                const odd = Math.abs(Math.floor(x / tile) + Math.floor((y - floorY) / tile)) % 2;
                g.fillStyle(odd ? C.tileB : C.tileA, 1);
                g.fillRect(x, y, tile, tile);
            }
        }

        // Tooth poster on the wall.
        const px = Math.round(width * 0.9);
        const py = Math.round(floorY * 0.62);
        PixelUI.drawBox(g, px - S(18), py - S(22), S(36), S(44), ICON_COLORS.cream, PALETTE.outline);
        Icons.tooth(g, px, py - S(2), S(26));
        Icons.heart(g, px + S(8), py + S(12), S(8));
    }

    // Reclining pastel chair with the character sitting in it, and a lamp above.
    createChair(cx) {
        const C = DENTIST_COLORS;
        const g = this.add.graphics();
        const floorY = this.floorY;
        const seatTop = floorY - S(34);

        // Lamp on an arm from the ceiling.
        const lampX = cx + S(30);
        const lampY = S(46);
        g.fillStyle(C.chairBase, 1);
        g.fillRect(lampX - 1, this.view.bleed.y, 3, lampY - this.view.bleed.y);
        g.fillStyle(PALETTE.outline, 1);
        PixelUI.fillCircle(g, lampX, lampY, S(11) + 1);
        g.fillStyle(C.lamp, 1);
        PixelUI.fillCircle(g, lampX, lampY, S(11));
        g.fillStyle(ICON_COLORS.white, 1);
        PixelUI.fillCircle(g, lampX - S(3), lampY - S(3), S(3));

        // Base and seat.
        PixelUI.drawBox(g, cx - S(18), floorY - S(12), S(36), S(12), C.chairBase, PALETTE.outline);
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(cx - S(4), seatTop + S(8), S(8), floorY - S(12) - seatTop - S(8));
        PixelUI.drawBox(g, cx - S(34), seatTop, S(76), S(12), C.chair, PALETTE.outline);
        // Backrest leaning back on the left.
        PixelUI.drawBox(g, cx - S(40), seatTop - S(40), S(14), S(48), C.chair, PALETTE.outline);
        g.fillStyle(C.chairDark, 1);
        g.fillRect(cx - S(32), seatTop + S(8), S(70), S(2));

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
        const C = DENTIST_COLORS;
        const w = S(170);
        const h = S(104);
        this.panelRect = { x: cx - w / 2, y: cy - h / 2, w, h };

        const g = this.add.graphics();
        PixelUI.drawBox(g, -w / 2, -h / 2, w, h, ICON_COLORS.white, PALETTE.outline);
        // Tail towards the character's face, bottom left.
        for (let i = 0; i < S(10); i++) {
            g.fillStyle(PALETTE.outline, 1);
            g.fillRect(-w / 2 - i - 1, h / 4 + i, i + 3, 1);
            g.fillStyle(ICON_COLORS.white, 1);
            g.fillRect(-w / 2 - i + 1, h / 4 + i, Math.max(0, i), 1);
        }

        // Lips around the open mouth.
        const lipW = Math.round(w * 0.86);
        const lipH = Math.round(h * 0.78);
        g.fillStyle(PALETTE.outline, 1);
        Icons.fillEllipse(g, 0, 0, Math.round(lipW / 2) + 1, Math.round(lipH / 2) + 1);
        g.fillStyle(C.lips, 1);
        Icons.fillEllipse(g, 0, 0, Math.round(lipW / 2), Math.round(lipH / 2));
        g.fillStyle(C.mouth, 1);
        Icons.fillEllipse(g, 0, 0, Math.round(lipW / 2) - S(6), Math.round(lipH / 2) - S(6));

        // Gums along the top and bottom, then the teeth on them.
        const teeth = 6;
        const tw = S(20);
        const rowLeft = -Math.round((teeth * tw) / 2);
        const gumTop = -Math.round(lipH / 2) + S(7);
        const gumBottom = Math.round(lipH / 2) - S(7);
        g.fillStyle(C.gums, 1);
        g.fillRect(rowLeft - S(4), gumTop, teeth * tw + S(8), S(5));
        g.fillRect(rowLeft - S(4), gumBottom - S(5), teeth * tw + S(8), S(5));

        this.teeth = [];
        const topH = S(22);
        const bottomH = S(18);
        for (let i = 0; i < teeth; i++) {
            const x = rowLeft + i * tw;
            this.drawTooth(g, x, gumTop + S(3), tw, topH, false);
            this.teeth.push({ x: x + tw / 2, y: gumTop + S(3) + topH / 2 });
            this.drawTooth(g, x, gumBottom - S(3) - bottomH, tw, bottomH, true);
            this.teeth.push({ x: x + tw / 2, y: gumBottom - S(3) - bottomH / 2 });
        }

        this.panel = this.add.container(cx, cy, [g]).setDepth(10).setScale(0).setVisible(false);

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

    // One tooth with a rounded biting edge and a glint.
    drawTooth(g, x, y, w, h, bottomRow) {
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(x, y, w, h);
        g.fillStyle(ICON_COLORS.white, 1);
        g.fillRect(x + 1, y + 1, w - 2, h - 2);
        // Rounded corners on the biting edge.
        g.fillStyle(DENTIST_COLORS.mouth, 1);
        const edgeY = bottomRow ? y : y + h - 1;
        g.fillRect(x, edgeY, 1, 1);
        g.fillRect(x + w - 1, edgeY, 1, 1);
        g.fillStyle(ICON_COLORS.sky, 1);
        g.fillRect(x + w - S(5), y + S(3), 2, Math.max(2, Math.round(h / 3)));
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
        const g = this.add.graphics();
        const color = Phaser.Utils.Array.GetRandom(CRUMB_COLORS);
        const bits = [[0, 0, S(4)], [-S(4), S(3), S(3)], [S(4), -S(2), S(3)], [S(2), S(4), S(2)]];
        g.fillStyle(PALETTE.outline, 1);
        bits.forEach(([dx, dy, r]) => PixelUI.fillCircle(g, dx, dy, r + 1));
        g.fillStyle(color, 1);
        bits.forEach(([dx, dy, r]) => PixelUI.fillCircle(g, dx, dy, r));
        g.fillStyle(0xffffff, 1);
        g.fillRect(-S(2), -S(2), 2, 2);
        g.setPosition(tooth.x + Phaser.Math.Between(-S(2), S(2)), tooth.y + Phaser.Math.Between(-S(2), S(2)));
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
            this.brush = this.add.graphics().setDepth(40);
            Icons.toothbrush(this.brush, 0, 0, S(44));
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
        const g = this.add.graphics({ x: Math.round(x), y: Math.round(y) });
        const r = Phaser.Math.Between(S(2), S(4));
        g.fillStyle(DENTIST_COLORS.foamShade, 1);
        PixelUI.fillCircle(g, 0, 0, r + 1);
        g.fillStyle(DENTIST_COLORS.foam, 1);
        PixelUI.fillCircle(g, 0, 0, r);
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
            const g = this.add.graphics({ x, y }).setDepth(30);
            g.fillStyle(SPARKLE_COLORS[i % SPARKLE_COLORS.length], 1);
            g.fillRect(-1, -S(2), 2, S(4) + 1);
            g.fillRect(-S(2), -1, S(4) + 1, 2);
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

        const cup = this.add.graphics({ x: this.tools.cup.x, y: this.tools.cup.y }).setDepth(40);
        Icons.cup(cup, 0, 0, S(34));
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
        const g = this.add.graphics({ x: Math.round(x), y: Math.round(y) }).setDepth(35);
        g.fillStyle(DENTIST_COLORS.water, 1);
        g.fillRect(-1, -S(2), S(2), S(4));
        if (Math.random() < 0.5) {
            playBubble(this);
        }
        floatAway(this, g, { dy: this.panelRect.h - S(20), duration: 500, steps: 6 });
    }

    // "Beautiful smile" sticker; the map button then invites the way home.
    celebrate() {
        const cx = Math.round(this.view.width / 2);
        const cy = S(40);
        playFanfare(this);
        Sweets.reset(this);
        this.registry.set('stickers', (this.registry.get('stickers') || 0) + 1);

        this.charImage.setTexture(this.character.id);
        this.tweens.add({ targets: this.panel, scale: 0, duration: 300, onComplete: () => this.panel.setVisible(false) });

        const star = this.add.graphics({ x: cx, y: cy }).setDepth(50);
        Icons.star(star, 0, 0, S(24));
        Icons.tooth(star, 0, S(1), S(18));
        star.setScale(0);
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
            mirror: { draw: (g, s) => Icons.dentalMirror(g, 0, 0, s), onTap: () => this.useMirror() },
            toothbrush: { draw: (g, s) => Icons.toothbrush(g, 0, 0, s), onTap: () => this.startBrushing() },
            cup: { draw: (g, s) => Icons.cup(g, 0, 0, s), onTap: () => this.rinse() }
        };
        this.tools = {};
        Object.entries(defs).forEach(([key, def], i) => {
            const button = PixelUI.createIconButton(this, Math.round(width / 2 + (i - 1) * gap), y, size, def.draw, def.onTap);
            // Small heart marks a step that is done.
            const mark = this.add.graphics();
            Icons.heart(mark, S(14), -S(14), S(12));
            mark.setVisible(false);
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
            rinsed: this.mapButton
        }[this.step];
        if (next) {
            this.hintTween = PixelUI.pulse(this, next);
        }
    }

    goToMap() {
        this.registry.set('mapLocation', 'dentist');
        PixelUI.fadeTo(this, 'MapScene');
    }
}
