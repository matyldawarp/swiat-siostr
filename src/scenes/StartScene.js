class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    init(data) {
        this.leaving = false;
        this.skipIntro = Boolean(data.resized);
    }

    create() {
        const { width, height } = this.scale;
        const cx = Math.round(width / 2);
        const cy = Math.round(height / 2);

        this.cameras.main.setSize(width, height);

        PixelUI.drawSky(this, width, height);
        this.drawSun(width - 66, 42);
        this.drawClouds(width, height);
        this.drawHills(width, height);
        this.drawSparkles(width, height);

        const title = PixelUI.addTitle(this, cx, cy - 34, 'Świat Sióstr', 40);
        title.setStroke('#ffffff', 4);
        title.setShadow(2, 2, TEXT_COLORS.titleShadow, 0, true, true);
        title.setAlpha(0);

        const subtitle = this.add.text(cx, cy - 6, 'opowieść o dwóch siostrach', {
            fontFamily: FONT,
            fontSize: '12px',
            color: TEXT_COLORS.subtitle
        }).setOrigin(0.5).setAlpha(0);

        const buttonY = cy + 34;
        const button = PixelUI.createButton(this, cx, buttonY, 'Rozpocznij', () => this.startGame());
        button.setAlpha(0);
        this.tweens.add({
            targets: button,
            y: buttonY - 2,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [2]
        });

        const hint = this.add.text(cx, height - 10, 'Kliknij lub naciśnij Enter', {
            fontFamily: FONT,
            fontSize: '8px',
            color: TEXT_COLORS.hint
        }).setOrigin(0.5).setAlpha(0);

        if (this.skipIntro) {
            title.setAlpha(1).setY(title.y - 4);
            subtitle.setAlpha(1);
            button.setAlpha(1);
            hint.setAlpha(1);
        } else {
            this.tweens.add({ targets: title, alpha: 1, y: title.y - 4, duration: 1200, ease: 'Sine.easeOut' });
            this.tweens.add({ targets: subtitle, alpha: 1, duration: 1000, delay: 500 });
            this.tweens.add({ targets: [button, hint], alpha: 1, duration: 800, delay: 900 });
            this.cameras.main.fadeIn(600, ...PALETTE.fade);
        }

        this.input.keyboard.once('keydown-ENTER', () => this.startGame());
        this.input.keyboard.once('keydown-SPACE', () => this.startGame());

        PixelUI.restartOnResize(this);
    }

    drawSun(x, y) {
        const glow = this.add.graphics({ x, y });
        glow.fillStyle(PALETTE.sunGlow, 1);
        PixelUI.fillCircle(glow, 0, 0, 20);

        const sun = this.add.graphics({ x, y });
        sun.fillStyle(PALETTE.sun, 1);
        PixelUI.fillCircle(sun, 0, 0, 14);

        this.tweens.add({
            targets: glow,
            alpha: 0.3,
            duration: 2400,
            yoyo: true,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [4]
        });
    }

    drawClouds(width, height) {
        if (!this.textures.exists('cloud')) {
            const g = this.make.graphics({ x: 0, y: 0 }, false);
            g.fillStyle(PALETTE.cloudShade, 1);
            g.fillRect(2, 10, 44, 6);
            g.fillStyle(PALETTE.cloud, 1);
            g.fillRect(4, 8, 40, 6);
            g.fillRect(8, 4, 14, 6);
            g.fillRect(20, 0, 16, 10);
            g.fillRect(34, 4, 8, 6);
            g.generateTexture('cloud', 48, 16);
            g.destroy();
        }

        const clouds = [
            { x: Math.round(width * 0.13), y: 22 },
            { x: Math.round(width * 0.5), y: 14 },
            { x: Math.round(width * 0.91), y: Math.round(height * 0.43) }
        ];

        clouds.forEach(({ x, y }, i) => {
            const cloud = this.add.image(x, y, 'cloud');

            this.tweens.add({
                targets: cloud,
                x: x + 16,
                duration: 6000 + i * 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    drawHills(width, height) {
        const back = this.add.graphics();
        const front = this.add.graphics();

        for (let x = 0; x < width; x++) {
            const backTop = Math.round(height - 46 + Math.sin(x / 38) * 8 + Math.sin(x / 13) * 2);
            back.fillStyle(PALETTE.hillBack, 1);
            back.fillRect(x, backTop, 1, height - backTop);
            back.fillStyle(PALETTE.hillBackShade, 1);
            back.fillRect(x, backTop + 3, 1, 1);

            const frontTop = Math.round(height - 24 + Math.sin(x / 55 + 1.5) * 6);
            front.fillStyle(PALETTE.hillFront, 1);
            front.fillRect(x, frontTop, 1, height - frontTop);
            front.fillStyle(PALETTE.hillFrontLight, 1);
            front.fillRect(x, frontTop, 1, 2);
        }
    }

    drawSparkles(width, height) {
        for (let i = 0; i < 24; i++) {
            const x = Phaser.Math.Between(4, width - 4);
            const y = Phaser.Math.Between(4, height - 60);
            const color = Phaser.Utils.Array.GetRandom(PALETTE.sparkles);

            // Small plus-shaped sparkle.
            const sparkle = this.add.graphics({ x, y });
            sparkle.fillStyle(color, 1);
            sparkle.fillRect(0, -1, 1, 3);
            sparkle.fillRect(-1, 0, 3, 1);

            this.tweens.add({
                targets: sparkle,
                alpha: 0,
                duration: Phaser.Math.Between(1200, 3000),
                delay: Phaser.Math.Between(0, 2000),
                yoyo: true,
                repeat: -1,
                ease: 'Stepped',
                easeParams: [3]
            });
        }
    }

    startGame() {
        PixelUI.fadeTo(this, 'CharacterScene');
    }
}
