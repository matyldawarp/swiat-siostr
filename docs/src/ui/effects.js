// Small animations shared by the scenes: rewards floating away and walking bounces.

import { PALETTE, PixelUI, S, textStyle } from './pixel.js';
import { createHeartTexture } from '../gfx/hamster.js';

// Round-cornered badge showing a personality's icon (data/personalities.js), centred on
// (x, y). Returns a container; redraw it for another personality with setPersonality().
export function addPersonalityBadge(scene, x, y, personality, size = S(22)) {
    const g = scene.add.graphics();
    const badge = scene.add.container(x, y, [g]);
    badge.setPersonality = (p) => {
        g.clear();
        PixelUI.drawBox(g, -size / 2, -size / 2, size, size, 0xffffff, PALETTE.buttonBorder);
        p.icon(g, 0, 0, Math.round(size * 0.7));
    };
    badge.setPersonality(personality);
    return badge;
}

// Moves `target` by (dx, dy) while it fades out in pixel-art steps, then destroys it.
export function floatAway(scene, target, { dx = 0, dy = 0, duration = 800, steps = 6, delay = 0 } = {}) {
    return scene.tweens.add({
        targets: target,
        x: target.x + dx,
        y: target.y + dy,
        alpha: 0,
        delay,
        duration,
        ease: 'Stepped',
        easeParams: [steps],
        onComplete: () => target.destroy()
    });
}

// A pixel heart rising from (x, y): the "that was nice" reward after a tap.
export function floatHeart(scene, x, y, { depth = 20, delay = 0, rise = S(24), duration = 800 } = {}) {
    createHeartTexture(scene);
    const heart = scene.add.image(x, y, 'heart').setScale(3).setDepth(depth);
    floatAway(scene, heart, { dy: -rise, duration, delay });
    return heart;
}

// One sleepy "z" drifting up and to the right; pass a running count, every third is a capital Z.
export function floatZ(scene, x, y, index, { depth = 16 } = {}) {
    const big = index % 3 === 2;
    const z = PixelUI.addText(scene, x, y, big ? 'Z' : 'z', textStyle(big ? S(12) : S(9), { bold: true }))
        .setOrigin(0.5)
        .setDepth(depth);
    floatAway(scene, z, { dx: S(14), dy: -S(24), duration: 1800 });
    return z;
}

// Endless little bounce of a character's image (inside its container) while it walks or
// runs. Stop the returned tween and set image.y = 0 to end it.
export function walkBob(scene, image, { height = S(2), duration = 120 } = {}) {
    return scene.tweens.add({
        targets: image,
        y: -height,
        duration,
        yoyo: true,
        repeat: -1,
        ease: 'Stepped',
        easeParams: [1]
    });
}
