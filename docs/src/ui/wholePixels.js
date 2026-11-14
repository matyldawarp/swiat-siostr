// The canvas and the ikony 64 are never a fraction of a pixel in size, the pixels of the
// game's scenes are only ever multiplied by whole numbers, and every picture in a scene sits
// on the scene's pixel grid (one game pixel, notes/wyglad.md): never scaled or turned, its
// top-left corner on a whole game pixel. A fraction makes the browser or the GPU smear or
// unevenly size the pixels. Checked all the time while the game runs, after
// every resize and every second. A problem is reported as an error (in the console, and in
// the corner in debug mode, index.html), once per kind.

const reported = new Set();

function report(message) {
    if (reported.has(message)) {
        return;
    }
    reported.add(message);
    const error = new Error(`Ułamkowe piksele: ${message}`);
    if (window.reportError) {
        window.reportError(error);
    } else {
        console.error(error);
    }
}

const whole = (value) => Math.abs(value - Math.round(value)) < 1e-3;

// Every game object of a scene, also those inside containers.
function allObjects(list, out = []) {
    list.forEach((object) => {
        out.push(object);
        if (object.list) {
            allObjects(object.list, out);
        }
    });
    return out;
}

// Pictures of a scene that must keep to its pixel grid: images and patterns, except the
// ikony 64 (their own 64x64 grid) and pictures marked freeScale (the coloring pages, which
// are drawings smoothed to any size, not pixel art).
function onSceneGrid(object) {
    return object.visible && !object.isIcon64 && !object.freeScale
        && ['Image', 'Sprite', 'TileSprite', 'NineSlice'].includes(object.type);
}

// What is wrong with a picture's place on the grid, or null.
function offGrid(picture) {
    const m = picture.getWorldTransformMatrix();
    if (Math.abs(m.scaleX - 1) > 1e-6 || Math.abs(m.scaleY - 1) > 1e-6) {
        return `jest przeskalowany ${m.scaleX.toFixed(2)}x${m.scaleY.toFixed(2)} razy`;
    }
    if (Math.abs(m.rotation) > 1e-6) {
        return 'jest obrócony';
    }
    const left = m.tx - picture.displayOriginX;
    const top = m.ty - picture.displayOriginY;
    if (!whole(left) || !whole(top)) {
        return `ma lewy górny róg w ${left.toFixed(2)}, ${top.toFixed(2)}`;
    }
    return null;
}

// Keeps whatever a tween moves in a scene on whole game pixels in every frame: tweens work
// out positions in fractions, which would put pictures between the grid's pixels while
// they move. Called by BaseScene for the stage's scenes.
export function snapTweensToGrid(scene) {
    const snap = () => {
        scene.tweens.getTweens().forEach((tween) => {
            (tween.targets || []).forEach((target) => {
                if (target && target.type && typeof target.x === 'number') {
                    target.x = Math.round(target.x);
                    target.y = Math.round(target.y);
                }
            });
        });
    };
    scene.events.on('postupdate', snap);
    scene.events.once('shutdown', () => scene.events.off('postupdate', snap));
}

// Returns the problems found now (also reported).
export function checkWholePixels(game) {
    const problems = [];
    const dpr = window.devicePixelRatio || 1;
    const canvas = game.canvas;
    const cssW = parseFloat(canvas.style.width);
    const cssH = parseFloat(canvas.style.height);
    if (!whole(cssW) || !whole(cssH)) {
        problems.push(`płótno ma ${cssW}x${cssH} px CSS`);
    }
    if (!whole(cssW * dpr - canvas.width) || !whole(cssH * dpr - canvas.height) || Math.round(cssW * dpr) !== canvas.width) {
        problems.push(`płótno ${canvas.width}x${canvas.height} nie pasuje do ${cssW}x${cssH} px CSS przy dpr ${dpr}`);
    }

    game.scene.getScenes(true).forEach((scene) => {
        const zoom = scene.cameras.main.zoom;
        // The scenes' pixels are only ever multiplied by whole numbers (RENDER_SCALE); the
        // overlay over the whole window (fillsWindow) has its own scale.
        if (!scene.fillsWindow && !whole(zoom)) {
            problems.push(`scena ${scene.scene.key} jest powiększona ${zoom} razy`);
        }
        allObjects(scene.children.list).filter((o) => o.isIcon64 && o.visible).forEach((icon) => {
            const matrix = icon.getWorldTransformMatrix();
            // Skip icons in a moment of animation (a pulsing or growing button).
            if (Math.abs(matrix.scaleX / icon.scaleX - 1) > 1e-6) {
                return;
            }
            const size = icon.displayWidth * zoom;
            if (!whole(size)) {
                problems.push(`ikona 64 w ${scene.scene.key} ma ${size.toFixed(2)} px ekranu`);
            }
        });
        if (!scene.fillsWindow) {
            allObjects(scene.children.list).filter(onSceneGrid).forEach((picture) => {
                const problem = offGrid(picture);
                if (problem) {
                    problems.push(`obrazek ${picture.texture.key} w ${scene.scene.key} ${problem}`);
                }
            });
        }
    });
    problems.forEach(report);
    return problems;
}

export function watchWholePixels(game) {
    game.scale.on(Phaser.Scale.Events.RESIZE, () => setTimeout(() => checkWholePixels(game), 500));
    setInterval(() => checkWholePixels(game), 1000);
}
