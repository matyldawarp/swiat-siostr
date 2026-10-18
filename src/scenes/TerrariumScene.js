const TERRARIUM_COLORS = {
    glass: 0xeef8ff,
    glassTop: 0xddeefa,
    lid: 0xd9ccf5,
    lidShade: 0xc3b3ea,
    stand: 0xe9c9b5,
    standShade: 0xd8b39c,
    bedding: 0xf6e3c4,
    beddingDark: 0xe8cc9e,
    house: 0xf7b2cc,
    houseShade: 0xeea0bd,
    roof: 0xd9a0c8,
    door: 0x8a5c9e,
    wheel: 0xc9b8ef,
    wheelStand: 0xb8a6dc,
    bowl: 0xbfe8d6,
    bowlRim: 0xa6dcc4,
    seed: 0xe0a46c,
    bottle: 0xcfe8ff,
    water: 0x9fd0f5,
    spout: 0xb7b0c4,
    tub: 0xffffff,
    tubShade: 0xe6eefc,
    tubRim: 0xf7f9ff,
    tubStripe: 0xf7b2cc,
    tubFeet: 0xd9a0c8,
    foam: 0xffffff,
    foamShade: 0xdcd3f2
};

// Whole-number sprite scale for the hamster inside the tank.
const TERRARIUM_HAMSTER_SCALE = 4;
const TERRARIUM_MAX_SEEDS = 5;
const TERRARIUM_SEED_SCALE = 3;

// Draw order inside the tank. The hamster drops to DEPTH.hamsterInBath while bathing so the
// front of the tub hides its body; otherwise it walks in front of the tub.
const DEPTH = {
    bathBack: 2,
    hamsterInBath: 8,
    bathFront: 9,
    hamster: 10,
    seed: 12,
    effects: 13
};

class TerrariumScene extends Phaser.Scene {
    constructor() {
        super('TerrariumScene');
    }

    init(data) {
        this.leaving = false;
        this.skipIntro = Boolean(data.resized);
        this.character = getCharacter(this.registry.get('selectedCharacter'));
        this.state = 'idle';
        this.seeds = [];
        this.sickBubble = null;
    }

    create() {
        const { width, height } = PixelUI.setupView(this);
        const cx = Math.round(width / 2);
        createHamsterTextures(this, this.character);
        createHeartTexture(this);
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

        PixelUI.addTitle(this, cx, tank.y - S(16), this.character.name);

        const layout = this.drawTank(tank);

        // Tapping the glass drops a seed; created before the hamster so taps on it go to the hamster.
        const glass = this.add.zone(tank.x + tank.w / 2, tank.y + tank.h / 2, tank.w, tank.h).setInteractive();
        glass.on('pointerdown', (pointer) => this.dropSeed(pointer.worldX, pointer.worldY));

        this.createWheel();
        this.createBath(tank);

        // Tapping the house sends the hamster to bed, or wakes it up.
        const { x: hx, y: hy, w: hw, h: hh } = this.house;
        const houseZone = this.add.zone(hx + hw / 2, hy + hh / 2 - S(5), hw, hh + S(10)).setInteractive({ useHandCursor: true });
        houseZone.on('pointerdown', () => (this.state === 'sleeping' ? this.wakeUp() : this.goToSleep()));

        this.createHamster(tank, layout);

        PixelUI.createButton(this, width - S(40), height - S(14), 'Ziarno', () => {
            const { minX, maxX } = this.walkArea;
            this.dropSeed(Phaser.Math.Between(minX, maxX), tank.y + S(10));
        }, { width: S(64), height: S(18), fontSize: S(10) });

        PixelUI.addText(this, cx, height - S(14), 'Dotknij chomika albo szyby', {
            fontFamily: FONT,
            fontSize: `${S(8)}px`,
            color: TEXT_COLORS.hint
        }).setOrigin(0.5);

        PixelUI.createButton(this, S(36), height - S(14), 'Wróć', () => this.back(), { width: S(56), height: S(18), fontSize: S(10) });

        // Map to travel to other places, e.g. the hospital.
        this.mapButton = PixelUI.createIconButton(this, S(20), S(20), S(28), (g, size) => Icons.map(g, 0, 0, size), () => {
            this.registry.set('mapLocation', 'home');
            PixelUI.fadeTo(this, 'MapScene');
        });
        this.input.keyboard.on('keydown-ESC', () => this.back());

        if (Illness.isSick(this)) {
            this.showSickness();
        } else {
            this.scheduleCold();
        }

        if (!this.skipIntro) {
            PixelUI.fadeIn(this);
        }
        PixelUI.restartOnResize(this);
    }

