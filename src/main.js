// Reference area in game pixels (long x short side, either orientation). The zoom is the
// largest integer that fits it, and the game area then grows to fill the window.
// Larger values mean smaller, finer pixels on screen.
const BASE_LONG = 576;
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
    scene: [StartScene, CharacterScene, TerrariumScene]
};

function fitToWindow(game) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const long = Math.max(w, h);
    const short = Math.min(w, h);
    const zoom = Math.max(1, Math.floor(Math.min(long / BASE_LONG, short / BASE_SHORT)));

    game.scale.resize(Math.ceil(w / zoom), Math.ceil(h / zoom));
    game.scale.setZoom(zoom);
}

function startGame() {
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
