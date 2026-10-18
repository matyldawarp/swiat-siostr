import { PixelUI, S, TEXT_COLORS, textStyle } from '../ui/pixel.js';
import { addCharacter, createSeedTexture, spriteHalf } from '../gfx/hamster.js';
import { Icons } from '../gfx/icons.js';
import { ILLNESS, Illness } from '../ui/illness.js';
import { addPersonalityBadge, floatHeart, walkBob } from '../ui/effects.js';
import { getPersonality } from '../data/personalities.js';
import { playCharacterSound, playCrunch } from '../audio/sfx.js';
import { BaseScene } from './BaseScene.js';
import { DEPTH, HAMSTER_SCALE, MAX_SEEDS, SEED_SCALE } from './terrarium/config.js';
import { drawTank } from './terrarium/tank.js';
import { Wheel } from './terrarium/Wheel.js';
import { Bath } from './terrarium/Bath.js';
import { House } from './terrarium/House.js';
import { Poops } from './terrarium/Poops.js';

// The hamster's glass tank: it wanders, eats dropped seeds, now and then goes to one of
// its activities (terrarium/Activity.js explains how those work) and sometimes leaves a
// dropping that the girls clean up with a finger (terrarium/Poops.js). How often it does
// what, and how fast, comes from its personality (data/personalities.js).
//
// this.phase is what the hamster is doing:
//   'idle'       standing or strolling about
//   'walking'    on its way to this.activity
//   'entering', 'inside', 'leaving'   at this.activity
//   'goingToEat', 'eating'            after a landed seed
export class TerrariumScene extends BaseScene {
    constructor() {
        super('TerrariumScene');
    }

    init(data) {
        super.init(data);
        this.character = this.selectedCharacter();
        this.personality = getPersonality(this.character);
        this.phase = 'idle';
        this.activity = null;
        this.seeds = [];
        this.sickBubble = null;
    }

    build({ width, height }) {
        const cx = Math.round(width / 2);
        createSeedTexture(this);

        PixelUI.drawSky(this, width, height);

        const tank = {
            w: Math.min(width - S(24), S(480)),
            // Leaves room for the title above and the stand plus bottom bar below.
            h: Math.min(height - S(66), S(260))
        };
        tank.x = Math.round((width - tank.w) / 2);
        // Centre the tank in the space between the title and the bottom bar.
        tank.y = Math.max(S(30), Math.round((height - S(26) - tank.h) / 2 + 2));
        tank.beddingH = Math.max(S(18), Math.round(tank.h * 0.2));
        tank.floorY = tank.y + tank.h - tank.beddingH + S(2);

        const title = PixelUI.addTitle(this, cx, tank.y - S(16), this.character.name);
        // Personality icon right of the name.
        addPersonalityBadge(this, Math.round(cx + title.width / 2 + S(16)), tank.y - S(16), this.personality, S(20));

        const layout = drawTank(this, tank);

        // Tapping the glass drops a seed; created before the hamster so taps on it go to the hamster.
        const glass = this.add.zone(tank.x + tank.w / 2, tank.y + tank.h / 2, tank.w, tank.h).setInteractive();
        glass.on('pointerdown', (pointer) => this.dropSeed(pointer.worldX, pointer.worldY));

        this.createActivities(tank, layout);
        this.poops = new Poops(this, {
            walkArea: layout.walkArea,
            groundY: tank.floorY + S(2),
            keepOut: [{ x: this.activities.bath.x, halfW: this.activities.bath.w / 2 }]
        });
        this.poops.create();
        this.createHamster(tank, layout.walkArea);

        PixelUI.createButton(this, width - S(40), height - S(14), 'Ziarno', () => {
            const { minX, maxX } = this.walkArea;
            this.dropSeed(Phaser.Math.Between(minX, maxX), tank.y + S(10));
        }, { width: S(64), height: S(18), fontSize: S(10) });

        PixelUI.addText(this, cx, height - S(14), 'Dotknij postaci albo szyby',
            textStyle(S(8), { color: TEXT_COLORS.hint })).setOrigin(0.5);

        PixelUI.createButton(this, S(36), height - S(14), 'Wróć', () => this.back(), { width: S(56), height: S(18), fontSize: S(10) });

        // Map to travel to other places, e.g. the hospital.
        this.mapButton = PixelUI.createIconButton(this, S(20), S(20), S(28), (g, size) => Icons.map(g, 0, 0, size), () => {
            this.registry.set('mapLocation', 'home');
            PixelUI.fadeTo(this, 'MapScene');
        });
        // Kitchen: bake this character's own cake, which the button shows.
        PixelUI.createIconButton(this, S(54), S(20), S(28),
            (g, size) => Icons.characterCake(g, this.character, 0, Math.round(size * 0.3), Math.round(size * 0.8)),
            () => PixelUI.fadeTo(this, 'KitchenScene'));
        this.input.keyboard.on('keydown-ESC', () => this.back());

        if (Illness.isSick(this)) {
            this.showSickness();
        } else {
            this.scheduleCold();
        }
    }

