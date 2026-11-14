// The hamster sometimes catches a cold. It never gets worse: it just sneezes and shows a
// thermometer bubble until the girls take it to the hospital.

import { PixelUI, S } from './pixel.js';
import { addImage } from '../gfx/images.js';
import { playSneeze } from '../audio/sfx.js';

// Pictures: docs/assets/gfx/choroba/. The bubble comes in two sizes.
const BUBBLES = { [S(26)]: 'choroba/dymek', [S(20)]: 'choroba/dymek-maly' };

export const ILLNESS = {
    // A fresh cold can't start this soon after being healed.
    cooldownMs: 60000,
    // Time spent in the terrarium before a cold may start.
    minDelayMs: 45000,
    maxDelayMs: 90000
};

export const Illness = {
    isSick(scene) {
        return Boolean(scene.registry.get('sick'));
    },

    setSick(scene, sick) {
        scene.registry.set('sick', sick);
        if (!sick) {
            scene.registry.set('lastHealed', Date.now());
        }
    },

    canGetSick(scene) {
        const lastHealed = scene.registry.get('lastHealed') || 0;
        return !Illness.isSick(scene) && Date.now() - lastHealed > ILLNESS.cooldownMs;
    },

    // Speech bubble with a thermometer and a tail pointing down-left towards the hamster,
    // bobbing gently; `size` is S(26) or S(20). Position it each frame.
    createBubble(scene, size = S(26)) {
        const g = addImage(scene, 0, 0, BUBBLES[size]);
        const bubble = scene.add.container(0, 0, [g]);
        scene.tweens.add({
            targets: g,
            y: -S(2),
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [1]
        });
        return bubble;
    },

    // Squints, jolts and puffs; used wherever a sick hamster is shown.
    // groundY is where the container rests, so the jolt can't add up over time.
    sneeze(scene, image, container, character, mouth, groundY) {
        image.setTexture(`${character.id}-blink`);
        scene.time.delayedCall(350, () => {
            if (image.active) {
                image.setTexture(character.id);
            }
        });

        PixelUI.hop(scene, container, groundY, S(3), { duration: 80 });

        playSneeze(scene);

        [-1, 0, 1].forEach((dir) => {
            const puff = addImage(scene, Math.round(mouth.x), Math.round(mouth.y), 'choroba/kichniecie').setDepth(20);
            scene.tweens.add({
                targets: puff,
                x: puff.x + dir * S(14),
                y: puff.y + S(6) - Math.abs(dir) * S(2),
                alpha: 0,
                duration: 500,
                ease: 'Stepped',
                easeParams: [4],
                onComplete: () => puff.destroy()
            });
        });
    }
};
