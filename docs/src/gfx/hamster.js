import { PALETTE } from '../ui/pixel.js';

// Every character sprite is 16x16 pixels, drawn around its centre.
export const SPRITE_SIZE = 16;

// Distance from a character's centre to its top or bottom edge at the given sprite scale.
export function spriteHalf(scale) {
    return (SPRITE_SIZE / 2) * scale;
}

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

// Chewing: open mouth and puffed-out cheeks.
const HAMSTER_CHEW_ROWS = {
    8: 'OPPPLLLPPLLLPPPO',
    9: 'OBBLLLOPPOLLLBBO'
};

// Sunflower seed: grey shell with a pale stripe. O outline, G shell, W stripe.
export const SEED_PIXELS = [
    '..O..',
    '.OGO.',
    '.GWG.',
    'OGWGO',
    'OGWGO',
    '.OGO.',
    '..O..'
];

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

// Characters drawn by the girls come as a fill mask: '#' body, 'E' pen detail, 'W' white,
// 'O' a loose pen line, '.' empty. Body pixels touching empty space become the outline.
function outlineMask(rows) {
    const at = (x, y) => (rows[y] && rows[y][x]) || '.';
    return rows.map((row, y) => [...row].map((ch, x) => {
        if (ch !== '#') {
            return ch;
        }
        const edge = [at(x - 1, y), at(x + 1, y), at(x, y - 1), at(x, y + 1)].includes('.');
        return edge ? 'O' : 'B';
    }).join(''));
}

// Creates `<id>`, `<id>-blink` and `<id>-chew` textures for a character.
export function createHamsterTextures(scene, character) {
    const colors = {
        O: PALETTE.outline,
        B: character.colors.body,
        L: character.colors.light,
        P: character.colors.pink,
        E: 0x3d2b3d,
        W: 0xffffff,
        // Extra letters a drawn character may use for its own colours.
        ...(character.palette || {})
    };

    // Drawn characters have no separate blink or chew frames.
    if (character.pixels) {
        const rows = outlineMask(character.pixels);
        ['', '-blink', '-chew'].forEach((suffix) => paintPixels(scene, character.id + suffix, rows, colors));
        return;
    }

    paintPixels(scene, character.id, HAMSTER_PIXELS, colors);

    const blinkRows = HAMSTER_PIXELS.map((row, y) => HAMSTER_BLINK_ROWS[y] || row);
    paintPixels(scene, `${character.id}-blink`, blinkRows, colors);

    const chewRows = HAMSTER_PIXELS.map((row, y) => HAMSTER_CHEW_ROWS[y] || row);
    paintPixels(scene, `${character.id}-chew`, chewRows, colors);
}

export function createHeartTexture(scene) {
    paintPixels(scene, 'heart', HEART_PIXELS, { P: PALETTE.heart });
}

export const SEED_COLORS = { O: PALETTE.outline, G: 0x8d7f99, W: 0xf3eef8 };

export function createSeedTexture(scene) {
    paintPixels(scene, 'seed', SEED_PIXELS, SEED_COLORS);
}

// A little heap of three droppings in soft caramel: O outline, B body, L shine.
const POOP_PIXELS = [
    '...OOO...',
    '..OBBLO..',
    '..OBBBO..',
    '.OOOOOOO.',
    'OBBLOBBLO',
    'OBBBOBBBO',
    '.OOO.OOO.'
];

export function createPoopTexture(scene) {
    paintPixels(scene, 'poop', POOP_PIXELS, { O: PALETTE.outline, B: 0xd8b08c, L: 0xf3dcc4 });
}

// Sprite scale for characters standing in a room (terrarium, kitchen, hospital).
export const CHARACTER_SCALE = 4;

// A character at (x, groundY): a container to move and hop (PixelUI.hop with groundY)
// holding the blinking sprite, which calls onTap when tapped. Textures are made on demand.
export function addCharacter(scene, character, x, groundY, { scale = CHARACTER_SCALE, depth, onTap } = {}) {
    createHamsterTextures(scene, character);
    const container = scene.add.container(x, groundY);
    if (depth !== undefined) {
        container.setDepth(depth);
    }
    const image = scene.add.image(0, 0, character.id).setScale(scale);
    container.add(image);
    if (onTap) {
        image.setInteractive({ useHandCursor: true });
        image.on('pointerdown', onTap);
    }
    startBlinking(scene, image, character);
    return { container, image, groundY };
}

// Swaps to the blink texture for a moment at random intervals while the image lives.
export function startBlinking(scene, image, character) {
    const blink = () => {
        if (!image.active) {
            return;
        }
        // Only blink from the neutral face, so chewing frames aren't interrupted.
        if (image.texture.key !== character.id) {
            scene.time.delayedCall(Phaser.Math.Between(1800, 4200), blink);
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
