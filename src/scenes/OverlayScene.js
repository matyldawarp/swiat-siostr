// Always-on-top scene with controls that stay visible on every screen.
// It is last in the scene list, so it renders above the others and gets input first.
class OverlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OverlayScene', active: true });
    }

    init() {
        this.leaving = false;
    }

    create() {
        const { width, height } = PixelUI.setupView(this);

        const size = S(22);
        const margin = S(6);
        this.createReloadButton(width - margin - size / 2, margin + size / 2, size);
        if (MUSIC.length > 0) {
            this.createMusicButton(width - margin - size * 1.5 - S(4), margin + size / 2, size);
        }

        PixelUI.restartOnResize(this);
    }

    // Music on/off; the note is crossed out while the music is off.
    createMusicButton(x, y, size) {
        const iconSize = Math.round(size * 0.7);
        const button = PixelUI.createIconButton(this, x, y, size,
            (g) => Icons.note(g, 0, 0, iconSize, Music.enabled),
            () => {
                const on = Music.toggle();
                icon.clear();
                Icons.note(icon, 0, 0, iconSize, on);
            });
        const icon = button.list[1];
    }

    createReloadButton(x, y, size) {
        const bg = this.add.graphics();
        const draw = (fill) => {
            bg.clear();
            PixelUI.drawBox(bg, -size / 2, -size / 2, size, size, fill, PALETTE.buttonBorder, PALETTE.buttonLight);
        };
        draw(PALETTE.button);

        const icon = this.add.graphics();
        icon.fillStyle(PALETTE.buttonBorder, 1);
        this.drawReloadIcon(icon, 0, 1, S(6));

        const button = this.add.container(x, y, [bg, icon]);
        button.setSize(size, size);
        button.setInteractive({ useHandCursor: true });

        button.on('pointerover', () => draw(PALETTE.buttonHover));
        button.on('pointerout', () => draw(PALETTE.button));
        button.on('pointerup', () => window.location.reload());
    }

    // Clockwise circular arrow on the pixel grid: a ring with a gap at the top right
    // and an arrowhead pointing into the gap.
    drawReloadIcon(g, cx, cy, r) {
        const thickness = Math.max(2, Math.round(r / 3));
        const gapStart = -80;
        const gapEnd = -20;

        for (let dy = -r - 1; dy <= r + 1; dy++) {
            for (let dx = -r - 1; dx <= r + 1; dx++) {
                const d = Math.sqrt(dx * dx + dy * dy);
                const angle = Phaser.Math.RadToDeg(Math.atan2(dy, dx));
                if (d <= r + 0.5 && d >= r + 0.5 - thickness && (angle < gapStart || angle > gapEnd)) {
                    g.fillRect(cx + dx, cy + dy, 1, 1);
                }
            }
        }

        // Arrowhead at the end of the ring near the top, pointing right.
        const mid = r + 0.5 - thickness / 2;
        const ax = cx + Math.round(Math.cos(Phaser.Math.DegToRad(gapStart)) * mid);
        const ay = cy + Math.round(Math.sin(Phaser.Math.DegToRad(gapStart)) * mid);
        const half = thickness + 1;
        for (let k = 0; k <= half; k++) {
            g.fillRect(ax + k, ay - (half - k), 1, (half - k) * 2 + 1);
        }
    }
}
