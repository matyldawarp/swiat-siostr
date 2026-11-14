// Shared pastel palette and pixel-art drawing helpers used by every scene.

import { addIcon64 } from './icons64.js';
import { checkChars, pixelFont } from './pixelFont.js';

export const PALETTE = {
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

export const TEXT_COLORS = {
    title: '#8a5c9e',
    titleShadow: '#e3c2e6',
    subtitle: '#a07aa8',
    button: '#7a3f63',
    hint: '#5f8f7c'
};

export const FONT = '"Handjet", monospace';
// Handjet is much narrower than most fonts at the same size, so every FONT text is drawn
// this much larger than its fontSize asks for (applied in PixelUI.addText).
export const FONT_SCALE = 1.25;

// Layout sizes are written in design units and scaled by S(). The game renders with
// fine pixels (see main.js), so UI_SCALE keeps text and shapes comfortably large while
// they still get more pixels of detail. Sprite scales stay whole numbers instead.
export const UI_SCALE = 1.5;

export function S(n) {
    return Math.round(n * UI_SCALE);
}

// Every scene is laid out on a stage of this fixed size in game pixels: the whole screen
// of the girls' iPad held on its side, 1080x810 CSS px (4:3, measured with debug mode in
// Settings), at 2 CSS px per game pixel. It fills that iPad when the game runs from the
// home screen; in Safari, whose toolbars take some height, it shrinks a little.
// The game is always this landscape shape and looks the same everywhere: on other screens
// (also a window held upright) the whole stage is scaled to fit and centred, and the space
// around it stays empty. Only OverlayScene (music and reload buttons) uses the whole
// window, so its buttons may sit outside the stage.
export const STAGE = { width: 540, height: 405 };

// Device pixels per game pixel of the game's scenes (the stage), set by fitToWindow() in
// main.js: always a whole number, the largest that fits (MAX_RENDER_SCALE) or smaller with
// the slider in Settings. The canvas renders at the screen's native resolution and every
// scene camera zooms by this, so pixel art stays blocky while text is rasterised at full
// resolution. Importers see the current values (ES module live bindings); only
// setRenderScale changes them.
export let RENDER_SCALE = 1;
export let MAX_RENDER_SCALE = 1;
// The same for OverlayScene (buttons in the corners, Settings), which covers the whole
// window: the fit before the slider, and not always a whole number (uiFitScale).
export let UI_RENDER_SCALE = 1;

export function setRenderScale(value, max, ui) {
    RENDER_SCALE = value;
    MAX_RENDER_SCALE = max;
    UI_RENDER_SCALE = ui;
}

// Parts of the window covered by the status bar or rounded corners (iPad started from the
// home screen), in CSS px; set by fitToWindow(). The stage still fills the whole screen,
// but OverlayScene keeps its buttons clear of these.
export const SAFE_AREA = { top: 0, right: 0 };

// The largest whole number of device pixels per game pixel at which the stage fits a
// window of w x h CSS px at this device pixel ratio. Game pixels are only ever multiplied
// by whole numbers, so every one is exactly the same size (the iPad at exactly 4, i.e.
// 2 CSS px); the rest of the window shows the backgrounds' bleed. At least 1, even when
// the window is too small for the stage.
export function fitScale(w, h, dpr) {
    const fit = Math.min((w * dpr) / STAGE.width, (h * dpr) / STAGE.height);
    return Math.max(1, Math.floor(fit + 1e-6));
}

// The scale for the buttons and Settings over the whole window (UI_RENDER_SCALE): a whole
// number as well, except on a sharp screen (dpr >= 2, phones, the iPad in Safari) where
// rounding down would shrink them by more than 15%; there the exact fit is used, as pixels
// then differ by one device pixel, which can't be seen at that density.
export function uiFitScale(w, h, dpr) {
    const fit = Math.min((w * dpr) / STAGE.width, (h * dpr) / STAGE.height);
    const whole = Math.floor(fit + 1e-6);
    if (whole >= 1 && (dpr < 2 || (fit - whole) / fit < 0.15)) {
        return whole;
    }
    return Math.max(fit, 0.25);
}

// Text styles used across scenes; pass the size through S().
export function textStyle(size, { bold = false, color = TEXT_COLORS.title } = {}) {
    return {
        fontFamily: FONT,
        fontStyle: bold ? '700' : '',
        fontSize: `${size}px`,
        color
    };
}

export const PixelUI = {
    // Zooms the scene camera to game pixels and centres the stage in the window; returns
    // the stage size, which the scene lays itself out in (0..width, 0..height), and
    // `bleed`: the whole window as { x, y, width, height } in the same coordinates (x and y
    // are 0 or below). Backgrounds are drawn over the bleed, so a window of another shape
    // shows more of them around the stage instead of empty strips.
    // With { stage: false } the view is the whole window instead (OverlayScene).
    setupView(scene, { stage = true } = {}) {
        const camera = scene.cameras.main;
        camera.setSize(scene.scale.width, scene.scale.height);
        camera.setOrigin(0, 0);
        // The stage's scenes use the game's whole-number scale, the window-wide overlay its own.
        const zoom = stage ? RENDER_SCALE : UI_RENDER_SCALE;
        camera.setZoom(zoom);

        const viewW = scene.scale.width / zoom;
        const viewH = scene.scale.height / zoom;
        const full = { x: 0, y: 0, width: Math.ceil(viewW), height: Math.ceil(viewH) };
        if (!stage) {
            camera.setScroll(0, 0);
            return { width: Math.floor(viewW), height: Math.floor(viewH), bleed: full };
        }
        const ox = Math.floor((viewW - STAGE.width) / 2);
        const oy = Math.floor((viewH - STAGE.height) / 2);
        camera.setScroll(-ox, -oy);
        return {
            width: STAGE.width,
            height: STAGE.height,
            bleed: { x: -ox - 1, y: -oy - 1, width: full.width + 2, height: full.height + 2 }
        };
    },

    // Text in the game's FONT is a BitmapText in a pixel font (ui/pixelFont.js): its glyphs
    // are pixel art in game pixels, never blurry. It gets FONT_SCALE times its fontSize, and
    // style.align 'center' centres its lines. Other fonts (the debug info) stay Phaser Text,
    // rasterised at the scene's zoom so one texture pixel is one device pixel.
    addText(scene, x, y, text, style) {
        if (style.fontFamily !== FONT) {
            return scene.add.text(x, y, text, { ...style, resolution: scene.cameras.main.zoom });
        }
        const sized = { ...style, fontSize: `${Math.round(parseFloat(style.fontSize) * FONT_SCALE)}px` };
        checkChars(text);
        const object = scene.add.bitmapText(x, y, pixelFont(scene, sized), text, parseFloat(sized.fontSize));
        if (style.align === 'center') {
            object.setCenterAlign();
        }
        object.pixelStyle = sized;
        return object;
    },

    // Shrinks a text from addText to a smaller font until it is at most maxWidth wide.
    fitTextWidth(object, maxWidth) {
        let size = parseFloat(object.pixelStyle.fontSize);
        while (object.width > maxWidth && size > 6) {
            size--;
            const sized = { ...object.pixelStyle, fontSize: `${size}px` };
            object.setFont(pixelFont(object.scene, sized), size);
            object.pixelStyle = sized;
        }
        return object;
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

    // Horizontal colour bands joined by a checkerboard dither row, over `area`
    // ({ x, y, width, height }, usually the scene's view.bleed: the whole window).
    drawSky(scene, area) {
        const sky = scene.add.graphics();
        const bands = PALETTE.sky;
        const bandHeight = Math.ceil(area.height / bands.length);
        const left = area.x - (Math.abs(area.x) % 2);
        const right = area.x + area.width;

        bands.forEach((color, i) => {
            const y = area.y + i * bandHeight;
            sky.fillStyle(color, 1);
            sky.fillRect(area.x, y, area.width, bandHeight);

            if (i < bands.length - 1) {
                sky.fillStyle(bands[i + 1], 1);
                for (let x = left; x < right; x += 2) {
                    sky.fillRect(x, y + bandHeight - 2, 1, 1);
                    sky.fillRect(x + 1, y + bandHeight - 1, 1, 1);
                }
            }
        });

        return sky;
    },

    // Bold title with a white outline and a soft shadow; both widths can be given.
    addTitle(scene, x, y, text, fontSize = S(16), { strokeThickness = Math.max(2, Math.round(fontSize / 10)), shadowOffset = 2 } = {}) {
        return PixelUI.addText(scene, x, y, text, {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: `${fontSize}px`,
            color: TEXT_COLORS.title,
            stroke: '#ffffff',
            strokeThickness,
            shadow: { offsetX: shadowOffset, offsetY: shadowOffset, color: TEXT_COLORS.titleShadow, blur: 0, fill: true, stroke: true }
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

    // Square button showing an ikona 64 (ui/icons64.js) instead of a word, for players who
    // can't read yet. button.setIcon(drawIcon) repaints the icon.
    createIconButton(scene, x, y, size, drawIcon, onClick) {
        const bg = scene.add.graphics();
        const draw = (fill) => {
            bg.clear();
            PixelUI.drawBox(bg, -size / 2, -size / 2, size, size, fill, PALETTE.buttonBorder, PALETTE.buttonLight);
        };
        draw(PALETTE.button);

        // The icon's drawing fills 70% of the button, as before the grid.
        const icon = addIcon64(scene, 0, 0, size * 0.7, drawIcon);

        const button = scene.add.container(x, y, [bg, icon]);
        button.setSize(size, size);
        button.setInteractive({ useHandCursor: true });
        button.on('pointerover', () => draw(PALETTE.buttonHover));
        button.on('pointerout', () => draw(PALETTE.button));
        button.on('pointerup', onClick);
        button.setIcon = icon.setIcon;
        return button;
    },

    // Single hop of `target` from `groundY`. Always starts from the ground, and a new hop
    // replaces one still in the air (finishing its onComplete), so quick repeated taps
    // can't make the target creep upwards.
    hop(scene, target, groundY, height, { duration = 120, repeat = 0, onComplete } = {}) {
        if (target.hopTween) {
            target.hopTween.stop();
            const pending = target.hopDone;
            target.hopTween = null;
            target.hopDone = null;
            if (pending) {
                pending();
            }
        }

        target.y = groundY;
        target.hopDone = onComplete || null;
        target.hopTween = scene.tweens.add({
            targets: target,
            y: groundY - height,
            duration,
            yoyo: true,
            repeat,
            ease: 'Sine.easeOut',
            onComplete: () => {
                target.y = groundY;
                target.hopTween = null;
                const done = target.hopDone;
                target.hopDone = null;
                if (done) {
                    done();
                }
            }
        });
    },

    // Gentle "tap me" pulse; returns the tween so it can be stopped.
    pulse(scene, target, amount = 0.12) {
        return scene.tweens.add({
            targets: target,
            scale: 1 + amount,
            duration: 450,
            yoyo: true,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [2]
        });
    },

    // Fade out and start another scene; ignores repeated calls while leaving.
    fadeTo(scene, key, data = {}) {
        if (scene.leaving) {
            return;
        }
        scene.leaving = true;

        // Shorter when the back button has sped the scene up (BaseScene.backPressed).
        scene.cameras.main.fadeOut(Math.round(400 / scene.tweens.timeScale), ...PALETTE.fade);
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
