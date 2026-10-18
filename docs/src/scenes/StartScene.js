import { FONT, PALETTE, PixelUI, S, TEXT_COLORS } from '../ui/pixel.js';

export class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    init(data) {
        this.leaving = false;
        this.skipIntro = Boolean(data.resized);
    }

    create() {
        const { width, height } = PixelUI.setupView(this);
        const cx = Math.round(width / 2);
        const cy = Math.round(height / 2);

        PixelUI.drawSky(this, width, height);
        this.drawSun(width - S(66), S(42));
        this.drawClouds(width, height);
        this.drawHills(width, height);
        this.drawSparkles(width, height);

        const title = PixelUI.addTitle(this, cx, cy - S(34), 'Świat Sióstr', S(40));
        title.setStroke('#ffffff', S(4));
        title.setShadow(S(2), S(2), TEXT_COLORS.titleShadow, 0, true, true);
        title.setAlpha(0);

        const subtitle = PixelUI.addText(this, cx, cy - S(6), 'opowieść o dwóch siostrach', {
            fontFamily: FONT,
            fontSize: `${S(12)}px`,
            color: TEXT_COLORS.subtitle
        }).setOrigin(0.5).setAlpha(0);

        const buttonY = cy + S(34);
        const button = PixelUI.createButton(this, cx, buttonY, 'Rozpocznij', () => this.startGame());
        button.setAlpha(0);
        this.tweens.add({
            targets: button,
            y: buttonY - S(2),
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [2]
        });

        const hint = PixelUI.addText(this, cx, height - S(10), 'Kliknij lub naciśnij Enter', {
            fontFamily: FONT,
            fontSize: `${S(8)}px`,
            color: TEXT_COLORS.hint
        }).setOrigin(0.5).setAlpha(0);

        if (this.skipIntro) {
            title.setAlpha(1).setY(title.y - S(4));
            subtitle.setAlpha(1);
            button.setAlpha(1);
            hint.setAlpha(1);
        } else {
            this.tweens.add({ targets: title, alpha: 1, y: title.y - S(4), duration: 1200, ease: 'Sine.easeOut' });
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
        PixelUI.fillCircle(glow, 0, 0, S(20));

        const sun = this.add.graphics({ x, y });
        sun.fillStyle(PALETTE.sun, 1);
        PixelUI.fillCircle(sun, 0, 0, S(14));

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
            g.fillRect(S(2), S(10), S(44), S(6));
            g.fillStyle(PALETTE.cloud, 1);
            g.fillRect(S(4), S(8), S(40), S(6));
            g.fillRect(S(8), S(4), S(14), S(6));
            g.fillRect(S(20), 0, S(16), S(10));
            g.fillRect(S(34), S(4), S(8), S(6));
            g.generateTexture('cloud', S(48), S(16));
            g.destroy();
        }

        const clouds = [
            { x: Math.round(width * 0.13), y: S(22) },
            { x: Math.round(width * 0.5), y: S(14) },
            { x: Math.round(width * 0.91), y: Math.round(height * 0.43) }
        ];

        clouds.forEach(({ x, y }, i) => {
            const cloud = this.add.image(x, y, 'cloud');

            this.tweens.add({
                targets: cloud,
                x: x + S(16),
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
            const backTop = Math.round(height - S(46) + Math.sin(x / S(38)) * S(8) + Math.sin(x / S(13)) * S(2));
            back.fillStyle(PALETTE.hillBack, 1);
            back.fillRect(x, backTop, 1, height - backTop);
            back.fillStyle(PALETTE.hillBackShade, 1);
            back.fillRect(x, backTop + S(3), 1, 1);

            const frontTop = Math.round(height - S(24) + Math.sin(x / S(55) + 1.5) * S(6));
            front.fillStyle(PALETTE.hillFront, 1);
            front.fillRect(x, frontTop, 1, height - frontTop);
            front.fillStyle(PALETTE.hillFrontLight, 1);
            front.fillRect(x, frontTop, 1, S(2));
        }
    }

    drawSparkles(width, height) {
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(4, width - 4);
            const y = Phaser.Math.Between(4, height - S(60));
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
