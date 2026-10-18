// The hamster sometimes catches a cold. It never gets worse: it just sneezes and shows a
// thermometer bubble until the girls take it to the hospital.

const ILLNESS = {
    // A fresh cold can't start this soon after being healed.
    cooldownMs: 60000,
    // Time spent in the terrarium before a cold may start.
    minDelayMs: 45000,
    maxDelayMs: 90000
};

const Illness = {
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

    // Speech bubble with a thermometer, bobbing gently. Position it each frame.
    createBubble(scene, size = S(26)) {
        const g = scene.add.graphics();
        const half = Math.round(size / 2);

        PixelUI.drawBox(g, -half, -half, size, size, 0xffffff, PALETTE.outline);
        // Tail pointing down-left towards the hamster.
        for (let i = 0; i < S(5); i++) {
            g.fillStyle(PALETTE.outline, 1);
            g.fillRect(-half + S(3) - i, half - 1 + i, S(5) - i + 1, 1);
            g.fillStyle(0xffffff, 1);
            g.fillRect(-half + S(3) - i + 1, half - 1 + i, Math.max(0, S(5) - i - 1), 1);
        }
        Icons.thermometer(g, 0, 0, Math.round(size * 0.7), 0.85);

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
            const puff = scene.add.graphics({ x: Math.round(mouth.x), y: Math.round(mouth.y) }).setDepth(20);
            puff.fillStyle(0xffffff, 1);
            PixelUI.fillCircle(puff, 0, 0, S(2));
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