    // Each activity draws its own place and tap zone, in this order (later ones get taps first).
    createActivities(tank, layout) {
        this.activities = {
            wheel: new Wheel(this, layout.wheel),
            bath: new Bath(this, tank),
            house: new House(this, layout.house)
        };
        Object.values(this.activities).forEach((activity) => activity.create());
    }

    // --- Activities --------------------------------------------------------------

    startActivity(activity) {
        if (this.phase !== 'idle' || this.hasLandedSeed()) {
            return;
        }
        // Too poorly for a run or a bath: a sneeze says so.
        if (!activity.okWhenSick && Illness.isSick(this)) {
            this.sneeze();
            return;
        }
        this.activity = activity;
        this.phase = 'walking';
        this.walkTo(activity.approachX(), () => this.enterActivity(), activity.walkSpeed * this.personality.walkSpeed);
    }

    enterActivity() {
        this.phase = 'entering';
        this.activity.enter(() => {
            // A seed landed on the way in: food first.
            if (this.hasLandedSeed()) {
                this.leaveActivity();
                return;
            }
            this.phase = 'inside';
            this.activity.start();
        });
    }

    // Ends the current activity (its timer ran out, a tap, or food); then looks for seeds.
    leaveActivity() {
        if (this.phase !== 'entering' && this.phase !== 'inside') {
            return;
        }
        this.activity.stop();
        this.phase = 'leaving';
        this.activity.leave(() => {
            this.activity = null;
            this.phase = 'idle';
            this.goEat();
        });
    }

    // Jumps along a small arc to (x, y), then calls onLand.
    hopTo(x, y, onLand) {
        const peakY = Math.min(this.hamster.y, y) - S(14);
        this.tweens.chain({
            targets: this.hamster,
            tweens: [
                { x: (this.hamster.x + x) / 2, y: peakY, duration: 180, ease: 'Quad.easeOut' },
                { x, y, duration: 180, ease: 'Quad.easeIn' }
            ],
            onComplete: onLand
        });
    }

    // --- Catching a cold -----------------------------------------------------

    scheduleCold() {
        this.coldTimer = this.time.delayedCall(Phaser.Math.Between(ILLNESS.minDelayMs, ILLNESS.maxDelayMs), () => {
            if (Illness.canGetSick(this)) {
                Illness.setSick(this, true);
                this.showSickness();
                this.sneeze();
            } else {
                this.scheduleCold();
            }
        });
    }

    // Thermometer bubble over the hamster, regular sneezes and a pulsing map button.
    showSickness() {
        this.sickBubble = Illness.createBubble(this).setDepth(DEPTH.effects);
        this.mapPulse = PixelUI.pulse(this, this.mapButton);
        this.sneezeTimer = this.time.addEvent({
            delay: 6000,
            loop: true,
            callback: () => this.sneeze()
        });
    }

    sneeze() {
        if (this.phase !== 'idle') {
            return;
        }
        Illness.sneeze(this, this.hamsterImage, this.hamster, this.character, {
            x: this.hamster.x,
            y: this.hamster.y + 2 * this.hamsterImage.scaleY
        }, this.hamsterGroundY);
    }

    update() {
        // Keep the sick bubble just above the hamster's head, whatever its size.
        if (this.sickBubble) {
            const top = this.hamster.y + this.hamsterImage.y - 8 * this.hamsterImage.scaleY;
            this.sickBubble.setPosition(Math.round(this.hamster.x + S(20)), Math.round(top - S(14)));
        }
    }

