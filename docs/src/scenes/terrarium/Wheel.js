import { PixelUI, S } from '../../ui/pixel.js';
import { spriteHalf } from '../../gfx/hamster.js';
import { walkBob } from '../../ui/effects.js';
import { playWheelTick } from '../../audio/sfx.js';
import { Activity } from './Activity.js';
import { HAMSTER_SCALE, TERRARIUM_COLORS } from './config.js';

// Running wheel on the left: the hamster hops in and runs while the spokes spin.
export class Wheel extends Activity {
    // { x, y, r }: centre and radius, from drawTank().
    constructor(scene, { x, y, r }) {
        super(scene);
        this.x = x;
        this.y = y;
        this.r = r;
        this.angle = 0;
    }

    create() {
        this.graphics = this.scene.add.graphics();
        this.draw();

        // Tapping the wheel invites the hamster in; sits above the glass zone for input.
        const zone = this.scene.add.zone(this.x, this.y, this.r * 2, this.r * 2).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => this.scene.startActivity(this));
    }

    draw() {
        const C = TERRARIUM_COLORS;
        const g = this.graphics;
        const { x, y, r } = this;
        const rim = S(3);

        g.clear();
        g.fillStyle(C.wheel, 1);
        PixelUI.fillCircle(g, x, y, r);
        g.fillStyle(C.glass, 1);
        PixelUI.fillCircle(g, x, y, r - rim);

        // Four spokes; redrawn at a new angle on every spin step.
        g.fillStyle(C.wheel, 1);
        for (let k = 0; k < 4; k++) {
            const a = Phaser.Math.DegToRad(this.angle + k * 90);
            for (let t = 0; t < r - rim; t++) {
                g.fillRect(Math.round(x + Math.cos(a) * t), Math.round(y + Math.sin(a) * t), 2, 2);
            }
        }
        g.fillStyle(C.wheelStand, 1);
        PixelUI.fillCircle(g, x, y, S(3));
    }

    approachX() {
        return this.x + this.r + spriteHalf(HAMSTER_SCALE);
    }

    enter(done) {
        // Feet on the inside of the rim.
        const insideY = this.y + this.r - S(3) - spriteHalf(HAMSTER_SCALE) + S(1);
        this.scene.hopTo(this.x, insideY, done);
    }

    start() {
        const scene = this.scene;
        this.bob = walkBob(scene, scene.hamsterImage, { duration: 70 });

        let step = 0;
        this.spinTimer = scene.time.addEvent({
            delay: 50,
            loop: true,
            callback: () => {
                // Spokes roll backwards under the running hamster.
                this.angle = (this.angle - 15 + 360) % 360;
                this.draw();
                if (++step % 6 === 0) {
                    playWheelTick(scene);
                }
            }
        });

        this.timer = scene.time.delayedCall(Phaser.Math.Between(3000, 6000), () => scene.leaveActivity());
    }

    stop() {
        this.spinTimer?.remove();
        this.timer?.remove();
        this.bob?.stop();
        this.scene.hamsterImage.y = 0;
    }

    leave(done) {
        this.scene.hopTo(this.approachX(), this.scene.hamsterGroundY, done);
    }
}
