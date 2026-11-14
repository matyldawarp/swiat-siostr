import { SAFE_AREA, STAGE, fitScale, setRenderScale } from './ui/pixel.js';
import { Music } from './audio/music.js';
import { Settings } from './ui/settings.js';
import { watchWholePixels } from './ui/wholePixels.js';
import { StartScene } from './scenes/StartScene.js';
import { CharacterScene } from './scenes/CharacterScene.js';
import { TerrariumScene } from './scenes/TerrariumScene.js';
import { MapScene } from './scenes/MapScene.js';
import { HospitalScene } from './scenes/HospitalScene.js';
import { KitchenScene } from './scenes/KitchenScene.js';
import { BakeryScene } from './scenes/BakeryScene.js';
import { DentistScene } from './scenes/DentistScene.js';
import { ColoringScene } from './scenes/ColoringScene.js';
import { SchoolScene } from './scenes/SchoolScene.js';
import { GabiHouseScene } from './scenes/GabiHouseScene.js';
import { GabiKitchenScene } from './scenes/GabiKitchenScene.js';
import { GabiCraftScene } from './scenes/GabiCraftScene.js';
import { OverlayScene } from './scenes/OverlayScene.js';
import { routeFromAddress } from './scenes/routes.js';

const config = {
    type: Phaser.AUTO,
    title: 'Świat Sióstr',
    // Shows around the stage where the window has a different shape than the iPad.
    backgroundColor: '#fff4f8',
    pixelArt: true,
    scale: {
        // Sizing is handled by fitToWindow(): the canvas covers the window and each scene
        // centres its fixed-size stage in it (STAGE in ui/pixel.js).
        mode: Phaser.Scale.NONE,
        parent: 'game',
        width: STAGE.width,
        height: STAGE.height
    },
    // OverlayScene must stay last so it draws on top of every other scene. The first one
    // starts the game (StartScene, or the screen named after # in the address).
    scene: [StartScene, CharacterScene, TerrariumScene, MapScene, HospitalScene, KitchenScene, BakeryScene, DentistScene, ColoringScene, SchoolScene, GabiHouseScene, GabiKitchenScene, GabiCraftScene, OverlayScene]
};

// Started from the iPad's home screen (not in a Safari tab).
function isHomeScreenApp() {
    return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
}

function fitToWindow(game) {
    const dpr = window.devicePixelRatio || 1;

    // Status bar and rounded corners, measured by the hidden #safe-area element.
    const probe = document.getElementById('safe-area');
    if (probe) {
        const style = getComputedStyle(probe);
        SAFE_AREA.top = parseFloat(style.paddingTop) || 0;
        SAFE_AREA.right = parseFloat(style.paddingRight) || 0;
    }

    const w = window.innerWidth;
    let h = window.innerHeight;
    // As a home-screen app the page is drawn under the status bar (black-translucent), but
    // iOS still reports the height without it, which left an empty strip at the bottom.
    // Add the status bar back, up to the screen's own height.
    if (isHomeScreenApp() && SAFE_AREA.top > 0) {
        const screenH = w > h ? Math.min(window.screen.width, window.screen.height) : Math.max(window.screen.width, window.screen.height);
        h = Math.min(h + SAFE_AREA.top, screenH);
    }
    // The page must be as tall as the canvas, or the bottom is cut off.
    document.documentElement.style.height = `${h}px`;
    document.body.style.height = `${h}px`;

    // The canvas is never a fraction of a pixel in size (checkWholePixels): its CSS size is
    // the largest that is a whole number of device pixels too, which with Windows display
    // scaling (dpr 1.25, 1.5) can leave a strip of a few pixels at the right and bottom.
    const cssW = wholePixelSize(w, dpr);
    const cssH = wholePixelSize(h, dpr);

    // The stage scale slider in Settings shrinks the whole game below the largest fit.
    setRenderScale(fitScale(cssW, cssH, dpr) * (Settings.get('stageScale') / 100));

    // The canvas has one pixel per device pixel; CSS shrinks it back by the DPR. Phaser
    // would write that size as width times 1/dpr, which can come out a hair off a whole
    // number, so the CSS size is set exactly afterwards.
    game.scale.resize(Math.round(cssW * dpr), Math.round(cssH * dpr));
    game.scale.setZoom(1 / dpr);
    game.canvas.style.width = `${cssW}px`;
    game.canvas.style.height = `${cssH}px`;
}

