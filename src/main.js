// Reference area in game pixels (long x short side, either orientation). The zoom is the
// largest integer that fits it, and the game area then grows to fill the window.
// Larger values mean smaller, finer pixels on screen. 512 keeps an iPad in portrait with
// Safari's toolbars (about 820x1060-1110) at zoom 2 rather than dropping to 1.
const BASE_LONG = 512;
const BASE_SHORT = 324;

const config = {
    type: Phaser.AUTO,
    title: 'Świat Sióstr',
    backgroundColor: '#fff4f8',
    pixelArt: true,
    scale: {
        // Sizing is handled by fitToWindow(): integer zoom keeps every game pixel
        // the same size, and the game area expands so the window has no empty bars.
        mode: Phaser.Scale.NONE,
        parent: 'game',
        width: BASE_LONG,
        height: BASE_SHORT
    },
    // OverlayScene must stay last so it draws on top of every other scene.
    scene: [StartScene, CharacterScene, TerrariumScene, MapScene, HospitalScene, OverlayScene]
};

function fitToWindow(game) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    const long = Math.max(w, h);
    const short = Math.min(w, h);

    // Game pixel size in CSS pixels, then in whole device pixels.
    const zoom = Math.max(1, Math.floor(Math.min(long / BASE_LONG, short / BASE_SHORT)));
    RENDER_SCALE = Math.max(1, Math.round(zoom * dpr));

    // The canvas has one pixel per device pixel; CSS shrinks it back by the DPR.
    const gameW = Math.ceil((w * dpr) / RENDER_SCALE);
    const gameH = Math.ceil((h * dpr) / RENDER_SCALE);
    game.scale.resize(gameW * RENDER_SCALE, gameH * RENDER_SCALE);
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

function startGame() {
    keepScreenAwake();

    const game = new Phaser.Game(config);

    game.events.once(Phaser.Core.Events.READY, () => fitToWindow(game));

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => fitToWindow(game), 100);
    });

    window.game = game;
}

// Text objects use canvas fillText, so web fonts must be ready before the game boots.
document.fonts.load('16px "Pixelify Sans"', 'Świat Sióstr')
    .catch(() => {})
    .finally(startGame);
