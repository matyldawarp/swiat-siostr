// 16x16 front-facing hamster. O outline, B body, L belly/muzzle, P pink,
// E eye, W eye shine, '.' transparent.
const HAMSTER_PIXELS = [
    '................',
    '..OO........OO..',
    '.OPBO......OBPO.',
    '.OPBBOOOOOOBBPO.',
    '.OBBBBBBBBBBBBO.',
    'OBBBBBBBBBBBBBBO',
    'OBBWEBBBBBBWEBBO',
    'OBBEEBBBBBBEEBBO',
    'OBPPLLLPPLLLPPBO',
    'OBBLLLLOOLLLLBBO',
    'OBLLLLLLLLLLLLBO',
    'OBLLLLLLLLLLLLBO',
    'OBBLLLLLLLLLLBBO',
    '.OBBPPLLLLPPBBO.',
    '..OOBBBBBBBBOO..',
    '....OOOOOOOO....'
];

// Closed eyes: the two eye rows become body colour with a line for the lid.
const HAMSTER_BLINK_ROWS = {
    6: 'OBBBBBBBBBBBBBBO',
    7: 'OBBOOBBBBBBOOBBO'
};

const HEART_PIXELS = [
    '.PP.PP.',
    'PPPPPPP',
    'PPPPPPP',
    '.PPPPP.',
    '..PPP..',
    '...P...'
];

function toCss(color) {
    return '#' + color.toString(16).padStart(6, '0');
}

function paintPixels(scene, key, rows, colors) {
    if (scene.textures.exists(key)) {
        return;
    }

    const texture = scene.textures.createCanvas(key, rows[0].length, rows.length);
    const ctx = texture.getContext();

    rows.forEach((row, y) => {
        [...row].forEach((ch, x) => {
            if (colors[ch] !== undefined) {
                ctx.fillStyle = toCss(colors[ch]);
                ctx.fillRect(x, y, 1, 1);
            }
        });
    });

    texture.refresh();
}

// Creates `<id>` and `<id>-blink` textures for a character.
function createHamsterTextures(scene, character) {
    const colors = {
        O: PALETTE.outline,
        B: character.colors.body,
        L: character.colors.light,
        P: character.colors.pink,
        E: 0x3d2b3d,
        W: 0xffffff
    };

    paintPixels(scene, character.id, HAMSTER_PIXELS, colors);

    const blinkRows = HAMSTER_PIXELS.map((row, y) => HAMSTER_BLINK_ROWS[y] || row);
    paintPixels(scene, `${character.id}-blink`, blinkRows, colors);
}

function createHeartTexture(scene) {
    paintPixels(scene, 'heart', HEART_PIXELS, { P: PALETTE.heart });
}

// Swaps to the blink texture for a moment at random intervals while the image lives.
function startBlinking(scene, image, character) {
    const blink = () => {
        if (!image.active) {
            return;
        }
        image.setTexture(`${character.id}-blink`);
        scene.time.delayedCall(140, () => {
            if (image.active) {
                image.setTexture(character.id);
            }
        });
        scene.time.delayedCall(Phaser.Math.Between(1800, 4200), blink);
    };

    scene.time.delayedCall(Phaser.Math.Between(800, 2000), blink);
}
