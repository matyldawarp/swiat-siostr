// The game's pictures are PNG files in docs/assets/gfx/, one game pixel per PNG pixel, so
// they can be edited in any graphics program. docs/assets/gfx/images.json lists every one
// by its key (its path without .png, e.g. 'kuchnia-lakotka/lodowka') with its anchor: the
// pixel of the PNG that lands on the (x, y) the game places it at. A missing entry means
// the anchor is the top-left corner.

const ROOT = 'assets/gfx/';
let manifest = {};
const loaded = new Map();

function loadOne(key) {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
            loaded.set(key, image);
            resolve();
        };
        image.onerror = () => {
            console.warn(`Brak obrazka ${ROOT}${key}.png`);
            resolve();
        };
        image.src = `${ROOT}${key}.png`;
    });
}

// Reads the list and every picture in it; the game starts once they are all in.
export function loadImages() {
    return fetch(`${ROOT}images.json`)
        .then((response) => response.json())
        .then((list) => {
            manifest = list;
            return Promise.all(Object.keys(list).map(loadOne));
        });
}

export function imageKeys() {
    return Object.keys(manifest);
}

export function hasImage(key) {
    return loaded.has(key);
}

// The picture as a texture of the scene's game, added on first use; its texture key is the
// picture's key, or `as` (e.g. a character's id, the key older code uses).
export function imageTexture(scene, key, as = key) {
    if (!scene.textures.exists(as)) {
        const image = loaded.get(key);
        if (!image) {
            throw new Error(`Nie ma obrazka ${key}`);
        }
        scene.textures.addImage(as, image);
    }
    return as;
}

// The picture's size in game pixels and its anchor.
export function imageInfo(key) {
    const image = loaded.get(key);
    const [ax, ay] = (manifest[key] && manifest[key].anchor) || [0, 0];
    return { width: image ? image.width : 0, height: image ? image.height : 0, anchorX: ax, anchorY: ay };
}

// Points the image's origin at the picture's anchor.
function anchor(image, key) {
    const { width, height, anchorX, anchorY } = imageInfo(key);
    return image.setOrigin(width ? anchorX / width : 0, height ? anchorY / height : 0);
}

// The picture `key` with its anchor at (x, y).
export function addImage(scene, x, y, key) {
    return anchor(scene.add.image(x, y, imageTexture(scene, key)), key);
}

// Shows another picture in an image from addImage, e.g. an opened door; anchors match up.
export function setImage(image, key) {
    imageTexture(image.scene, key);
    image.setTexture(key);
    image.setSize(image.frame.width, image.frame.height);
    return anchor(image, key);
}

// The picture as a repeating pattern filling the rectangle, e.g. wallpaper over the
// scene's whole view.bleed. The pattern lines up with the stage's (0, 0) wherever the
// rectangle starts.
export function addPattern(scene, x, y, width, height, key) {
    const tile = scene.add.tileSprite(x, y, width, height, imageTexture(scene, key)).setOrigin(0);
    tile.setTilePosition(x, y);
    return tile;
}