    // Draws the glass tank and its furniture; returns where the hamster may walk.
    drawTank({ x, y, w, h, beddingH, floorY }) {
        const C = TERRARIUM_COLORS;
        const g = this.add.graphics();
        const edge = S(2);

        // Stand under the tank.
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(x - S(6), y + h + 1, w + S(12), S(7));
        g.fillStyle(C.stand, 1);
        g.fillRect(x - S(5), y + h + 2, w + S(10), S(4));
        g.fillStyle(C.standShade, 1);
        g.fillRect(x - S(5), y + h + 1 + S(4), w + S(10), 1);

        // Glass with outline.
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(x - edge, y - edge, w + edge * 2, h + edge * 2);
        g.fillStyle(C.glass, 1);
        g.fillRect(x, y, w, h);
        g.fillStyle(C.glassTop, 1);
        g.fillRect(x, y, w, S(3));

        // Lid.
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(x - S(5), y - S(8), w + S(10), S(7));
        g.fillStyle(C.lid, 1);
        g.fillRect(x - S(4), y - S(7), w + S(8), S(4));
        g.fillStyle(C.lidShade, 1);
        g.fillRect(x - S(4), y - S(3), w + S(8), 1);

        // Bedding with a slightly uneven top edge and speckles.
        const beddingTop = y + h - beddingH;
        for (let i = 0; i < w; i++) {
            const top = beddingTop + Math.round(Math.sin(i / S(7)) * S(1) + Math.sin(i / S(3)) * 0.6);
            g.fillStyle(C.bedding, 1);
            g.fillRect(x + i, top, 1, y + h - top);
        }
        g.fillStyle(C.beddingDark, 1);
        for (let i = 0; i < w * beddingH / 14; i++) {
            g.fillRect(x + Phaser.Math.Between(0, w - 2), Phaser.Math.Between(beddingTop + S(3), y + h - 2), 2, 1);
        }

        // Wheel stand on the left; the wheel itself is drawn by drawWheel() so it can spin.
        // The inside must fit the hamster sprite (16px x TERRARIUM_HAMSTER_SCALE).
        const wr = Math.max(S(28), Math.min(S(36), Math.round(h * 0.2)));
        const wcx = x + S(10) + wr;
        const wcy = floorY - wr - S(6);
        g.fillStyle(C.wheelStand, 1);
        g.fillRect(wcx - 1, wcy, S(3), floorY - wcy);
        g.fillRect(wcx - S(8), floorY - S(2), S(17), S(2));
        this.wheel = { x: wcx, y: wcy, r: wr };

        // House on the right.
        const hw = S(40);
        const hh = S(28);
        const hx = x + w - hw - S(14);
        const hy = floorY - hh;
        const roofRows = S(10);
        for (let r = 0; r < roofRows; r++) {
            g.fillStyle(r === 0 ? PALETTE.outline : C.roof, 1);
            g.fillRect(hx + hw / 2 - r * 2 - 2, hy - roofRows + r, r * 4 + 4, 1);
        }
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(hx - 1, hy, hw + 2, hh);
        g.fillStyle(C.house, 1);
        g.fillRect(hx, hy, hw, hh);
        g.fillStyle(C.houseShade, 1);
        g.fillRect(hx, hy, hw, S(2));
        g.fillStyle(C.door, 1);
        g.fillRect(hx + hw / 2 - S(5), hy + hh - S(15), S(10), S(15));
        g.fillRect(hx + hw / 2 - S(6), hy + hh - S(13), S(12), S(13));
        this.house = { x: hx, y: hy, w: hw, h: hh, doorX: Math.round(hx + hw / 2), doorBottom: hy + hh };

        // Water bottle hanging on the right wall.
        const bx = x + w - S(11);
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(bx - 1, y + S(7), S(7) + 2, S(26));
        g.fillStyle(C.bottle, 1);
        g.fillRect(bx, y + S(8), S(7), S(24));
        g.fillStyle(C.water, 1);
        g.fillRect(bx, y + S(18), S(7), S(14));
        g.fillStyle(C.spout, 1);
        g.fillRect(bx + S(2), y + S(33), S(2), S(9));

        // Food bowl in the middle.
        const bowlX = Math.round(x + w * 0.45);
        g.fillStyle(C.bowlRim, 1);
        g.fillRect(bowlX - S(11), floorY - S(6), S(22), S(2));
        g.fillStyle(C.bowl, 1);
        g.fillRect(bowlX - S(10), floorY - S(4), S(20), S(4));
        g.fillStyle(C.seed, 1);
        [-6, -2, 3, 7].forEach((dx, i) => g.fillRect(bowlX + S(dx), floorY - S(7) - (i % 2), S(2), S(1)));

        // Glass reflections drawn last so they sit on top of the furniture.
        g.fillStyle(0xffffff, 0.8);
        for (let i = 0; i < S(12); i++) {
            g.fillRect(x + S(6) + i, y + S(18) - i, 1, 1);
        }
        for (let i = 0; i < S(6); i++) {
            g.fillRect(x + S(12) + i, y + S(18) - i, 1, 1);
        }

        const margin = 8 * TERRARIUM_HAMSTER_SCALE + S(6);
        const minX = wcx + wr + margin;
        const maxX = hx - margin;
        return maxX - minX > S(20)
            ? { minX, maxX }
            : { minX: x + margin, maxX: x + w - margin };
    }

