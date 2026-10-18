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
    spout: 0xb7b0c4
};

// Whole-number sprite scale for the hamster inside the tank.
const TERRARIUM_HAMSTER_SCALE = 4;
const TERRARIUM_MAX_SEEDS = 5;
const TERRARIUM_SEED_SCALE = 3;

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
        this.input.keyboard.on('keydown-ESC', () => this.back());

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

    isInWheel() {
        return this.state === 'entering' || this.state === 'running' || this.state === 'exiting';
    }

    // --- Hamster -------------------------------------------------------------

    createHamster(tank, { minX, maxX }) {
        const scale = TERRARIUM_HAMSTER_SCALE;
        this.walkArea = { minX, maxX };
        this.seedGroundY = tank.floorY - S(4);

        const startX = Math.round((minX + maxX) / 2);
        // Sprite is 16px tall around its centre; sink it slightly into the bedding.
        this.hamsterGroundY = tank.floorY - (8 * scale - S(4));
        this.hamster = this.add.container(startX, this.hamsterGroundY);

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
        // Now and then go for a run in the wheel instead of a stroll.
        if (Math.random() < 0.3) {
            this.goToWheel();
            return;
        }
        const { minX, maxX } = this.walkArea;
        this.walkTo(Phaser.Math.Between(minX, maxX), () => {
            this.wanderTimer = this.time.delayedCall(Phaser.Math.Between(1200, 3500), () => this.wander());
        });
    }

    // --- Sunflower seeds ------------------------------------------------------

    dropSeed(x, fromY) {
        if (this.seeds.length >= TERRARIUM_MAX_SEEDS) {
            return;
        }
        const { minX, maxX } = this.walkArea;
        const seedX = Phaser.Math.Clamp(Math.round(x), minX, maxX);
        const startY = Math.min(fromY, this.seedGroundY - S(10));

        const seed = this.add.image(seedX, startY, 'seed').setScale(TERRARIUM_SEED_SCALE);
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
        if (this.state === 'entering' || this.state === 'exiting') {
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
            .setScale(3);
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
