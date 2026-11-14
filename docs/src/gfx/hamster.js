import { hasImage, imageTexture } from './images.js';

// Every character is drawn on 16x16 pixels, around its centre.
export const SPRITE_SIZE = 16;

// Distance from a character's centre to its top or bottom edge at the given sprite scale.
export function spriteHalf(scale) {
    return (SPRITE_SIZE / 2) * scale;
}

// Sprite scale for characters standing in a room (terrarium, kitchen, hospital): the
// character is SPRITE_SIZE times this many game pixels across (64).
export const CHARACTER_SCALE = 4;

// Scene pictures are never scaled (the scene's pixel grid, notes/wyglad.md), so every size a
// character is shown in has its own pictures, drawn at that size in full detail.
const CHARACTER_FOLDERS = { 1: 'postacie-mini', 2: 'postacie-male', 4: 'postacie', 6: 'postacie-duze' };

// The textures `<key>`, `<key>-blink` and `<key>-chew` of a character at a sprite scale of
// 1, 2, 4 or 6, from its pictures in docs/assets/gfx/ (gfx/images.js); returns `<key>`: the
// character's id at the room scale, `<id>-x<scale>` otherwise. Characters drawn by the
// girls have only one picture, used for all three.
export function createHamsterTextures(scene, character, scale = CHARACTER_SCALE) {
    const folder = CHARACTER_FOLDERS[scale];
    const key = scale === CHARACTER_SCALE ? character.id : `${character.id}-x${scale}`;
    const own = (suffix) => (hasImage(`${folder}/${character.id}${suffix}`) ? suffix : '');
    ['', '-blink', '-chew'].forEach((suffix) => {
        imageTexture(scene, `${folder}/${character.id}${own(suffix)}`, key + suffix);
    });
    return key;
}

export function createHeartTexture(scene) {
    imageTexture(scene, 'drobne/serce', 'heart');
}

export function createSeedTexture(scene) {
    imageTexture(scene, 'drobne/ziarenko', 'seed');
}

export function createPoopTexture(scene) {
    imageTexture(scene, 'drobne/kupka', 'poop');
}

// A character at (x, groundY): a container to move and hop (PixelUI.hop with groundY)
// holding the blinking sprite, which calls onTap when tapped. Textures are made on demand.
export function addCharacter(scene, character, x, groundY, { scale = CHARACTER_SCALE, depth, onTap } = {}) {
    const key = createHamsterTextures(scene, character, scale);
    const container = scene.add.container(x, groundY);
    if (depth !== undefined) {
        container.setDepth(depth);
    }
    const image = scene.add.image(0, 0, key);
    container.add(image);
    if (onTap) {
        image.setInteractive({ useHandCursor: true });
        image.on('pointerdown', onTap);
    }
    startBlinking(scene, image, key);
    return { container, image, groundY };
}

// A character's image at a sprite scale of 2, 4 or 6, blinking.
export function addCharacterImage(scene, x, y, character, scale) {
    const key = createHamsterTextures(scene, character, scale);
    const image = scene.add.image(x, y, key);
    startBlinking(scene, image, key);
    return image;
}

// Swaps to the blink texture `<key>-blink` for a moment at random intervals while the
// image lives.
export function startBlinking(scene, image, key) {
    const blink = () => {
        if (!image.active) {
            return;
        }
        // Only blink from the neutral face, so chewing frames aren't interrupted.
        if (image.texture.key !== key) {
            scene.time.delayedCall(Phaser.Math.Between(1800, 4200), blink);
            return;
        }
        image.setTexture(`${key}-blink`);
        scene.time.delayedCall(140, () => {
            if (image.active) {
                image.setTexture(key);
            }
        });
        scene.time.delayedCall(Phaser.Math.Between(1800, 4200), blink);
    };

    scene.time.delayedCall(Phaser.Math.Between(800, 2000), blink);
}
