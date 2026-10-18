class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    create() {
        const { width, height } = this.scale;
        const cx = width / 2;

        this.drawSky(width, height);
        this.drawStars(width, height);
        this.drawMoon(width * 0.8, height * 0.22);
        this.drawHills(width, height);

        const title = this.add.text(cx, height * 0.36, 'Świat Sióstr', {
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: 'bold',
            fontSize: '110px',
            color: '#ffe9c7',
            stroke: '#3b1d5e',
            strokeThickness: 8,
            shadow: { offsetX: 0, offsetY: 6, color: '#000000', blur: 18, fill: true, stroke: true }
        }).setOrigin(0.5).setAlpha(0);

        const subtitle = this.add.text(cx, height * 0.36 + 90, 'opowieść o dwóch siostrach', {
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: 'italic',
            fontSize: '30px',
            color: '#d9c6f5'
        }).setOrigin(0.5).setAlpha(0);

        const button = this.createButton(cx, height * 0.68, 'Rozpocznij');
        button.setAlpha(0);

        const hint = this.add.text(cx, height - 40, 'Kliknij lub naciśnij Enter', {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '18px',
            color: '#9d8cc0'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({ targets: title, alpha: 1, y: title.y - 10, duration: 1400, ease: 'Sine.easeOut' });
        this.tweens.add({ targets: subtitle, alpha: 1, duration: 1200, delay: 600 });
        this.tweens.add({ targets: [button, hint], alpha: 1, duration: 900, delay: 1100 });

        this.input.keyboard.once('keydown-ENTER', () => this.startGame());
        this.input.keyboard.once('keydown-SPACE', () => this.startGame());

        this.cameras.main.fadeIn(800, 13, 10, 31);
    }

    drawSky(width, height) {
        const sky = this.add.graphics();
        sky.fillGradientStyle(0x0d0a1f, 0x0d0a1f, 0x4a2a6b, 0x4a2a6b, 1);
        sky.fillRect(0, 0, width, height);
    }

    drawStars(width, height) {
        for (let i = 0; i < 120; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height * 0.7);
            const r = Phaser.Math.FloatBetween(0.6, 2.2);
            const star = this.add.circle(x, y, r, 0xffffff, Phaser.Math.FloatBetween(0.3, 1));

            this.tweens.add({
                targets: star,
                alpha: 0.1,
                duration: Phaser.Math.Between(900, 2600),
                delay: Phaser.Math.Between(0, 2000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    drawMoon(x, y) {
        const glow = this.add.circle(x, y, 90, 0xfff3d6, 0.12);
        this.add.circle(x, y, 52, 0xfff3d6);
        // Cut-out disc matches the sky gradient at the moon's height to form a crescent.
        this.add.circle(x + 22, y - 12, 46, 0x1a1130);

        this.tweens.add({
            targets: glow,
            scale: 1.15,
            alpha: 0.05,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    drawHills(width, height) {
        const back = this.add.graphics();
        back.fillStyle(0x2a1a47, 1);
        back.fillEllipse(width * 0.25, height + 40, width * 0.9, 300);
        back.fillEllipse(width * 0.8, height + 60, width * 0.9, 320);

        const front = this.add.graphics();
        front.fillStyle(0x170f2e, 1);
        front.fillEllipse(width * 0.5, height + 90, width * 1.4, 260);
    }

    createButton(x, y, label) {
        const w = 300;
        const h = 72;

        const bg = this.add.graphics();
        const draw = (fill) => {
            bg.clear();
            bg.fillStyle(fill, 1);
            bg.fillRoundedRect(-w / 2, -h / 2, w, h, 36);
            bg.lineStyle(3, 0xffe9c7, 1);
            bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 36);
        };
        draw(0x7b3fa8);

        const text = this.add.text(0, 0, label, {
            fontFamily: 'Nunito, sans-serif',
            fontStyle: '800',
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const button = this.add.container(x, y, [bg, text]);
        button.setSize(w, h);
        button.setInteractive({ useHandCursor: true });

        button.on('pointerover', () => draw(0x9552c7));
        button.on('pointerout', () => draw(0x7b3fa8));
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
        this.cameras.main.fadeOut(600, 13, 10, 31);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.restart());
    }

    init() {
        this.starting = false;
    }
}
