import { PALETTE, PixelUI, RENDER_SCALE, S, SAFE_AREA, TEXT_COLORS, textStyle } from '../ui/pixel.js';
import { ICON_COLORS, Icons } from '../gfx/icons.js';
import { Music } from '../audio/music.js';
import { MUSIC } from '../data/music.js';
import { PlayTime, Settings } from '../ui/settings.js';
import { floatZ } from '../ui/effects.js';
import { getCharacter } from '../data/characters.js';
import { CHARACTER_SCALE, createHamsterTextures } from '../gfx/hamster.js';
import { playLullaby } from '../audio/sfx.js';
import { BaseScene } from './BaseScene.js';

// Scenes that show the gear button; elsewhere the girls can't open Settings by accident.
const SETTINGS_SCENES = ['StartScene', 'CharacterScene'];

// Always-on-top scene with controls that stay visible on every screen.
// It is last in the scene list, so it renders above the others and gets input first.
export class OverlayScene extends BaseScene {
    constructor() {
        super({ key: 'OverlayScene', active: true });
        // Buttons sit in the corners of the window, also outside the stage.
        this.fillsWindow = true;
    }

    // Always visible: no fade when the game starts.
    intro() {}

    build({ width }) {
        this.menu = null;

        const size = S(22);
        const margin = S(6);
        // Below the iPad's status bar and clear of rounded corners (CSS px -> game px).
        const toGame = (css) => Math.ceil((css * (window.devicePixelRatio || 1)) / RENDER_SCALE);
        const top = margin + toGame(SAFE_AREA.top);
        const right = width - margin - toGame(SAFE_AREA.right);
        this.createReloadButton(right - size / 2, top + size / 2, size);
        // Settings sit left of the music button (which may be missing). They are for the
        // grown-ups, so the gear shows only on the start and character screens (update()).
        this.settingsButton = PixelUI.createIconButton(this, right - size * 2.5 - S(8), top + size / 2, size,
            (g) => Icons.gear(g, 0, 0, Math.round(size * 0.7)),
            () => (this.menu ? this.closeMenu() : this.openSettings()));
        // Above the game over screen (depth 90), below open panels (100).
        this.settingsButton.setDepth(95);
        this.settingsButton.setVisible(this.settingsAllowed());
        this.gameOver = false;

        // The note button appears only once some song file is known to exist.
        const thisRun = {};
        this.run = thisRun;
        Music.whenChecked(() => {
            if (this.run !== thisRun || Music.available.length === 0) {
                return;
            }
            this.loadThumbnails();
            this.createMusicButton(right - size * 1.5 - S(4), top + size / 2, size);
        });

        this.debugInfo = null;
        this.refreshDebugInfo();
    }

    // Scenes where the gear (Settings) button is shown.
    settingsAllowed() {
        return SETTINGS_SCENES.some((key) => this.scene.isActive(key));
    }

    update() {
        // Time limit (Settings): the "game over" screen comes and goes with PlayTime.
        const over = PlayTime.isOver();
        if (over && !this.gameOver) {
            this.showGameOver();
        } else if (!over && this.gameOver) {
            this.hideGameOver();
        }

        // On the game over screen the gear stays, for a grown-up to change the limit.
        const allowed = this.gameOver || this.settingsAllowed();
        if (this.settingsButton && this.settingsButton.visible !== allowed) {
            this.settingsButton.setVisible(allowed);
        }
    }

    // In debug mode (Settings): the window and screen size in the bottom-left corner, to
    // tune STAGE for a device.
    refreshDebugInfo() {
        if (this.debugInfo) {
            this.debugInfo.destroy();
            this.debugInfo = null;
        }
        if (!Settings.get('debug')) {
            return;
        }
        const dpr = window.devicePixelRatio || 1;
        const lines = [
            `okno ${window.innerWidth}x${window.innerHeight} CSS, dpr ${dpr}`,
            `gra ${Math.round(this.scale.width / dpr)}x${Math.round(this.scale.height / dpr)} CSS`,
            `ekran ${window.screen.width}x${window.screen.height}`,
            `piksel gry ${(RENDER_SCALE / dpr).toFixed(2)} CSS, safe top ${SAFE_AREA.top} right ${SAFE_AREA.right}`
        ];
        // A plain sans-serif font, large enough to read and copy off a photo.
        this.debugInfo = PixelUI.addText(this, S(6), this.view.height - S(6), lines.join('\n'), {
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: `${S(13)}px`,
            color: TEXT_COLORS.button,
            padding: { x: S(4), y: S(3) }
        })
            .setOrigin(0, 1)
            .setBackgroundColor('#ffffff')
            .setDepth(200);
    }

