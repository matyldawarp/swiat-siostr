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

class TerrariumScene extends Phaser.Scene {
    constructor() {
        super('TerrariumScene');
    }

    init(data) {
        this.leaving = false;
        this.skipIntro = Boolean(data.resized);
        this.character = getCharacter(this.registry.get('selectedCharacter'));
    }

    create() {
        const { width, height } = this.scale;
        const cx = Math.round(width / 2);

        this.cameras.main.setSize(width, height);
        createHamsterTextures(this, this.character);
        createHeartTexture(this);

        PixelUI.drawSky(this, width, height);

        const tank = {
            w: Math.min(width - 24, 480),
            h: Math.min(height - 56, 260)
        };
        tank.x = Math.round((width - tank.w) / 2);
        // Centre the tank in the space between the title and the bottom bar.
        tank.y = Math.max(30, Math.round((height - 26 - tank.h) / 2 + 2));

        PixelUI.addTitle(this, cx, tank.y - 16, this.character.name);
        tank.beddingH = Math.max(18, Math.round(tank.h * 0.2));
        tank.floorY = tank.y + tank.h - tank.beddingH + 2;

        const layout = this.drawTank(tank);
        this.createHamster(tank, layout);

        this.add.text(cx, height - 14, 'Dotknij chomika', {
            fontFamily: FONT,
            fontSize: '8px',
            color: TEXT_COLORS.hint
        }).setOrigin(0.5);

        PixelUI.createButton(this, 36, height - 14, 'Wróć', () => this.back(), { width: 56, height: 18, fontSize: 10 });
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

        // Stand under the tank.
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(x - 6, y + h + 1, w + 12, 7);
        g.fillStyle(C.stand, 1);
        g.fillRect(x - 5, y + h + 2, w + 10, 4);
        g.fillStyle(C.standShade, 1);
        g.fillRect(x - 5, y + h + 5, w + 10, 1);

        // Glass with outline.
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(x - 2, y - 2, w + 4, h + 4);
        g.fillStyle(C.glass, 1);
        g.fillRect(x, y, w, h);
        g.fillStyle(C.glassTop, 1);
        g.fillRect(x, y, w, 3);

        // Lid.
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(x - 5, y - 8, w + 10, 7);
        g.fillStyle(C.lid, 1);
        g.fillRect(x - 4, y - 7, w + 8, 4);
        g.fillStyle(C.lidShade, 1);
        g.fillRect(x - 4, y - 4, w + 8, 1);

        // Bedding with a slightly uneven top edge and speckles.
        const beddingTop = y + h - beddingH;
        for (let i = 0; i < w; i++) {
            const top = beddingTop + Math.round(Math.sin(i / 7) + Math.sin(i / 3.1) * 0.6);
            g.fillStyle(C.bedding, 1);
            g.fillRect(x + i, top, 1, y + h - top);
        }
        g.fillStyle(C.beddingDark, 1);
        for (let i = 0; i < w * beddingH / 14; i++) {
            g.fillRect(x + Phaser.Math.Between(0, w - 2), Phaser.Math.Between(beddingTop + 3, y + h - 2), 2, 1);
        }

        // Wheel on the left.
        const wr = Math.max(14, Math.min(24, Math.round(h * 0.18)));
        const wcx = x + 14 + wr;
        const wcy = floorY - wr - 6;
        g.fillStyle(C.wheelStand, 1);
        g.fillRect(wcx - 1, wcy, 3, floorY - wcy);
        g.fillRect(wcx - 6, floorY - 2, 13, 2);
        g.fillStyle(C.wheel, 1);
        PixelUI.fillCircle(g, wcx, wcy, wr);
        g.fillStyle(C.glass, 1);
        PixelUI.fillCircle(g, wcx, wcy, wr - 3);
        g.fillStyle(C.wheel, 1);
        g.fillRect(wcx - wr + 2, wcy, (wr - 2) * 2 + 1, 1);
        g.fillRect(wcx, wcy - wr + 2, 1, (wr - 2) * 2 + 1);
        PixelUI.fillCircle(g, wcx, wcy, 2);

        // House on the right.
        const hw = 40;
        const hh = 28;
        const hx = x + w - hw - 14;
        const hy = floorY - hh;
        for (let r = 0; r < 10; r++) {
            g.fillStyle(r === 0 ? PALETTE.outline : C.roof, 1);
            g.fillRect(hx + hw / 2 - r * 2 - 2, hy - 10 + r, r * 4 + 4, 1);
        }
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(hx - 1, hy, hw + 2, hh);
        g.fillStyle(C.house, 1);
        g.fillRect(hx, hy, hw, hh);
        g.fillStyle(C.houseShade, 1);
        g.fillRect(hx, hy, hw, 2);
        g.fillStyle(C.door, 1);
        g.fillRect(hx + hw / 2 - 5, hy + hh - 15, 10, 15);
        g.fillRect(hx + hw / 2 - 6, hy + hh - 13, 12, 13);

        // Water bottle hanging on the right wall.
        const bx = x + w - 11;
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(bx - 1, y + 7, 9, 26);
        g.fillStyle(C.bottle, 1);
        g.fillRect(bx, y + 8, 7, 24);
        g.fillStyle(C.water, 1);
        g.fillRect(bx, y + 18, 7, 14);
        g.fillStyle(C.spout, 1);
        g.fillRect(bx + 2, y + 33, 2, 9);

        // Food bowl in the middle.
        const bowlX = Math.round(x + w * 0.45);
        g.fillStyle(C.bowlRim, 1);
        g.fillRect(bowlX - 11, floorY - 6, 22, 2);
        g.fillStyle(C.bowl, 1);
        g.fillRect(bowlX - 10, floorY - 4, 20, 4);
        g.fillStyle(C.seed, 1);
        [-6, -2, 3, 7].forEach((dx, i) => g.fillRect(bowlX + dx, floorY - 7 - (i % 2), 2, 1));

        // Glass reflections drawn last so they sit on top of the furniture.
        g.fillStyle(0xffffff, 0.8);
        for (let i = 0; i < 12; i++) {
            g.fillRect(x + 6 + i, y + 18 - i, 1, 1);
        }
        for (let i = 0; i < 6; i++) {
            g.fillRect(x + 12 + i, y + 18 - i, 1, 1);
        }

        const minX = wcx + wr + 20;
        const maxX = hx - 20;
        return maxX - minX > 20
            ? { minX, maxX }
            : { minX: x + 30, maxX: x + w - 30 };
    }

