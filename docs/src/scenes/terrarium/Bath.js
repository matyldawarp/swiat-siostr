import { S } from '../../ui/pixel.js';
import { addImage } from '../../gfx/images.js';
import { playBubble } from '../../audio/sfx.js';
import { Activity } from './Activity.js';
import { DEPTH, P } from './config.js';

// Bubble bath: the hamster hops into the foam, wiggles and sends bubbles up.
export class Bath extends Activity {
    // The tank from TerrariumScene; the tub stands on its floor right of the middle.
    constructor(scene, tank) {
        super(scene, 'bath');
        this.tank = tank;
    }

    create() {
        const scene = this.scene;
        const { x, w, floorY } = this.tank;
        const tw = S(52);
        const th = S(18);
        const feet = S(4);
        const cx = Math.round(x + w * 0.68);
        const top = floorY - feet - th;
        this.x = cx;
        this.w = tw;
        this.rimY = top;

        // Water surface behind the hamster; the tub on its feet in front, with the foam heaped
        // along the rim so the hamster looks covered in bubbles. Both anchored on the rim's middle.
        addImage(scene, cx, top, P + 'wanna-woda').setDepth(DEPTH.bathBack);
        addImage(scene, cx, top, P + 'wanna').setDepth(DEPTH.bathFront);

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
        this.timer = scene.time.delayedCall(this.stayMs(4000, 7000), () => scene.leaveActivity());
    }

    floatBubble() {
        const scene = this.scene;
        // Radius 3 to 6: pictures babelek-3 to babelek-6.
        const r = Phaser.Math.Between(S(2), S(4));
        const bubble = addImage(scene, Math.round(this.x + Phaser.Math.Between(-this.w / 2 + 6, this.w / 2 - 6)),
            this.rimY - S(4), `${P}babelek-${r}`).setDepth(DEPTH.effects);

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
