// Always-on-top scene with controls that stay visible on every screen.
// It is last in the scene list, so it renders above the others and gets input first.
class OverlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OverlayScene', active: true });
    }

    init() {
        this.leaving = false;
    }

    // Song thumbnails for the chooser. A missing file just falls back to the song's number.
    preload() {
        MUSIC.forEach((song, i) => {
            if (song.thumb && !this.textures.exists(`music-thumb-${i}`)) {
                this.load.image(`music-thumb-${i}`, song.thumb);
            }
        });
    }

    create() {
        const { width, height } = PixelUI.setupView(this);
        this.view = { width, height };
        this.menu = null;

        const size = S(22);
        const margin = S(6);
        this.createReloadButton(width - margin - size / 2, margin + size / 2, size);
        if (MUSIC.length > 0) {
            this.createMusicButton(width - margin - size * 1.5 - S(4), margin + size / 2, size);
        }

        PixelUI.restartOnResize(this);
    }

    // Opens the song chooser; the note is crossed out while it's silent.
    createMusicButton(x, y, size) {
        const iconSize = Math.round(size * 0.7);
        const button = PixelUI.createIconButton(this, x, y, size,
            (g) => Icons.note(g, 0, 0, iconSize, Music.enabled),
            () => (this.menu ? this.closeMusicMenu() : this.openMusicMenu()));
        this.musicIcon = button.list[1];
        this.musicIconSize = iconSize;
    }

    refreshMusicIcon() {
        this.musicIcon.clear();
        Icons.note(this.musicIcon, 0, 0, this.musicIconSize, Music.enabled);
    }

    // One big coloured row per song, plus "Cisza" (silence). Colours and numbers tell
    // the songs apart for the youngest; titles and artists are for the older sister.
    openMusicMenu() {
        const { width, height } = this.view;
        const rowH = S(34);
        const gap = S(6);
        const pad = S(10);
        const panelW = Math.min(width - S(24), S(260));
        const rows = MUSIC.length + 1;
        const panelH = pad * 2 + rows * rowH + (rows - 1) * gap;
        const panelX = Math.round((width - panelW) / 2);
        const panelY = Math.max(S(36), Math.round((height - panelH) / 2));

        this.menu = this.add.container(0, 0).setDepth(100);

        // Tapping outside the panel closes it without reaching the game underneath.
        const backdrop = this.add.rectangle(0, 0, width, height, ICON_COLORS.lavender, 0.55).setOrigin(0);
        backdrop.setInteractive();
        backdrop.on('pointerdown', (pointer, x, y, event) => event.stopPropagation());
        backdrop.on('pointerup', (pointer, x, y, event) => {
            event.stopPropagation();
            this.closeMusicMenu();
        });
        this.menu.add(backdrop);

        const panel = this.add.graphics();
        PixelUI.drawBox(panel, panelX, panelY, panelW, panelH, ICON_COLORS.cream, PALETTE.buttonBorder, 0xffffff);
        this.menu.add(panel);

        for (let i = 0; i < rows; i++) {
            const index = i < MUSIC.length ? i : -1;
            const y = panelY + pad + i * (rowH + gap) + rowH / 2;
            this.menu.add(this.createSongRow(index, panelX + pad, y, panelW - pad * 2, rowH));
        }
    }

    createSongRow(index, left, cy, w, h) {
        const song = index >= 0 ? MUSIC[index] : null;
        const playing = Music.current === index;

        const bg = this.add.graphics();
        PixelUI.drawBox(bg, -w / 2, -h / 2, w, h, song ? song.color : 0xffffff, PALETTE.buttonBorder, playing ? 0xffffff : undefined);

        // Badge: the song's YouTube thumbnail (or number), or a crossed-out note for silence.
        const thumbKey = `music-thumb-${index}`;
        const hasThumb = song && this.textures.exists(thumbKey);
        const badge = S(26);
        const badgeW = hasThumb ? 48 + 4 : badge;
        const badgeH = hasThumb ? 27 + 4 : badge;
        const badgeX = -w / 2 + S(4) + badgeW / 2;
        PixelUI.drawBox(bg, badgeX - badgeW / 2, -badgeH / 2, badgeW, badgeH, 0xffffff, PALETTE.buttonBorder);
        const parts = [bg];
        if (hasThumb) {
            parts.push(this.add.image(badgeX, 0, thumbKey));
        } else if (song) {
            parts.push(PixelUI.addText(this, badgeX, 1, String(index + 1), {
                fontFamily: FONT,
                fontStyle: '700',
                fontSize: `${S(16)}px`,
                color: TEXT_COLORS.title
            }).setOrigin(0.5));
        } else {
            Icons.note(bg, badgeX, 0, Math.round(badge * 0.7), false);
        }

        const textX = badgeX + badgeW / 2 + S(8);
        parts.push(PixelUI.addText(this, textX, song ? -S(6) : 0, song ? song.title : 'Cisza', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: `${S(11)}px`,
            color: TEXT_COLORS.button
        }).setOrigin(0, 0.5));
        if (song) {
            parts.push(PixelUI.addText(this, textX, S(7), song.artist, {
                fontFamily: FONT,
                fontSize: `${S(8)}px`,
                color: TEXT_COLORS.subtitle
            }).setOrigin(0, 0.5));
        }

        // Heart marks what is on now.
        if (playing) {
            Icons.heart(bg, w / 2 - S(14), 0, S(14));
        }

        const row = this.add.container(left + w / 2, cy, parts);
        row.setSize(w, h);
        row.setInteractive({ useHandCursor: true });
        row.on('pointerdown', (pointer, x, y, event) => event.stopPropagation());
        row.on('pointerup', (pointer, x, y, event) => {
            event.stopPropagation();
            Music.select(index);
            this.refreshMusicIcon();
            this.closeMusicMenu();
        });
        return row;
    }

    closeMusicMenu() {
        if (this.menu) {
            this.menu.destroy();
            this.menu = null;
        }
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
