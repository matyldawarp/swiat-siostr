import { PALETTE, PixelUI, S } from '../../ui/pixel.js';
import { playBubble } from '../../audio/sfx.js';
import { Activity } from './Activity.js';
import { DEPTH, TERRARIUM_COLORS } from './config.js';

// Bubble bath: the hamster hops into the foam, wiggles and sends bubbles up.
export class Bath extends Activity {
    // The tank from TerrariumScene; the tub stands on its floor right of the middle.
    constructor(scene, tank) {
        super(scene);
        this.tank = tank;
    }

    create() {
        const C = TERRARIUM_COLORS;
        const scene = this.scene;
        const { x, w, floorY } = this.tank;
        const tw = S(52);
        const th = S(18);
        const feet = S(4);
        const cx = Math.round(x + w * 0.68);
        const left = cx - tw / 2;
        const top = floorY - feet - th;
        this.x = cx;
        this.w = tw;
        this.rimY = top;

        // Water surface behind the hamster.
        const back = scene.add.graphics().setDepth(DEPTH.bathBack);
        back.fillStyle(PALETTE.outline, 1);
        back.fillRect(left + 2, top - S(3), tw - 4, S(3));
        back.fillStyle(C.water, 1);
        back.fillRect(left + 3, top - S(2), tw - 6, S(2));

        const front = scene.add.graphics().setDepth(DEPTH.bathFront);

        // Feet.
        front.fillStyle(C.tubFeet, 1);
        front.fillRect(left + S(5), floorY - feet, S(5), feet);
        front.fillRect(left + tw - S(10), floorY - feet, S(5), feet);

        // Tub body with a pastel stripe and a shaded bottom.
        PixelUI.drawBox(front, left, top, tw, th, C.tub, PALETTE.outline);
        front.fillStyle(C.tubShade, 1);
        front.fillRect(left + 2, top + th - S(5), tw - 4, S(3));
        front.fillStyle(C.tubStripe, 1);
        front.fillRect(left + 2, top + S(7), tw - 4, S(2));

        // Rim.
        front.fillStyle(PALETTE.outline, 1);
        front.fillRect(left - 2, top - 1, tw + 4, S(3) + 1);
        front.fillStyle(C.tubRim, 1);
        front.fillRect(left - 1, top, tw + 2, S(3) - 1);

        // Foam heaped along the rim; in front of the hamster so it looks covered in bubbles.
        const blobs = [-0.38, -0.2, 0, 0.2, 0.38];
        [[C.foamShade, 1], [C.foam, 0]].forEach(([color, grow]) => {
            front.fillStyle(color, 1);
            blobs.forEach((f, i) => {
                const r = i % 2 === 0 ? S(5) : S(4);
                PixelUI.fillCircle(front, Math.round(cx + f * tw), top - S(1), r + grow);
            });
        });

        const zone = scene.add.zone(cx, top + th / 2 - S(4), tw, th + S(12)).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => scene.startActivity(this));
    }

    // Approach from whichever side the hamster is on, and leave the same way.
    approachX() {
        this.sideX = this.scene.hamster.x < this.x ? this.x - this.w / 2 - S(10) : this.x + this.w / 2 + S(10);
        return this.sideX;
    }

    enter(done) {
        const scene = this.scene;
        // Lands low enough that only the ears and eyes show above the foam.
        // Behind the front of the tub from the top of the jump onwards.
        scene.time.delayedCall(180, () => scene.hamster.setDepth(DEPTH.hamsterInBath));
        scene.hopTo(this.x, this.rimY - S(7), done);
    }

    start() {
        const scene = this.scene;

        // Happy wiggle from side to side.
        this.wiggle = scene.tweens.add({
            targets: scene.hamster,
            x: scene.hamster.x + S(2),
            duration: 200,
            yoyo: true,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [1]
        });

        this.bubbleTimer = scene.time.addEvent({ delay: 260, loop: true, callback: () => this.floatBubble() });
        this.timer = scene.time.delayedCall(Phaser.Math.Between(4000, 7000), () => scene.leaveActivity());
    }

    floatBubble() {
        const scene = this.scene;
        const r = Phaser.Math.Between(S(2), S(4));
        const bubble = scene.add.graphics({
            x: Math.round(this.x + Phaser.Math.Between(-this.w / 2 + 6, this.w / 2 - 6)),
            y: this.rimY - S(4)
        }).setDepth(DEPTH.effects);
        bubble.fillStyle(TERRARIUM_COLORS.foamShade, 1);
        PixelUI.fillCircle(bubble, 0, 0, r);
        bubble.fillStyle(0xffffff, 1);
        PixelUI.fillCircle(bubble, 0, 0, r - 1);
        bubble.fillStyle(TERRARIUM_COLORS.water, 1);
        bubble.fillRect(-Math.ceil(r / 2), -Math.ceil(r / 2), 1, 1);

        if (Math.random() < 0.5) {
            playBubble(scene);
        }

        scene.tweens.add({
            targets: bubble,
            y: bubble.y - Phaser.Math.Between(S(20), S(40)),
            x: bubble.x + Phaser.Math.Between(-S(6), S(6)),
            alpha: 0,
            duration: 1400,
            ease: 'Stepped',
            easeParams: [8],
            onComplete: () => bubble.destroy()
        });
    }

    stop() {
        this.bubbleTimer?.remove();
        this.timer?.remove();
        this.wiggle?.stop();
    }

    leave(done) {
        const scene = this.scene;
        // Back in front of the tub once it is over the rim.
        scene.time.delayedCall(180, () => scene.hamster.setDepth(DEPTH.hamster));
        scene.hopTo(this.sideX, scene.hamsterGroundY, done);
    }
}