    // --- Wheel ---------------------------------------------------------------

    createWheel() {
        const { x, y, r } = this.wheel;
        this.wheelAngle = 0;
        this.wheelGraphics = this.add.graphics();
        this.drawWheel();

        // Tapping the wheel invites the hamster in; sits above the glass zone for input.
        const zone = this.add.zone(x, y, r * 2, r * 2).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => this.goToWheel());
    }

    drawWheel() {
        const C = TERRARIUM_COLORS;
        const g = this.wheelGraphics;
        const { x, y, r } = this.wheel;
        const rim = S(3);

        g.clear();
        g.fillStyle(C.wheel, 1);
        PixelUI.fillCircle(g, x, y, r);
        g.fillStyle(C.glass, 1);
        PixelUI.fillCircle(g, x, y, r - rim);

        // Four spokes; redrawn at a new angle on every spin step.
        g.fillStyle(C.wheel, 1);
        for (let k = 0; k < 4; k++) {
            const a = Phaser.Math.DegToRad(this.wheelAngle + k * 90);
            for (let t = 0; t < r - rim; t++) {
                g.fillRect(Math.round(x + Math.cos(a) * t), Math.round(y + Math.sin(a) * t), 2, 2);
            }
        }
        g.fillStyle(C.wheelStand, 1);
        PixelUI.fillCircle(g, x, y, S(3));
    }

    goToWheel() {
        if (this.state !== 'idle' || this.seeds.some((s) => s.landed)) {
            return;
        }
        // Too poorly for a run: a sneeze says so.
        if (Illness.isSick(this)) {
            this.sneeze();
            return;
        }
        this.state = 'goingToWheel';
        const { x, r } = this.wheel;
        this.walkTo(x + r + 8 * TERRARIUM_HAMSTER_SCALE, () => this.enterWheel(), 12);
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

    enterWheel() {
        this.state = 'entering';
        const { x, y, r } = this.wheel;
        // Feet on the inside of the rim.
        const insideY = y + r - S(3) - 8 * TERRARIUM_HAMSTER_SCALE + S(1);

        this.hopTo(x, insideY, () => {
            if (this.seeds.some((s) => s.landed)) {
                this.leaveWheel();
                return;
            }
            this.runInWheel();
        });
    }

    runInWheel() {
        this.state = 'running';

        this.hopTween = this.tweens.add({
            targets: this.hamsterImage,
            y: -S(2),
            duration: 70,
            yoyo: true,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [1]
        });

        let step = 0;
        this.spinTimer = this.time.addEvent({
            delay: 50,
            loop: true,
            callback: () => {
                // Spokes roll backwards under the running hamster.
                this.wheelAngle = (this.wheelAngle - 15 + 360) % 360;
                this.drawWheel();
                if (++step % 6 === 0) {
                    playWheelTick(this);
                }
            }
        });

        this.wheelTimer = this.time.delayedCall(Phaser.Math.Between(3000, 6000), () => this.leaveWheel());
    }

    leaveWheel() {
        if (this.spinTimer) {
            this.spinTimer.remove();
        }
        if (this.wheelTimer) {
            this.wheelTimer.remove();
        }
        if (this.hopTween) {
            this.hopTween.stop();
        }
        this.hamsterImage.y = 0;

        this.state = 'exiting';
        const { x, r } = this.wheel;
        this.hopTo(x + r + 8 * TERRARIUM_HAMSTER_SCALE, this.hamsterGroundY, () => {
            this.state = 'idle';
            this.goEat();
        });
    }

    // In the wheel or the bath: off the ground, so taps shouldn't make it jump.
    isInWheel() {
        return this.state === 'entering' || this.state === 'running' || this.state === 'exiting'
            || this.state === 'enteringBath' || this.state === 'bathing' || this.state === 'exitingBath';
    }

    // --- Bath -----------------------------------------------------------------

    createBath({ x, w, floorY }) {
        const C = TERRARIUM_COLORS;
        const tw = S(52);
        const th = S(18);
        const feet = S(4);
        const cx = Math.round(x + w * 0.68);
        const left = cx - tw / 2;
        const top = floorY - feet - th;
        this.bath = { x: cx, w: tw, rimY: top };

        // Water surface behind the hamster.
        const back = this.add.graphics().setDepth(DEPTH.bathBack);
        back.fillStyle(PALETTE.outline, 1);
        back.fillRect(left + 2, top - S(3), tw - 4, S(3));
        back.fillStyle(TERRARIUM_COLORS.water, 1);
        back.fillRect(left + 3, top - S(2), tw - 6, S(2));

        const front = this.add.graphics().setDepth(DEPTH.bathFront);

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
        blobs.forEach((f, i) => {
            const bx = Math.round(cx + f * tw);
            const r = i % 2 === 0 ? S(5) : S(4);
            front.fillStyle(C.foamShade, 1);
            PixelUI.fillCircle(front, bx, top - S(1), r + 1);
        });
        blobs.forEach((f, i) => {
            const bx = Math.round(cx + f * tw);
            const r = i % 2 === 0 ? S(5) : S(4);
            front.fillStyle(C.foam, 1);
            PixelUI.fillCircle(front, bx, top - S(1), r);
        });

        const zone = this.add.zone(cx, top + th / 2 - S(4), tw, th + S(12)).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => this.goToBath());
    }

    goToBath() {
        if (this.state !== 'idle' || this.seeds.some((s) => s.landed)) {
            return;
        }
        if (Illness.isSick(this)) {
            this.sneeze();
            return;
        }
        this.state = 'goingToBath';
        const { x, w } = this.bath;
        // Approach from whichever side the hamster is on.
        this.bathSideX = this.hamster.x < x ? x - w / 2 - S(10) : x + w / 2 + S(10);
        this.walkTo(this.bathSideX, () => this.enterBath(), 12);
    }

    enterBath() {
        this.state = 'enteringBath';
        const { x, rimY } = this.bath;

        // Lands low enough that only the ears and eyes show above the foam.
        // Behind the front of the tub from the top of the jump onwards.
        this.time.delayedCall(180, () => this.hamster.setDepth(DEPTH.hamsterInBath));
        this.hopTo(x, rimY - S(7), () => {
            if (this.seeds.some((s) => s.landed)) {
                this.leaveBath();
                return;
            }
            this.bathe();
        });
    }

    bathe() {
        this.state = 'bathing';
        const baseX = this.hamster.x;

        // Happy wiggle from side to side.
        this.hopTween = this.tweens.add({
            targets: this.hamster,
            x: baseX + S(2),
            duration: 200,
            yoyo: true,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [1]
        });

        this.bubbleTimer = this.time.addEvent({
            delay: 260,
            loop: true,
            callback: () => this.floatBubble()
        });

        this.bathTimer = this.time.delayedCall(Phaser.Math.Between(4000, 7000), () => this.leaveBath());
    }

    floatBubble() {
        const { x, w, rimY } = this.bath;
        const r = Phaser.Math.Between(S(2), S(4));
        const bubble = this.add.graphics({ x: Math.round(x + Phaser.Math.Between(-w / 2 + 6, w / 2 - 6)), y: rimY - S(4) })
            .setDepth(DEPTH.effects);
        bubble.fillStyle(TERRARIUM_COLORS.foamShade, 1);
        PixelUI.fillCircle(bubble, 0, 0, r);
        bubble.fillStyle(0xffffff, 1);
        PixelUI.fillCircle(bubble, 0, 0, r - 1);
        bubble.fillStyle(TERRARIUM_COLORS.water, 1);
        bubble.fillRect(-Math.ceil(r / 2), -Math.ceil(r / 2), 1, 1);

        if (Math.random() < 0.5) {
            playBubble(this);
        }

        this.tweens.add({
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

    leaveBath() {
        if (this.bubbleTimer) {
            this.bubbleTimer.remove();
        }
        if (this.bathTimer) {
            this.bathTimer.remove();
        }
        if (this.hopTween) {
            this.hopTween.stop();
        }

        this.state = 'exitingBath';
        // Back in front of the tub once it is over the rim.
        this.time.delayedCall(180, () => this.hamster.setDepth(DEPTH.hamster));
        this.hopTo(this.bathSideX, this.hamsterGroundY, () => {
            this.state = 'idle';
            this.goEat();
        });
    }

    // --- Sleeping in the house -----------------------------------------------

    goToSleep() {
        if (this.state !== 'idle' || this.seeds.some((s) => s.landed)) {
            return;
        }
        this.state = 'goingToSleep';
        this.walkTo(this.house.doorX, () => this.enterHouse(), 14);
    }

    // Shrinks in steps into the doorway, as if walking deeper inside.
    enterHouse() {
        this.state = 'enteringHouse';
        const { doorX, doorBottom } = this.house;

        this.tweens.add({ targets: this.hamster, x: doorX, y: doorBottom - 9, duration: 600 });
        this.tweens.add({
            targets: this.hamsterImage,
            scale: 1,
            duration: 600,
            ease: 'Stepped',
            easeParams: [3],
            onComplete: () => {
                if (this.seeds.some((s) => s.landed)) {
                    this.wakeUp();
                    return;
                }
                this.sleep();
            }
        });
    }

    sleep() {
        this.state = 'sleeping';
        this.hamsterImage.setTexture(`${this.character.id}-blink`);

        let count = 0;
        this.zzzTimer = this.time.addEvent({
            delay: 900,
            loop: true,
            callback: () => this.floatZ(count++)
        });
        this.sleepTimer = this.time.delayedCall(Phaser.Math.Between(6000, 10000), () => this.wakeUp());
    }

    // One "z" drifting up from the roof; every third is a capital Z.
    floatZ(index) {
        const { x, y, w } = this.house;
        const big = index % 3 === 2;
        const z = PixelUI.addText(this, x + w / 2 + S(6), y - S(8), big ? 'Z' : 'z', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: `${big ? S(12) : S(9)}px`,
            color: TEXT_COLORS.title
        }).setOrigin(0.5).setDepth(DEPTH.effects);

        playSnore(this);

        this.tweens.add({
            targets: z,
            x: z.x + S(14),
            y: z.y - S(24),
            alpha: 0,
            duration: 1800,
            ease: 'Stepped',
            easeParams: [6],
            onComplete: () => z.destroy()
        });
    }

    wakeUp() {
        if (this.zzzTimer) {
            this.zzzTimer.remove();
        }
        if (this.sleepTimer) {
            this.sleepTimer.remove();
        }

        this.state = 'leavingHouse';
        this.hamsterImage.setTexture(this.character.id);

        this.tweens.add({ targets: this.hamster, y: this.hamsterGroundY, duration: 600 });
        this.tweens.add({
            targets: this.hamsterImage,
            scale: TERRARIUM_HAMSTER_SCALE,
            duration: 600,
            ease: 'Stepped',
            easeParams: [3],
            onComplete: () => {
                this.state = 'idle';
                this.goEat();
            }
        });
    }

    isInHouse() {
        return this.state === 'enteringHouse' || this.state === 'sleeping' || this.state === 'leavingHouse';
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
        if (this.state !== 'idle') {
            return;
        }
        Illness.sneeze(this, this.hamsterImage, this.hamster, this.character, {
            x: this.hamster.x,
            y: this.hamster.y + 2 * this.hamsterImage.scaleY
        });
    }

    update() {
        // Keep the sick bubble just above the hamster's head, whatever its size.
        if (this.sickBubble) {
            const top = this.hamster.y + this.hamsterImage.y - 8 * this.hamsterImage.scaleY;
            this.sickBubble.setPosition(Math.round(this.hamster.x + S(20)), Math.round(top - S(14)));
        }
    }

    // --- Hamster -------------------------------------------------------------

    createHamster(tank, { minX, maxX }) {
        const scale = TERRARIUM_HAMSTER_SCALE;
        this.walkArea = { minX, maxX };
        this.seedGroundY = tank.floorY - S(4);

        const startX = Math.round((minX + maxX) / 2);
        // Sprite is 16px tall around its centre; sink it slightly into the bedding.
        this.hamsterGroundY = tank.floorY - (8 * scale - S(4));
        this.hamster = this.add.container(startX, this.hamsterGroundY).setDepth(DEPTH.hamster);

        const image = this.add.image(0, 0, this.character.id).setScale(scale);
        this.hamster.add(image);
        this.hamsterImage = image;

        image.setInteractive({ useHandCursor: true });
        image.on('pointerdown', () => this.poke());

        startBlinking(this, image, this.character);
        this.wanderTimer = this.time.delayedCall(800, () => this.wander());
    }

    // --- Movement -------------------------------------------------------------

    stopMoving() {
        if (this.walkTween) {
            this.walkTween.stop();
        }
        if (this.hopTween) {
            this.hopTween.stop();
        }
        if (this.wanderTimer) {
            this.wanderTimer.remove();
        }
        this.hamsterImage.y = 0;
    }

    // msPerPixel: 20 is a stroll, lower is faster.
    walkTo(targetX, onArrive, msPerPixel = 20) {
        this.stopMoving();
        const distance = Math.abs(targetX - this.hamster.x);

        this.hopTween = this.tweens.add({
            targets: this.hamsterImage,
            y: -S(2),
            duration: 120,
            yoyo: true,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [1]
        });

        this.walkTween = this.tweens.add({
            targets: this.hamster,
            x: targetX,
            duration: Math.max(200, distance * msPerPixel),
            onComplete: () => {
                this.hopTween.stop();
                this.hamsterImage.y = 0;
                onArrive();
            }
        });
    }

    wander() {
        if (this.state !== 'idle') {
            return;
        }
        const { minX, maxX } = this.walkArea;
        const next = () => {
            this.wanderTimer = this.time.delayedCall(Phaser.Math.Between(1200, 3500), () => this.wander());
        };

        // A sick hamster takes it easy: slow strolls and naps, no wheel or bath.
        if (Illness.isSick(this)) {
            if (Math.random() < 0.25) {
                this.goToSleep();
            } else {
                this.walkTo(Phaser.Math.Between(minX, maxX), next, 32);
            }
            return;
        }

        // Now and then go for a run in the wheel or a nap instead of a stroll.
        const roll = Math.random();
        if (roll < 0.3) {
            this.goToWheel();
            return;
        }
        if (roll < 0.45) {
            this.goToSleep();
            return;
        }
        if (roll < 0.6) {
            this.goToBath();
            return;
        }
        this.walkTo(Phaser.Math.Between(minX, maxX), next);
    }

    // --- Sunflower seeds ------------------------------------------------------

    dropSeed(x, fromY) {
        if (this.seeds.length >= TERRARIUM_MAX_SEEDS) {
            return;
        }
        const { minX, maxX } = this.walkArea;
        const seedX = Phaser.Math.Clamp(Math.round(x), minX, maxX);
        const startY = Math.min(fromY, this.seedGroundY - S(10));

        const seed = this.add.image(seedX, startY, 'seed').setScale(TERRARIUM_SEED_SCALE).setDepth(DEPTH.seed);
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
        if (this.state === 'eating' || this.state === 'goingToEat') {
            return;
        }
        // Food beats exercise: hop out of the wheel first. Mid-jump states call goEat() when they land.
        if (this.state === 'running') {
            this.leaveWheel();
            return;
        }
        if (this.state === 'bathing') {
            this.leaveBath();
            return;
        }
        if (this.state === 'sleeping') {
            this.wakeUp();
            return;
        }
        if (this.state === 'entering' || this.state === 'exiting'
            || this.state === 'enteringHouse' || this.state === 'leavingHouse'
            || this.state === 'enteringBath' || this.state === 'exitingBath') {
            return;
        }

        const landed = this.seeds.filter((s) => s.landed);
        if (landed.length === 0) {
            this.state = 'idle';
            this.wanderTimer = this.time.delayedCall(Phaser.Math.Between(800, 2000), () => this.wander());
            return;
        }

        const hamsterX = this.hamster.x;
        const seed = landed.reduce((a, b) => (Math.abs(a.x - hamsterX) <= Math.abs(b.x - hamsterX) ? a : b));

        this.state = 'goingToEat';
        // Hurry over for food.
        this.walkTo(seed.x, () => this.eat(seed), 10);
    }

    eat(seed) {
        this.state = 'eating';
        this.seeds = this.seeds.filter((s) => s !== seed);

        // Pick the seed up in the paws, then chew it away.
        const pawsY = this.hamsterGroundY + 4 * TERRARIUM_HAMSTER_SCALE;
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
                seed.setScale(TERRARIUM_SEED_SCALE * (1 - bite / bites));

                if (bite === bites) {
                    this.hamsterImage.setTexture(id);
                    seed.destroy();
                    this.showHeart();
                    this.state = 'idle';
                    this.goEat();
                }
            }
        });
    }

    poke() {
        playCharacterSound(this, this.character.sound);

        if (this.state === 'sleeping') {
            this.wakeUp();
            return;
        }
        if (this.isInHouse()) {
            return;
        }

        // In the wheel the hamster is off the ground, so no jump there.
        if (this.isInWheel()) {
            this.showHeart();
            return;
        }

        // Little jump; the walking hop keeps animating the image, so jump the container.
        // Restart from the ground so quick repeated taps don't make it drift upwards.
        if (this.jumpTween) {
            this.jumpTween.stop();
        }
        this.hamster.y = this.hamsterGroundY;
        this.jumpTween = this.tweens.add({
            targets: this.hamster,
            y: this.hamsterGroundY - S(8),
            duration: 120,
            yoyo: true,
            ease: 'Sine.easeOut'
        });

        this.showHeart();
    }

    showHeart() {
        const top = this.hamster.y - 8 * TERRARIUM_HAMSTER_SCALE - S(4);
        const heart = this.add.image(this.hamster.x + Phaser.Math.Between(-S(10), S(10)), top, 'heart')
            .setScale(3).setDepth(DEPTH.effects);
        this.tweens.add({
            targets: heart,
            y: heart.y - S(20),
            alpha: 0,
            duration: 700,
            ease: 'Stepped',
            easeParams: [6],
            onComplete: () => heart.destroy()
        });
    }

    back() {
        PixelUI.fadeTo(this, 'CharacterScene');
    }
}