    // --- Hamster -------------------------------------------------------------

    createHamster(tank, walkArea) {
        this.walkArea = walkArea;
        this.seedGroundY = tank.floorY - S(4);

        const startX = Math.round((walkArea.minX + walkArea.maxX) / 2);
        // Sprite is 16px tall around its centre; sink it slightly into the bedding.
        this.hamsterGroundY = tank.floorY - (spriteHalf(HAMSTER_SCALE) - S(4));
        const hamster = addCharacter(this, this.character, startX, this.hamsterGroundY, {
            scale: HAMSTER_SCALE,
            depth: DEPTH.hamster,
            onTap: () => this.poke()
        });
        this.hamster = hamster.container;
        this.hamsterImage = hamster.image;

        this.wanderTimer = this.time.delayedCall(800, () => this.wander());
    }

    // --- Movement -------------------------------------------------------------

    stopMoving() {
        this.walkTween?.stop();
        this.walkBobTween?.stop();
        this.wanderTimer?.remove();
        this.hamsterImage.y = 0;
    }

    // msPerPixel: 20 is a stroll, lower is faster.
    walkTo(targetX, onArrive, msPerPixel = 20) {
        this.stopMoving();
        const distance = Math.abs(targetX - this.hamster.x);

        this.walkBobTween = walkBob(this, this.hamsterImage);
        this.walkTween = this.tweens.add({
            targets: this.hamster,
            x: targetX,
            duration: Math.max(200, distance * msPerPixel),
            onComplete: () => {
                this.walkBobTween.stop();
                this.hamsterImage.y = 0;
                onArrive();
            }
        });
    }

    wander() {
        if (this.phase !== 'idle') {
            return;
        }
        const { minX, maxX } = this.walkArea;
        const p = this.personality;
        const next = () => {
            this.wanderTimer = this.time.delayedCall(Phaser.Math.Between(1200, 3500), () => this.wander());
        };

        // A sick hamster takes it easy: slow strolls and naps, no wheel or bath.
        if (Illness.isSick(this)) {
            if (Math.random() < 0.25) {
                this.startActivity(this.activities.house);
            } else {
                this.walkTo(Phaser.Math.Between(minX, maxX), next, 32 * p.walkSpeed);
            }
            return;
        }

        if (Math.random() < 0.08) {
            this.poop();
        }
        // A cheerful one jumps for joy now and then.
        if (Math.random() < p.happyHop) {
            PixelUI.hop(this, this.hamster, this.hamsterGroundY, S(10), { duration: 150, repeat: 1 });
            this.showHeart();
        }

        // A stroll, a run in the wheel, a nap or a bath, as often as its personality likes.
        const choice = this.pickWeighted(p.wander);
        if (choice === 'stroll') {
            this.walkTo(Phaser.Math.Between(minX, maxX), next, 20 * p.walkSpeed);
        } else {
            this.startActivity(this.activities[choice]);
        }
    }

    // A key of `weights` ({ key: relative weight }), picked at random by weight.
    pickWeighted(weights) {
        const entries = Object.entries(weights);
        let roll = Math.random() * entries.reduce((sum, [, w]) => sum + w, 0);
        for (const [key, w] of entries) {
            roll -= w;
            if (roll < 0) {
                return key;
            }
        }
        return entries[0][0];
    }

    // --- Sunflower seeds ------------------------------------------------------

    hasLandedSeed() {
        return this.seeds.some((s) => s.landed);
    }