    createHamster(tank, { minX, maxX }) {
        const startX = Math.round((minX + maxX) / 2);
        this.hamsterGroundY = tank.floorY - 22;
        this.hamster = this.add.container(startX, this.hamsterGroundY);

        const image = this.add.image(0, 0, this.character.id).setScale(3);
        this.hamster.add(image);
        this.hamsterImage = image;

        image.setInteractive({ useHandCursor: true });
        image.on('pointerdown', () => this.poke());

        startBlinking(this, image, this.character);
        this.wander(minX, maxX);
    }

    wander(minX, maxX) {
        const targetX = Phaser.Math.Between(minX, maxX);
        const distance = Math.abs(targetX - this.hamster.x);

        const hop = this.tweens.add({
            targets: this.hamsterImage,
            y: -2,
            duration: 120,
            yoyo: true,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [1]
        });

        this.tweens.add({
            targets: this.hamster,
            x: targetX,
            duration: Math.max(300, distance * 30),
            onComplete: () => {
                hop.stop();
                this.hamsterImage.y = 0;
                this.time.delayedCall(Phaser.Math.Between(1200, 3500), () => this.wander(minX, maxX));
            }
        });
    }

    poke() {
        playCharacterSound(this, this.character.sound);

        // Little jump; the walking hop keeps animating the image, so jump the container.
        // Restart from the ground so quick repeated taps don't make it drift upwards.
        if (this.jumpTween) {
            this.jumpTween.stop();
        }
        this.hamster.y = this.hamsterGroundY;
        this.jumpTween = this.tweens.add({
            targets: this.hamster,
            y: this.hamsterGroundY - 8,
            duration: 120,
            yoyo: true,
            ease: 'Sine.easeOut'
        });

        const heart = this.add.image(this.hamster.x + Phaser.Math.Between(-10, 10), this.hamster.y - 28, 'heart')
            .setScale(2);
        this.tweens.add({
            targets: heart,
            y: heart.y - 20,
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
