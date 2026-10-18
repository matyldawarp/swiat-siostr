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
        this.createHamster(tank, layout);

        this.add.text(cx, height - S(14), 'Dotknij chomika', {
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

        // Wheel on the left.
        const wr = Math.max(S(14), Math.min(S(24), Math.round(h * 0.18)));
        const wcx = x + S(14) + wr;
        const wcy = floorY - wr - S(6);
        g.fillStyle(C.wheelStand, 1);
        g.fillRect(wcx - 1, wcy, S(3), floorY - wcy);
        g.fillRect(wcx - S(6), floorY - S(2), S(13), S(2));
        g.fillStyle(C.wheel, 1);
        PixelUI.fillCircle(g, wcx, wcy, wr);
        g.fillStyle(C.glass, 1);
        PixelUI.fillCircle(g, wcx, wcy, wr - S(3));
        g.fillStyle(C.wheel, 1);
        g.fillRect(wcx - wr + S(2), wcy, (wr - S(2)) * 2 + 1, S(1));
        g.fillRect(wcx, wcy - wr + S(2), S(1), (wr - S(2)) * 2 + 1);
        PixelUI.fillCircle(g, wcx, wcy, S(2));

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

    createHamster(tank, { minX, maxX }) {
        const scale = TERRARIUM_HAMSTER_SCALE;
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
        this.wander(minX, maxX);
    }

    wander(minX, maxX) {
        const targetX = Phaser.Math.Between(minX, maxX);
        const distance = Math.abs(targetX - this.hamster.x);

        const hop = this.tweens.add({
            targets: this.hamsterImage,
            y: -S(2),
            duration: 120,
            yoyo: true,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [1]
        });

        this.tweens.add({
            targets: this.hamster,
            x: targetX,
            duration: Math.max(300, distance * 20),
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
            y: this.hamsterGroundY - S(8),
            duration: 120,
            yoyo: true,
            ease: 'Sine.easeOut'
        });

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
