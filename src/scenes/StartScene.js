const PALETTE = {
    sky: [0xcfe8ff, 0xd9e6fb, 0xe4e3f7, 0xefe0f2, 0xf8deee, 0xffe1ec],
    sun: 0xfff1c9,
    sunGlow: 0xfff7e0,
    cloud: 0xffffff,
    cloudShade: 0xe6eefc,
    hillBack: 0xd9ccf5,
    hillBackShade: 0xcbbcef,
    hillFront: 0xbfe8d6,
    hillFrontLight: 0xd4f2e4,
    sparkles: [0xffffff, 0xffd6e5, 0xfff1c9],
    button: 0xf7b2cc,
    buttonHover: 0xf59bbd,
    buttonLight: 0xfbd3e2,
    buttonBorder: 0x7a3f63,
    // Fade colour as RGB for camera effects.
    fade: [255, 244, 248]
};

const FONT = '"Pixelify Sans", monospace';

class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    init(data) {
        this.starting = false;
        this.skipIntro = Boolean(data.resized);
    }

    create() {
        const { width, height } = this.scale;
        const cx = Math.round(width / 2);
        const cy = Math.round(height / 2);

        this.cameras.main.setSize(width, height);

        this.drawSky(width, height);
        this.drawSun(width - 66, 42);
        this.drawClouds(width, height);
        this.drawHills(width, height);
        this.drawSparkles(width, height);

        const title = this.add.text(cx, cy - 34, 'Świat Sióstr', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '40px',
            color: '#8a5c9e',
            stroke: '#ffffff',
            strokeThickness: 4,
            shadow: { offsetX: 2, offsetY: 2, color: '#e3c2e6', blur: 0, fill: true, stroke: true }
        }).setOrigin(0.5).setAlpha(0);

        const subtitle = this.add.text(cx, cy - 6,'opowieść o dwóch siostrach', {
            fontFamily: FONT,
            fontSize: '12px',
            color: '#a07aa8'
        }).setOrigin(0.5).setAlpha(0);

        const button = this.createButton(cx, cy + 34, 'Rozpocznij');
        button.setAlpha(0);

        const hint = this.add.text(cx, height - 10, 'Kliknij lub naciśnij Enter', {
            fontFamily: FONT,
            fontSize: '8px',
            color: '#5f8f7c'
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

        // Rebuild the layout for the new game size whenever the window changes.
        const onResize = () => {
            if (!this.starting) {
                this.scene.restart({ resized: true });
            }
        };
        this.scale.on(Phaser.Scale.Events.RESIZE, onResize);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.scale.off(Phaser.Scale.Events.RESIZE, onResize);
        });
    }

    // Filled circle made of 1px rows, so its edge stays on the pixel grid.
    fillPixelCircle(g, cx, cy, r) {
        for (let dy = -r; dy <= r; dy++) {
            const dx = Math.round(Math.sqrt(r * r - dy * dy));
            g.fillRect(cx - dx, cy + dy, dx * 2 + 1, 1);
        }
    }

    drawSky(width, height) {
        const sky = this.add.graphics();
        const bands = PALETTE.sky;
        const bandHeight = Math.ceil(height / bands.length);

        bands.forEach((color, i) => {
            const y = i * bandHeight;
            sky.fillStyle(color, 1);
            sky.fillRect(0, y, width, bandHeight);

            // Checkerboard dither row blends each band into the next one.
            if (i < bands.length - 1) {
                sky.fillStyle(bands[i + 1], 1);
                for (let x = 0; x < width; x += 2) {
                    sky.fillRect(x, y + bandHeight - 2, 1, 1);
                    sky.fillRect(x + 1, y + bandHeight - 1, 1, 1);
                }
            }
        });
    }

    drawSun(x, y) {
        const glow = this.add.graphics({ x, y });
        glow.fillStyle(PALETTE.sunGlow, 1);
        this.fillPixelCircle(glow, 0, 0, 20);

        const sun = this.add.graphics({ x, y });
        sun.fillStyle(PALETTE.sun, 1);
        this.fillPixelCircle(sun, 0, 0, 14);

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

    createButton(x, y, label) {
        const w = 100;
        const h = 24;

        const bg = this.add.graphics();
        const draw = (fill) => {
            const left = -w / 2;
            const top = -h / 2;
            bg.clear();

            // Border with cut corners for a pixel "rounded" look.
            bg.fillStyle(PALETTE.buttonBorder, 1);
            bg.fillRect(left + 2, top, w - 4, h);
            bg.fillRect(left, top + 2, w, h - 4);
            bg.fillRect(left + 1, top + 1, w - 2, h - 2);

            bg.fillStyle(fill, 1);
            bg.fillRect(left + 2, top + 2, w - 4, h - 4);

            bg.fillStyle(PALETTE.buttonLight, 1);
            bg.fillRect(left + 3, top + 2, w - 6, 2);
        };
        draw(PALETTE.button);

        const text = this.add.text(0, 1, label, {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '12px',
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
            y: y - 2,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [2]
        });

        return button;
    }

    startGame() {
        if (this.starting) {
            return;
        }
        this.starting = true;

        // No gameplay scene yet: fade out and back in as a placeholder.
        this.cameras.main.fadeOut(500, ...PALETTE.fade);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.restart({}));
    }
}
