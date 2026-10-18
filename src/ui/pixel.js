// Shared pastel palette and pixel-art drawing helpers used by every scene.

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
    outline: 0x6b4a5e,
    button: 0xf7b2cc,
    buttonHover: 0xf59bbd,
    buttonLight: 0xfbd3e2,
    buttonBorder: 0x7a3f63,
    heart: 0xf59bbd,
    // Fade colour as RGB for camera effects.
    fade: [255, 244, 248]
};

const TEXT_COLORS = {
    title: '#8a5c9e',
    titleShadow: '#e3c2e6',
    subtitle: '#a07aa8',
    button: '#7a3f63',
    hint: '#5f8f7c'
};

const FONT = '"Pixelify Sans", monospace';

// Layout sizes are written in design units and scaled by S(). The game renders with
// fine pixels (see main.js), so UI_SCALE keeps text and shapes comfortably large while
// they still get more pixels of detail. Sprite scales stay whole numbers instead.
const UI_SCALE = 1.5;

function S(n) {
    return Math.round(n * UI_SCALE);
}

// Device pixels per game pixel, set by fitToWindow() in main.js. The canvas renders at
// the screen's native resolution and every scene camera zooms by this whole number, so
// pixel art stays blocky while text can be rasterised at full resolution.
let RENDER_SCALE = 1;

const PixelUI = {
    // Zooms the scene camera to game pixels and returns the size in game pixels.
    setupView(scene) {
        const camera = scene.cameras.main;
        camera.setSize(scene.scale.width, scene.scale.height);
        camera.setOrigin(0, 0);
        camera.setZoom(RENDER_SCALE);
        camera.setScroll(0, 0);

        return {
            width: Math.round(scene.scale.width / RENDER_SCALE),
            height: Math.round(scene.scale.height / RENDER_SCALE)
        };
    },

    // Text rasterised at device resolution so glyph edges stay sharp when zoomed.
    addText(scene, x, y, text, style) {
        return scene.add.text(x, y, text, { ...style, resolution: RENDER_SCALE });
    },
    // Filled circle made of 1px rows, so its edge stays on the pixel grid.
    fillCircle(g, cx, cy, r) {
        for (let dy = -r; dy <= r; dy++) {
            const dx = Math.round(Math.sqrt(r * r - dy * dy));
            g.fillRect(cx - dx, cy + dy, dx * 2 + 1, 1);
        }
    },

    // Rectangle with a 1px cut on each corner, the pixel-art "rounded" box.
    drawBox(g, x, y, w, h, fill, border, light) {
        g.fillStyle(border, 1);
        g.fillRect(x + 2, y, w - 4, h);
        g.fillRect(x, y + 2, w, h - 4);
        g.fillRect(x + 1, y + 1, w - 2, h - 2);

        g.fillStyle(fill, 1);
        g.fillRect(x + 2, y + 2, w - 4, h - 4);

        if (light !== undefined) {
            g.fillStyle(light, 1);
            g.fillRect(x + 3, y + 2, w - 6, 2);
        }
    },

    // Horizontal colour bands joined by a checkerboard dither row.
    drawSky(scene, width, height) {
        const sky = scene.add.graphics();
        const bands = PALETTE.sky;
        const bandHeight = Math.ceil(height / bands.length);

        bands.forEach((color, i) => {
            const y = i * bandHeight;
            sky.fillStyle(color, 1);
            sky.fillRect(0, y, width, bandHeight);

            if (i < bands.length - 1) {
                sky.fillStyle(bands[i + 1], 1);
                for (let x = 0; x < width; x += 2) {
                    sky.fillRect(x, y + bandHeight - 2, 1, 1);
                    sky.fillRect(x + 1, y + bandHeight - 1, 1, 1);
                }
            }
        });

        return sky;
    },

    addTitle(scene, x, y, text, fontSize = S(16)) {
        return PixelUI.addText(scene, x, y, text, {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: `${fontSize}px`,
            color: TEXT_COLORS.title,
            stroke: '#ffffff',
            strokeThickness: Math.max(2, Math.round(fontSize / 10)),
            shadow: { offsetX: 2, offsetY: 2, color: TEXT_COLORS.titleShadow, blur: 0, fill: true, stroke: true }
        }).setOrigin(0.5);
    },

    createButton(scene, x, y, label, onClick, { width = S(100), height = S(24), fontSize = S(12) } = {}) {
        const bg = scene.add.graphics();
        const draw = (fill) => {
            bg.clear();
            PixelUI.drawBox(bg, -width / 2, -height / 2, width, height, fill, PALETTE.buttonBorder, PALETTE.buttonLight);
        };
        draw(PALETTE.button);

        const text = PixelUI.addText(scene, 0, 1, label, {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: `${fontSize}px`,
            color: TEXT_COLORS.button
        }).setOrigin(0.5);

        const button = scene.add.container(x, y, [bg, text]);
        button.setSize(width, height);
        button.setInteractive({ useHandCursor: true });

        button.on('pointerover', () => draw(PALETTE.buttonHover));
        button.on('pointerout', () => draw(PALETTE.button));
        button.on('pointerup', onClick);

        return button;
    },

    // Fade out and start another scene; ignores repeated calls while leaving.
    fadeTo(scene, key, data = {}) {
        if (scene.leaving) {
            return;
        }
        scene.leaving = true;

        scene.cameras.main.fadeOut(400, ...PALETTE.fade);
        scene.cameras.main.once('camerafadeoutcomplete', () => scene.scene.start(key, data));
    },

    fadeIn(scene) {
        scene.cameras.main.fadeIn(400, ...PALETTE.fade);
    },

    // Layouts are computed from the game size, so rebuild the scene when it changes.
    restartOnResize(scene) {
        const onResize = () => {
            if (!scene.leaving) {
                scene.scene.restart({ resized: true });
            }
        };
        scene.scale.on(Phaser.Scale.Events.RESIZE, onResize);
        scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            scene.scale.off(Phaser.Scale.Events.RESIZE, onResize);
        });
    }
};
