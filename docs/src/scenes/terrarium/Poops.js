import { PALETTE, S } from '../../ui/pixel.js';
import { floatAway, floatHeart } from '../../ui/effects.js';
import { createPoopTexture } from '../../gfx/hamster.js';
import { playFanfare, playPlop, playSparkle } from '../../audio/sfx.js';
import { DEPTH, MAX_POOPS, POOP_SCALE } from './config.js';

const REGISTRY_KEY = 'poops';

// Little droppings on the bedding. The hamster leaves one now and then; touching it with a
// finger (a tap or a swipe across it) cleans it away with sparkles and a heart, and cleaning
// the last one plays a fanfare. They stay in the tank until cleaned, also after leaving the
// scene: positions are kept in the registry per character, as fractions of the walk area.
export class Poops {
    // walkArea { minX, maxX } where droppings may land, groundY where their bottom rests,
    // keepOut [{ x, halfW }] spans to avoid (e.g. behind the bath, where they'd be hidden).
    constructor(scene, { walkArea, groundY, keepOut = [] }) {
        this.scene = scene;
        this.walkArea = walkArea;
        this.groundY = groundY;
        this.keepOut = keepOut;
        this.items = [];
    }

    create() {
        // A rebuild after a resize or rotation can replay a touch that was still held;
        // ignore touches for a moment so that doesn't clean droppings by itself.
        this.readyAt = this.scene.time.now + 400;
        createPoopTexture(this.scene);
        this.saved().forEach((f) => this.add(this.fromFraction(f), false));
    }

    get full() {
        return this.items.length >= MAX_POOPS;
    }

    // Leaves a dropping near x, with a soft plop. Returns false if there is no room for one.
    drop(x) {
        const px = this.full ? null : this.freeX(x);
        if (px === null) {
            return false;
        }
        this.add(px, true);
        this.save();
        playPlop(this.scene);
        return true;
    }

    // Saved droppings come back where they were, even if the window is now narrower.
    add(x, animate) {
        const scene = this.scene;
        const { minX, maxX } = this.walkArea;
        const px = Phaser.Math.Clamp(Math.round(x), minX, maxX);
        const image = scene.add.image(px, this.groundY, 'poop')
            .setOrigin(0.5, 1)
            .setScale(POOP_SCALE)
            .setDepth(DEPTH.poop);

        // Bigger than the drawing so small fingers find it; above the glass so it gets the tap.
        const size = S(30);
        const zone = scene.add.zone(px, this.groundY - image.displayHeight / 2, size, size)
            .setDepth(DEPTH.poop)
            .setInteractive({ useHandCursor: true });
        const poop = { image, zone, x: px, cleaned: false };
        zone.on('pointerdown', () => this.clean(poop));
        // Swiping across it with the finger down cleans it too.
        zone.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.clean(poop);
            }
        });
        this.items.push(poop);

        if (animate) {
            // Drops in with a tiny bounce.
            image.setScale(POOP_SCALE, 1);
            scene.tweens.add({ targets: image, scaleY: POOP_SCALE, duration: 220, ease: 'Back.easeOut' });
        }
        return poop;
    }

    clean(poop) {
        if (poop.cleaned || this.scene.time.now < this.readyAt) {
            return;
        }
        poop.cleaned = true;
        const scene = this.scene;
        this.items = this.items.filter((p) => p !== poop);
        this.save();
        poop.zone.destroy();

        playSparkle(scene);
        const cy = this.groundY - poop.image.displayHeight / 2;
        this.sparkle(poop.x, cy);
        floatHeart(scene, poop.x, cy - S(6), { depth: DEPTH.effects });
        scene.tweens.add({
            targets: poop.image,
            scale: 0,
            duration: 250,
            ease: 'Stepped',
            easeParams: [3],
            onComplete: () => poop.image.destroy()
        });

        if (this.items.length === 0) {
            scene.time.delayedCall(300, () => {
                playFanfare(scene);
                scene.onTankClean?.();
            });
        }
    }

    // Small plus-shaped sparkles bursting out of the spot.
    sparkle(x, y) {
        const scene = this.scene;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const g = scene.add.graphics({ x, y }).setDepth(DEPTH.effects);
            g.fillStyle(PALETTE.sparkles[i % PALETTE.sparkles.length], 1);
            g.fillRect(-1, -S(2), 2, S(4) + 1);
            g.fillRect(-S(2), -1, S(4) + 1, 2);
            floatAway(scene, g, { dx: Math.round(Math.cos(angle) * S(16)), dy: Math.round(Math.sin(angle) * S(12)) - S(4), duration: 600, steps: 4 });
        }
    }

    // The free spot nearest to x: inside the walk area, not hidden behind anything in
    // keepOut and not on top of another dropping, or null when there is no room left.
    freeX(x) {
        const { minX, maxX } = this.walkArea;
        const wanted = Phaser.Math.Clamp(Math.round(x), minX, maxX);
        const gap = S(18);
        const free = (px) => this.keepOut.every(({ x: kx, halfW }) => Math.abs(px - kx) >= halfW + S(10))
            && this.items.every((p) => Math.abs(px - p.x) >= gap);

        for (let d = 0; d <= maxX - minX; d += S(4)) {
            for (const px of [wanted - d, wanted + d]) {
                if (px >= minX && px <= maxX && free(px)) {
                    return px;
                }
            }
        }
        return null;
    }

    fromFraction(f) {
        const { minX, maxX } = this.walkArea;
        return minX + f * (maxX - minX);
    }

    saved() {
        const all = this.scene.registry.get(REGISTRY_KEY) || {};
        return all[this.scene.character.id] || [];
    }

    save() {
        const { minX, maxX } = this.walkArea;
        const all = { ...(this.scene.registry.get(REGISTRY_KEY) || {}) };
        all[this.scene.character.id] = this.items.map((p) => (maxX > minX ? (p.x - minX) / (maxX - minX) : 0.5));
        this.scene.registry.set(REGISTRY_KEY, all);
    }
}
