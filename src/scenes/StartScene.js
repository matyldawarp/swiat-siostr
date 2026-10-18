const PALETTE = {
    skyTop: 0xcfe8ff,
    skyBottom: 0xffe1ec,
    sun: 0xfff1c9,
    cloud: 0xffffff,
    hillBack: 0xd9ccf5,
    hillFront: 0xbfe8d6,
    button: 0xf7b2cc,
    buttonHover: 0xf59bbd,
    buttonBorder: 0xffffff,
    // Fade colour as RGB for camera effects.
    fade: [255, 244, 248]
};

class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    init() {
        this.starting = false;
    }

    create() {
        const { width, height } = this.scale;
        const cx = width / 2;

        this.drawSky(width, height);
        this.drawSun(width * 0.8, height * 0.22);
        this.drawClouds(width, height);
        this.drawHills(width, height);
        this.drawSparkles(width, height);

        const title = this.add.text(cx, height * 0.36, 'Świat Sióstr', {
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: 'bold',
            fontSize: '110px',
            color: '#8a5c9e',
            stroke: '#ffffff',
            strokeThickness: 10,
            shadow: { offsetX: 0, offsetY: 6, color: '#e7c8e8', blur: 16, fill: true, stroke: true }
        }).setOrigin(0.5).setAlpha(0);

        const subtitle = this.add.text(cx, height * 0.36 + 90, 'opowieść o dwóch siostrach', {
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: 'italic',
            fontSize: '30px',
            color: '#a07aa8'
        }).setOrigin(0.5).setAlpha(0);

        const button = this.createButton(cx, height * 0.68, 'Rozpocznij');
        button.setAlpha(0);

        const hint = this.add.text(cx, height - 40, 'Kliknij lub naciśnij Enter', {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '18px',
            color: '#6f9c8a'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({ targets: title, alpha: 1, y: title.y - 10, duration: 1400, ease: 'Sine.easeOut' });
        this.tweens.add({ targets: subtitle, alpha: 1, duration: 1200, delay: 600 });
        this.tweens.add({ targets: [button, hint], alpha: 1, duration: 900, delay: 1100 });

        this.input.keyboard.once('keydown-ENTER', () => this.startGame());
        this.input.keyboard.once('keydown-SPACE', () => this.startGame());

        this.cameras.main.fadeIn(800, ...PALETTE.fade);
    }

    drawSky(width, height) {
        const sky = this.add.graphics();
        sky.fillGradientStyle(PALETTE.skyTop, PALETTE.skyTop, PALETTE.skyBottom, PALETTE.skyBottom, 1);
        sky.fillRect(0, 0, width, height);
    }

    drawSun(x, y) {
        const glow = this.add.circle(x, y, 110, PALETTE.sun, 0.45);
        this.add.circle(x, y, 60, PALETTE.sun);

        this.tweens.add({
            targets: glow,
            scale: 1.12,
            alpha: 0.25,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    drawClouds(width, height) {
        const clouds = [
            { x: width * 0.15, y: height * 0.14, scale: 1 },
            { x: width * 0.55, y: height * 0.09, scale: 0.7 },
            { x: width * 0.9, y: height * 0.42, scale: 0.85 }
        ];

        clouds.forEach(({ x, y, scale }, i) => {
            const cloud = this.add.graphics({ x, y });
            cloud.fillStyle(PALETTE.cloud, 0.9);
            cloud.fillEllipse(0, 0, 160, 60);
            cloud.fillEllipse(-45, -18, 90, 70);
            cloud.fillEllipse(35, -25, 100, 80);
            cloud.setScale(scale);

            this.tweens.add({
                targets: cloud,
                x: x + 40,
                duration: 7000 + i * 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    drawHills(width, height) {
        const back = this.add.graphics();
        back.fillStyle(PALETTE.hillBack, 1);
        back.fillEllipse(width * 0.25, height + 40, width * 0.9, 300);
        back.fillEllipse(width * 0.8, height + 60, width * 0.9, 320);

        const front = this.add.graphics();
        front.fillStyle(PALETTE.hillFront, 1);
        front.fillEllipse(width * 0.5, height + 90, width * 1.4, 260);
    }

    drawSparkles(width, height) {
        const colors = [0xffffff, 0xffd6e5, 0xfff1c9, 0xd9ccf5];

        for (let i = 0; i < 40; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height * 0.75);
            const r = Phaser.Math.FloatBetween(1.5, 3.5);
            const sparkle = this.add.circle(x, y, r, Phaser.Utils.Array.GetRandom(colors), 0.9);

            this.tweens.add({
                targets: sparkle,
                alpha: 0.15,
                y: y - 12,
                duration: Phaser.Math.Between(1500, 3500),
                delay: Phaser.Math.Between(0, 2000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createButton(x, y, label) {
        const w = 300;
        const h = 72;

        const bg = this.add.graphics();
        const draw = (fill) => {
            bg.clear();
            bg.fillStyle(fill, 1);
            bg.fillRoundedRect(-w / 2, -h / 2, w, h, 36);
            bg.lineStyle(4, PALETTE.buttonBorder, 1);
            bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 36);
        };
        draw(PALETTE.button);

        const text = this.add.text(0, 0, label, {
            fontFamily: 'Nunito, sans-serif',
            fontStyle: '800',
            fontSize: '32px',
            color: '#7a3f63'
        }).setOrigin(0.5);

        const button = this.add.container(x, y, [bg, text]);
        button.setSize(w, h);
        button.setInteractive({ useHandCursor: true });

        button.on('pointerover', () => draw(PALETTE.buttonHover));
        button.on('pointerout', () => draw(PALETTE.button));
        button.on('pointerup', () => this.startGame());

        this.tweens.add({
            targets: button,
            scale: 1.05,
            duration: 900,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        return button;
    }

    startGame() {
        if (this.starting) {
            return;
        }
        this.starting = true;

        // No gameplay scene yet: fade out and back in as a placeholder.
        this.cameras.main.fadeOut(600, ...PALETTE.fade);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.restart());
    }
}