    dropSeed(x, fromY) {
        if (this.seeds.length >= MAX_SEEDS) {
            return;
        }
        const { minX, maxX } = this.walkArea;
        const seedX = Phaser.Math.Clamp(Math.round(x), minX, maxX);
        const startY = Math.min(fromY, this.seedGroundY - S(10));

        const seed = this.add.image(seedX, startY, 'seed').setScale(SEED_SCALE).setDepth(DEPTH.seed);
        seed.landed = false;
        this.seeds.push(seed);

        this.tweens.add({
            targets: seed,
            y: this.seedGroundY,
            duration: 250 + (this.seedGroundY - startY) * 2,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                seed.landed = true;
                this.goEat();
            }
        });
    }

    // Walks to the nearest seed on the ground, or goes back to wandering.
    goEat() {
        if (this.phase === 'eating' || this.phase === 'goingToEat') {
            return;
        }
        // Food beats everything: come out of the activity first; it calls goEat() again.
        if (this.phase === 'inside') {
            this.leaveActivity();
            return;
        }
        // Mid-jump in or out: goEat() runs again once it is done.
        if (this.phase === 'entering' || this.phase === 'leaving') {
            return;
        }

        const landed = this.seeds.filter((s) => s.landed);
        if (landed.length === 0) {
            this.phase = 'idle';
            this.wanderTimer = this.time.delayedCall(Phaser.Math.Between(800, 2000), () => this.wander());
            return;
        }

        const hamsterX = this.hamster.x;
        const seed = landed.reduce((a, b) => (Math.abs(a.x - hamsterX) <= Math.abs(b.x - hamsterX) ? a : b));

        // Forget any activity it was walking to, and hurry over for food.
        this.activity = null;
        this.phase = 'goingToEat';
        this.walkTo(seed.x, () => this.eat(seed), 10 * this.personality.seedHurry);
    }

    eat(seed) {
        this.phase = 'eating';
        this.seeds = this.seeds.filter((s) => s !== seed);

        // Pick the seed up in the paws, then chew it away.
        const pawsY = this.hamsterGroundY + spriteHalf(HAMSTER_SCALE) / 2;
        this.tweens.add({ targets: seed, y: pawsY, duration: 150, ease: 'Quad.easeOut' });

        const id = this.character.id;
        const bites = 8;
        let bite = 0;

        this.time.addEvent({
            delay: 140,
            repeat: bites - 1,
            callback: () => {
                bite++;
                const chewing = bite % 2 === 1;
                this.hamsterImage.setTexture(chewing ? `${id}-chew` : id);
                if (chewing) {
                    playCrunch(this);
                }
                // Seed shrinks in steps as it is nibbled.
                seed.setScale(SEED_SCALE * (1 - bite / bites));

                if (bite === bites) {
                    this.hamsterImage.setTexture(id);
                    seed.destroy();
                    this.showHearts(this.personality.eatHearts);
                    this.phase = 'idle';
                    this.goEat();
                    // What goes in comes out, a little later.
                    if (Math.random() < this.personality.poopChance) {
                        this.time.delayedCall(Phaser.Math.Between(1500, 4000), () => this.poop());
                    }
                }
            }
        });
    }

    // --- Droppings -------------------------------------------------------------

    // A little hop and a dropping just behind the hamster, if it is on the ground.
    poop() {
        if (this.phase !== 'idle') {
            return;
        }
        const side = Math.random() < 0.5 ? -1 : 1;
        if (this.poops.drop(this.hamster.x + side * S(16))) {
            PixelUI.hop(this, this.hamster, this.hamsterGroundY, S(3), { duration: 90 });
        }
    }

    // The last dropping was cleaned: the hamster is delighted.
    onTankClean() {
        playCharacterSound(this, this.character.sound);
        if (this.phase === 'idle' || this.phase === 'goingToEat' || this.phase === 'eating') {
            PixelUI.hop(this, this.hamster, this.hamsterGroundY, S(8), { duration: 160, repeat: 1 });
        }
        this.showHearts(3);
    }

    poke() {
        playCharacterSound(this, this.character.sound);

        // At an activity (off the ground or in the house) the activity decides.
        if (this.activity && this.phase !== 'walking') {
            this.activity.poke();
            return;
        }

        // Little jump; the walking bob keeps animating the image, so jump the container.
        PixelUI.hop(this, this.hamster, this.hamsterGroundY, Math.round(S(8) * this.personality.pokeHop));
        this.showHearts(this.personality.pokeHearts);
    }

    // `count` hearts, one after another.
    showHearts(count) {
        for (let i = 0; i < count; i++) {
            this.time.delayedCall(i * 150, () => this.showHeart());
        }
    }

    showHeart() {
        const top = this.hamster.y - spriteHalf(HAMSTER_SCALE) - S(4);
        floatHeart(this, this.hamster.x + Phaser.Math.Between(-S(10), S(10)), top, {
            depth: DEPTH.effects,
            rise: S(20),
            duration: 700
        });
    }

    back() {
        PixelUI.fadeTo(this, 'CharacterScene');
    }
}
