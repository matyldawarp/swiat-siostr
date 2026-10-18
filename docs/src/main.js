import { SAFE_AREA, STAGE, fitScale, setRenderScale } from './ui/pixel.js';
import { Music } from './audio/music.js';
import { StartScene } from './scenes/StartScene.js';
import { CharacterScene } from './scenes/CharacterScene.js';
import { TerrariumScene } from './scenes/TerrariumScene.js';
import { MapScene } from './scenes/MapScene.js';
import { HospitalScene } from './scenes/HospitalScene.js';
import { KitchenScene } from './scenes/KitchenScene.js';
import { BakeryScene } from './scenes/BakeryScene.js';
import { OverlayScene } from './scenes/OverlayScene.js';

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
    // OverlayScene must stay last so it draws on top of every other scene.
    scene: [StartScene, CharacterScene, TerrariumScene, MapScene, HospitalScene, KitchenScene, BakeryScene, OverlayScene]
};

function fitToWindow(game) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    setRenderScale(fitScale(w, h, dpr));

    // Status bar and rounded corners, measured by the hidden #safe-area element.
    const probe = document.getElementById('safe-area');
    if (probe) {
        const style = getComputedStyle(probe);
        SAFE_AREA.top = parseFloat(style.paddingTop) || 0;
        SAFE_AREA.right = parseFloat(style.paddingRight) || 0;
    }

    // The canvas has one pixel per device pixel; CSS shrinks it back by the DPR.
    game.scale.resize(Math.round(w * dpr), Math.round(h * dpr));
    game.scale.setZoom(1 / dpr);
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

// Lets Chrome offer "Install app". Service workers only run on HTTPS or localhost.
function registerServiceWorker() {
    if ('serviceWorker' in navigator && window.isSecureContext) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }
}

function startGame() {
    registerServiceWorker();
    keepScreenAwake();
    Music.init();

    const game = new Phaser.Game(config);

    game.events.once(Phaser.Core.Events.READY, () => fitToWindow(game));

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => fitToWindow(game), 100);
    });

    // For debugging in the console, e.g. game.scene.start('KitchenScene').
    window.game = game;
}

// Text objects use canvas fillText, so web fonts must be ready before the game boots.
document.fonts.load('16px "Pixelify Sans"', 'Świat Sióstr')
    .catch(() => {})
    .finally(startGame);
