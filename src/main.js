const config = {
    type: Phaser.AUTO,
    title: 'Świat Sióstr',
    backgroundColor: '#fff4f8',
    pixelArt: true,
    scale: {
        // NONE + integer zoom keeps every game pixel the same size on screen.
        mode: Phaser.Scale.NONE,
        parent: 'game',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 384,
        height: 216,
        zoom: Phaser.Scale.MAX_ZOOM
    },
    scene: [StartScene]
};

function startGame() {
    const game = new Phaser.Game(config);

    window.addEventListener('resize', () => {
        game.scale.getParentBounds();
        game.scale.setMaxZoom();
    });

    window.game = game;
}

// Text objects use canvas fillText, so web fonts must be ready before the game boots.
document.fonts.load('16px "Pixelify Sans"', 'Świat Sióstr')
    .catch(() => {})
    .finally(startGame);
