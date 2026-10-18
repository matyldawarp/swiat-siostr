// Minimum visible area in game pixels; the game grows beyond it to fill the window.
const BASE_WIDTH = 384;
const BASE_HEIGHT = 216;

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
        width: BASE_WIDTH,
        height: BASE_HEIGHT
    },
    scene: [StartScene]
};

function fitToWindow(game) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const zoom = Math.max(1, Math.floor(Math.min(w / BASE_WIDTH, h / BASE_HEIGHT)));

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
