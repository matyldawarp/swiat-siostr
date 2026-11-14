import { hasImage, imageTexture } from './images.js';

// Every character sprite is 16x16 pixels, drawn around its centre.
export const SPRITE_SIZE = 16;

// Distance from a character's centre to its top or bottom edge at the given sprite scale.
export function spriteHalf(scale) {
    return (SPRITE_SIZE / 2) * scale;
}

// The textures `<id>`, `<id>-blink` and `<id>-chew` of a character, from its pictures in
// docs/assets/gfx/postacie/ (gfx/images.js). Characters drawn by the girls have only one
// picture, used for all three.
export function createHamsterTextures(scene, character) {
    const own = (suffix) => (hasImage(`postacie/${character.id}${suffix}`) ? suffix : '');
    ['', '-blink', '-chew'].forEach((suffix) => {
        imageTexture(scene, `postacie/${character.id}${own(suffix)}`, character.id + suffix);
    });
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
