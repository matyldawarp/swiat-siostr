import { PALETTE, PixelUI, S, TEXT_COLORS, textStyle } from '../ui/pixel.js';
import { addImage, addPattern } from '../gfx/images.js';
import { BaseScene } from './BaseScene.js';

// Pictures of this scene: docs/assets/gfx/start/.
const P = 'start/';
const SPARKLES = [P + 'iskierka-biala', P + 'iskierka-rozowa', P + 'iskierka-zolta'];
// Height of the hills strip (start/wzgorza), a third of the stage so it lines up with its pattern.
const HILLS_H = 135;

export class StartScene extends BaseScene {
    constructor() {
        super('StartScene');
    }

    build({ width, height }) {
        const cx = Math.round(width / 2);
        const cy = Math.round(height / 2);

        PixelUI.drawSky(this, this.view.bleed);
        this.drawSun(width - S(66), S(42));
        this.drawClouds(width, height);
        this.drawHills(height, this.view.bleed);
        this.drawSparkles(width, height);

        const title = PixelUI.addTitle(this, cx, cy - S(34), 'Świat Sióstr', S(40), { strokeThickness: S(4), shadowOffset: S(2) });
        title.setAlpha(0);

        const subtitle = PixelUI.addText(this, cx, cy - S(6), 'opowieść o dwóch siostrach',
            textStyle(S(12), { color: TEXT_COLORS.subtitle })).setOrigin(0.5).setAlpha(0);

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

        const hint = PixelUI.addText(this, cx, height - S(10), 'Kliknij lub naciśnij Enter',
            textStyle(S(8), { color: TEXT_COLORS.hint })).setOrigin(0.5).setAlpha(0);

        if (this.skipIntro) {
            title.setAlpha(1).setY(title.y - S(4));
            subtitle.setAlpha(1);
            button.setAlpha(1);
            hint.setAlpha(1);
        } else {
            this.tweens.add({ targets: title, alpha: 1, y: title.y - S(4), duration: 1200, ease: 'Sine.easeOut' });
            this.tweens.add({ targets: subtitle, alpha: 1, duration: 1000, delay: 500 });
            this.tweens.add({ targets: [button, hint], alpha: 1, duration: 800, delay: 900 });
        }

        this.input.keyboard.once('keydown-ENTER', () => this.startGame());
        this.input.keyboard.once('keydown-SPACE', () => this.startGame());
    }

    // A slower fade than other scenes, while the title floats in.
    intro() {
        this.cameras.main.fadeIn(600, ...PALETTE.fade);
    }

    drawSun(x, y) {
        const glow = addImage(this, x, y, P + 'slonce-blask');
        addImage(this, x, y, P + 'slonce');

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
        const clouds = [
            { x: Math.round(width * 0.13), y: S(22) },
            { x: Math.round(width * 0.5), y: S(14) },
            { x: Math.round(width * 0.91), y: Math.round(height * 0.43) }
        ];

        clouds.forEach(({ x, y }, i) => {
            const cloud = addImage(this, x, y, P + 'chmurka');

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

    // Hills along the bottom of the stage, continued across the whole window (bleed): a
    // repeating strip over the stage's last HILLS_H rows, plain front-hill green below it.
    drawHills(height, bleed) {
        addPattern(this, bleed.x, height - HILLS_H, bleed.width, HILLS_H, P + 'wzgorza');
        const bottom = bleed.y + bleed.height;
        if (bottom > height) {
            this.add.rectangle(bleed.x, height, bleed.width, bottom - height, PALETTE.hillFront).setOrigin(0);
        }
    }

    drawSparkles(width, height) {
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(4, width - 4);
            const y = Phaser.Math.Between(4, height - S(60));

            // Small plus-shaped sparkle in a random colour.
            const sparkle = addImage(this, x, y, Phaser.Utils.Array.GetRandom(SPARKLES));

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
