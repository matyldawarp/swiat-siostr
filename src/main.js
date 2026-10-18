const config = {
    type: Phaser.AUTO,
    title: 'Świat Sióstr',
    backgroundColor: '#fff4f8',
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720
    },
    scene: [StartScene]
};

// Text objects use canvas fillText, so web fonts must be ready before the game boots.
Promise.all([
    document.fonts.load('700 96px "Playfair Display"', 'Świat Sióstr'),
    document.fonts.load('italic 400 28px "Playfair Display"'),
    document.fonts.load('800 32px "Nunito"')
]).catch(() => {}).finally(() => {
    window.game = new Phaser.Game(config);
});