    // --- Pop-up panels (song chooser, settings) ------------------------------------

    // Opens a panel of panelW x panelH in the middle over a soft lavender veil; tapping
    // outside it closes it without reaching the game underneath. Returns the panel's
    // top-left corner; add its contents to this.menu.
    openPanel(panelW, panelH) {
        const { width, height } = this.view;
        const panelX = Math.round((width - panelW) / 2);
        const panelY = Math.max(S(36), Math.round((height - panelH) / 2));

        this.menu = this.add.container(0, 0).setDepth(100);

        const backdrop = this.add.rectangle(0, 0, width, height, ICON_COLORS.lavender, 0.55).setOrigin(0);
        backdrop.setInteractive();
        backdrop.on('pointerdown', (pointer, x, y, event) => event.stopPropagation());
        backdrop.on('pointerup', (pointer, x, y, event) => {
            event.stopPropagation();
            this.closeMenu();
        });
        this.menu.add(backdrop);

        const panel = this.add.graphics();
        PixelUI.drawBox(panel, panelX, panelY, panelW, panelH, ICON_COLORS.cream, PALETTE.buttonBorder, 0xffffff);
        this.menu.add(panel);
        return { panelX, panelY };
    }

    // A tappable row in a panel, w x h centred on (left + w/2, cy); onTap runs on release.
    addPanelRow(parts, left, cy, w, h, onTap) {
        const row = this.add.container(left + w / 2, cy, parts);
        row.setSize(w, h);
        row.setInteractive({ useHandCursor: true });
        row.on('pointerdown', (pointer, x, y, event) => event.stopPropagation());
        row.on('pointerup', (pointer, x, y, event) => {
            event.stopPropagation();
            onTap();
        });
        this.menu.add(row);
        return row;
    }

    closeMenu() {
        this.menuTimer?.remove();
        this.menuTimer = null;
        this.timeLeftText = null;
        if (this.menu) {
            this.menu.destroy();
            this.menu = null;
        }
    }

    // --- Settings -----------------------------------------------------------------

