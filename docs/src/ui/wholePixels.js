// The canvas and the ikony 64 are never a fraction of a pixel in size: a fraction makes the
// browser or the GPU smear their pixels. Checked all the time while the game runs, after
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
    });
    problems.forEach(report);
    return problems;
}

export function watchWholePixels(game) {
    game.scale.on(Phaser.Scale.Events.RESIZE, () => setTimeout(() => checkWholePixels(game), 500));
    setInterval(() => checkWholePixels(game), 1000);
}