// The largest size up to `css` CSS px that is also a whole number of device pixels.
function wholePixelSize(css, dpr) {
    for (let size = Math.floor(css); size > Math.floor(css) - 64 && size > 0; size--) {
        if (Math.abs(size * dpr - Math.round(size * dpr)) < 1e-4) {
            return size;
        }
    }
    return Math.floor(css);
}

// The game is played by touch only, so the iPad would auto-lock mid-game. NoSleep uses the
// Screen Wake Lock API where allowed (HTTPS, localhost) and otherwise a hidden looping video,
// which also works over plain http on the local network. It must start from a user gesture,
// and the wake lock is dropped when the tab is hidden, so re-enable it on every tap.
function keepScreenAwake() {
    if (typeof NoSleep === 'undefined') {
        return;
    }
    const noSleep = new NoSleep();
    const enable = () => {
        if (!noSleep.isEnabled) {
            const result = noSleep.enable();
            if (result && result.catch) {
                result.catch(() => {});
            }
        }
    };
    document.addEventListener('touchend', enable, { passive: true });
    document.addEventListener('click', enable);
}

// As a home-screen app the iPad still shows its status bar (clock, battery) over the top
// of the game, and iPadOS 27 blurs it. The Fullscreen API (iPad only, iPadOS 16.4+) hides
// it, but only from a tap, so the first tap goes full screen. Leaving full screen (the
// system's close button, or the share sheet when printing) comes back on the next tap.
function playFullscreen() {
    const root = document.documentElement;
    const request = root.requestFullscreen || root.webkitRequestFullscreen;
    if (!isHomeScreenApp() || !request) {
        return;
    }
    const enter = () => {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            return;
        }
        try {
            const result = request.call(root);
            if (result && result.catch) {
                result.catch(() => {});
            }
        } catch {
            // Not allowed here: the game stays as it is, under the status bar.
        }
    };
    document.addEventListener('touchend', enter, { passive: true });
    document.addEventListener('click', enter);
}

// Lets Chrome offer "Install app". Service workers only run on HTTPS or localhost.
function registerServiceWorker() {
    if ('serviceWorker' in navigator && window.isSecureContext) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }
}

function startGame() {
    // The reload button fetches again every file this page loaded (OverlayScene), read
    // from this list; the default keeps only 250, fewer than the game's files.
    if (performance.setResourceTimingBufferSize) {
        performance.setResourceTimingBufferSize(2000);
    }
    registerServiceWorker();
    keepScreenAwake();
    playFullscreen();
    Music.init();

    // Reloading on, say, #kuchnia or #kolorowanki/looney-tunes opens that screen again:
    // Phaser starts the first scene in the list, so that one goes first.
    const route = routeFromAddress();
    if (route) {
        const first = config.scene.find((scene) => scene.name === route.scene);
        config.scene = [first, ...config.scene.filter((scene) => scene !== first)];
    }
    const game = new Phaser.Game(config);

    // Set at once, before the first scene starts and reads them.
    // The character chosen last time on this device (CharacterScene remembers it).
    try {
        const saved = localStorage.getItem('swiat-siostr-character');
        if (saved) {
            game.registry.set('selectedCharacter', saved);
        }
    } catch {
        // Storage blocked: the first character, as on a first visit.
    }
    // The group and page in #kolorowanki/<group>/<page>.
    if (route && route.scene === 'ColoringScene') {
        game.registry.set('coloringGroup', route.details[0] || null);
        game.registry.set('coloringPage', route.details[1] || null);
    }
    // The lesson in #szkola/<lesson>.
    if (route && route.scene === 'SchoolScene') {
        game.registry.set('schoolLesson', route.details[0] || null);
    }

    game.events.once(Phaser.Core.Events.READY, () => {
        fitToWindow(game);
        watchWholePixels(game);
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => fitToWindow(game), 100);
    });

    // For debugging in the console, e.g. game.scene.start('KitchenScene').
    window.game = game;
}

// Text objects use canvas fillText, so web fonts must be ready before the game boots:
// both weights the game uses (FONT in ui/pixel.js), with Polish letters.
Promise.all(['400', '700'].map((weight) => document.fonts.load(`${weight} 16px "Handjet"`, 'Świat Sióstr ąęłńóśźż')))
    .catch(() => {})
    .finally(startGame);