    // Settings for the grown-ups: checkbox rows, then the play time limit with a button per
    // choice and how much time is left (the only place that shows it).
    openSettings() {
        const rowH = S(34);
        const pad = S(10);
        const titleH = S(24);
        const labelH = S(20);
        const chipH = S(26);
        const panelW = Math.min(this.view.width - S(24), S(300));
        const settings = [{ key: 'debug', label: 'Tryb debug' }];
        const panelH = pad * 2 + titleH + settings.length * rowH + labelH + chipH + S(6) + labelH;
        const { panelX, panelY } = this.openPanel(panelW, panelH);
        const w = panelW - pad * 2;
        let y = panelY + pad;

        this.menu.add(PixelUI.addText(this, panelX + panelW / 2, y + titleH / 2, 'Ustawienia',
            textStyle(S(13), { bold: true })).setOrigin(0.5));
        y += titleH;

        settings.forEach(({ key, label }) => {
            const box = this.add.graphics();
            const drawBox = () => {
                box.clear();
                Icons.checkbox(box, -w / 2 + S(12), 0, S(18), Settings.get(key));
            };
            drawBox();
            const text = PixelUI.addText(this, -w / 2 + S(28), 0, label,
                textStyle(S(11), { bold: true, color: TEXT_COLORS.button })).setOrigin(0, 0.5);
            this.addPanelRow([box, text], panelX + pad, y + rowH / 2, w, rowH, () => {
                Settings.set(key, !Settings.get(key));
                drawBox();
                this.refreshDebugInfo();
            });
            y += rowH;
        });

        // Play time limit: off or one of PlayTime.OPTIONS minutes, counted from the tap.
        this.menu.add(PixelUI.addText(this, panelX + pad, y + labelH / 2, 'Czas gry',
            textStyle(S(11), { bold: true, color: TEXT_COLORS.button })).setOrigin(0, 0.5));
        y += labelH;

        const choices = [0, ...PlayTime.OPTIONS];
        const gap = S(4);
        const chipW = Math.floor((w - gap * (choices.length - 1)) / choices.length);
        const chips = choices.map((minutes, i) => {
            const g = this.add.graphics();
            const label = PixelUI.addText(this, 0, 1, minutes ? String(minutes) : 'Wył.',
                textStyle(S(10), { bold: true, color: TEXT_COLORS.button })).setOrigin(0.5);
            const left = panelX + pad + i * (chipW + gap);
            this.addPanelRow([g, label], left, y + chipH / 2, chipW, chipH, () => {
                PlayTime.start(minutes);
                drawChips();
                this.refreshTimeLeft();
            });
            return { g, minutes };
        });
        const drawChips = () => chips.forEach(({ g, minutes }) => {
            g.clear();
            const chosen = PlayTime.minutes === minutes;
            PixelUI.drawBox(g, -chipW / 2, -chipH / 2, chipW, chipH, chosen ? PALETTE.button : 0xffffff, PALETTE.buttonBorder,
                chosen ? PALETTE.buttonLight : undefined);
        });
        drawChips();
        y += chipH + S(6);

        this.timeLeftText = PixelUI.addText(this, panelX + panelW / 2, y + labelH / 2, '',
            textStyle(S(10), { color: TEXT_COLORS.subtitle })).setOrigin(0.5);
        this.menu.add(this.timeLeftText);
        this.refreshTimeLeft();
        this.menuTimer = this.time.addEvent({ delay: 1000, loop: true, callback: () => this.refreshTimeLeft() });
    }

    // "Zostało: 12 min" under the time limit buttons, while Settings are open.
    refreshTimeLeft() {
        if (!this.timeLeftText || !this.timeLeftText.active) {
            return;
        }
        const left = PlayTime.remainingMs();
        let text = 'Bez limitu czasu';
        if (left === 0) {
            text = 'Czas minął';
        } else if (left !== null) {
            const minutes = Math.ceil(left / 60000);
            text = minutes > 1 ? `Zostało: ${minutes} min` : 'Zostało: niecała minuta';
        }
        this.timeLeftText.setText(text);
    }

    // --- Time's up ---------------------------------------------------------------------

    // Covers everything with a calm "game over" message once PlayTime has run out: the
    // character asleep under the moon, a lullaby, music off, the game below paused and
    // unreachable. Only the gear stays, so a grown-up can change the limit in Settings.
    showGameOver() {
        this.gameOver = true;
        const { width, height } = this.view;
        this.closeMenu();

        // Running scenes, and ones already paused before a rebuild (e.g. after a resize).
        this.pausedScenes = this.scene.manager.scenes.filter((s) => s !== this && (s.sys.isActive() || s.sys.isPaused()));
        this.pausedScenes.forEach((s) => s.scene.pause());
        if (Music.enabled) {
            Music.select(-1);
            if (this.musicIcon) {
                this.refreshMusicIcon();
            }
        }
        playLullaby(this);

        const screen = this.add.container(0, 0).setDepth(90);
        const bg = this.add.rectangle(0, 0, width, height, 0xefe0f2, 1).setOrigin(0).setInteractive();
        // Swallows every tap, so nothing reaches the game underneath.
        bg.on('pointerdown', (pointer, x, y, event) => event.stopPropagation());
        screen.add(bg);

        const cx = Math.round(width / 2);
        const cy = Math.round(height / 2);
        const sky = this.add.graphics();
        Icons.moon(sky, cx, cy - S(70), S(48));
        [[-0.32, -0.3], [0.3, -0.22], [-0.22, 0.28], [0.36, 0.3], [-0.4, 0.05]].forEach(([fx, fy]) => {
            Icons.star(sky, Math.round(cx + fx * width), Math.round(cy + fy * height), S(5));
        });
        screen.add(sky);

        // The chosen character, eyes closed.
        const character = getCharacter(this.registry.get('selectedCharacter'));
        createHamsterTextures(this, character);
        screen.add(this.add.image(cx, cy - S(14), `${character.id}-blink`).setScale(CHARACTER_SCALE));

        const title = PixelUI.addTitle(this, cx, cy + S(30), 'KONIEC GRY.', S(22));
        const line = PixelUI.addText(this, cx, cy + S(56), 'Minął czas i musisz już wyłączyć ekran',
            textStyle(S(13), { bold: true, color: TEXT_COLORS.button })).setOrigin(0.5);
        [title, line].forEach((t) => {
            if (t.width > width - S(24)) {
                t.setFontSize(`${Math.floor((parseFloat(t.style.fontSize) * (width - S(24))) / t.width)}px`);
            }
        });
        screen.add([title, line]);
        this.gameOverScreen = screen;

        // Gentle "z"s rising from the sleeper.
        let count = 0;
        this.gameOverZ = this.time.addEvent({
            delay: 1200,
            loop: true,
            callback: () => floatZ(this, cx + S(30), cy - S(40), count++, { depth: 91 })
        });
    }

