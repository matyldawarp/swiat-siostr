import { S } from '../../ui/pixel.js';
import { floatZ } from '../../ui/effects.js';
import { playSnore } from '../../audio/sfx.js';
import { Activity } from './Activity.js';
import { DEPTH } from './config.js';

// The little house on the right: the hamster goes in for a nap and "z"s float from the roof.
// It is drawn by drawTank(); this adds the tap zone and the napping.
export class House extends Activity {
    // { x, y, w, h, doorX, doorBottom } from drawTank().
    constructor(scene, house) {
        super(scene, 'house');
        Object.assign(this, house);
        this.walkSpeed = 14;
        // A sick hamster may nap; it is good for it.
        this.okWhenSick = true;
    }

    create() {
        // Tapping the house sends the hamster to bed, or wakes it up.
        const zone = this.scene.add.zone(this.x + this.w / 2, this.y + this.h / 2 - S(5), this.w, this.h + S(10))
            .setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => this.tap());
    }

    tap() {
        const scene = this.scene;
        if (scene.activity === this && scene.phase === 'inside') {
            scene.leaveActivity();
        } else {
            scene.startActivity(this);
        }
    }

    approachX() {
        return this.doorX;
    }

    // Walks up to the door, blinks and slips inside: the hamster is hidden while it naps.
    enter(done) {
        const scene = this.scene;
        const id = scene.character.id;
        scene.tweens.add({ targets: scene.hamster, x: this.doorX, duration: 600 });
        scene.time.delayedCall(300, () => scene.hamsterImage.setTexture(`${id}-blink`));
        scene.time.delayedCall(600, () => {
            scene.hamsterImage.setVisible(false).setTexture(id);
            done();
        });
    }

    start() {
        const scene = this.scene;

        // One "z" drifting up from the roof at a time.
        let count = 0;
        this.zzzTimer = scene.time.addEvent({
            delay: 900,
            loop: true,
            callback: () => {
                floatZ(scene, this.x + this.w / 2 + S(6), this.y - S(8), count++, { depth: DEPTH.effects });
                playSnore(scene);
            }
        });
        this.timer = scene.time.delayedCall(this.stayMs(6000, 10000), () => scene.leaveActivity());
    }

    stop() {
        this.zzzTimer?.remove();
        this.timer?.remove();
    }

    // Comes out of the door blinking, then opens its eyes.
    leave(done) {
        const scene = this.scene;
        const id = scene.character.id;
        scene.hamster.y = scene.hamsterGroundY;
        scene.hamsterImage.setTexture(`${id}-blink`).setVisible(true);
        scene.time.delayedCall(300, () => scene.hamsterImage.setTexture(id));
        scene.time.delayedCall(600, done);
    }

    // Inside it is asleep: a tap wakes it up. Going in or out, taps do nothing.
    poke() {
        if (this.scene.phase === 'inside') {
            this.scene.leaveActivity();
        }
    }
}