    hideGameOver() {
        this.gameOver = false;
        this.gameOverZ?.remove();
        this.gameOverScreen?.destroy();
        this.gameOverScreen = null;
        (this.pausedScenes || []).forEach((s) => s.scene.resume());
        this.pausedScenes = [];
    }

    // Song thumbnails for the chooser, only for songs that exist; a song without one shows
    // its number instead.
    loadThumbnails() {
        Music.available.forEach((i) => {
            const song = MUSIC[i];
            if (song.thumb && !this.textures.exists(`music-thumb-${i}`)) {
                this.load.image(`music-thumb-${i}`, song.thumb);
            }
        });
        this.load.start();
    }

    // Opens the song chooser; the note is crossed out while it's silent.
    createMusicButton(x, y, size) {
        const iconSize = Math.round(size * 0.7);
        const button = PixelUI.createIconButton(this, x, y, size,
            (g) => Icons.note(g, 0, 0, iconSize, Music.enabled),
            () => (this.menu ? this.closeMenu() : this.openMusicMenu()));
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
        const rowH = S(34);
        const gap = S(6);
        const pad = S(10);
        const panelW = Math.min(this.view.width - S(24), S(260));
        // Available songs, then silence (-1).
        const songs = [...Music.available, -1];
        const rows = songs.length;
        const panelH = pad * 2 + rows * rowH + (rows - 1) * gap;
        const { panelX, panelY } = this.openPanel(panelW, panelH);

        songs.forEach((index, i) => {
            const y = panelY + pad + i * (rowH + gap) + rowH / 2;
            this.createSongRow(index, panelX + pad, y, panelW - pad * 2, rowH);
        });
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
            parts.push(PixelUI.addText(this, badgeX, 1, String(index + 1), textStyle(S(16), { bold: true })).setOrigin(0.5));
        } else {
            Icons.note(bg, badgeX, 0, Math.round(badge * 0.7), false);
        }

        const textX = badgeX + badgeW / 2 + S(8);
        parts.push(PixelUI.addText(this, textX, song ? -S(6) : 0, song ? song.title : 'Cisza',
            textStyle(S(11), { bold: true, color: TEXT_COLORS.button })).setOrigin(0, 0.5));
        if (song) {
            parts.push(PixelUI.addText(this, textX, S(7), song.artist,
                textStyle(S(8), { color: TEXT_COLORS.subtitle })).setOrigin(0, 0.5));
        }

        // Heart marks what is on now.
        if (playing) {
            Icons.heart(bg, w / 2 - S(14), 0, S(14));
        }

        return this.addPanelRow(parts, left, cy, w, h, () => {
            Music.select(index);
            this.refreshMusicIcon();
            this.closeMenu();
        });
    }

    // Reloads the newest files and always starts again on the start screen: the address
    // after # (scenes/routes.js) is dropped first. Reloading in the browser keeps it.
    createReloadButton(x, y, size) {
        PixelUI.createIconButton(this, x, y, size, (g) => {
            g.fillStyle(PALETTE.buttonBorder, 1);
            this.drawReloadIcon(g, 0, 1, S(6));
        }, () => {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
            window.location.reload();
        });
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
