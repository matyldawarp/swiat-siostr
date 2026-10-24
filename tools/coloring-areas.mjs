// Splits a coloring page into the areas paint fills, and outlines them as SVG paths.
// Used by tools/make-coloring.mjs; the game only reads the resulting SVG.

// Darker than this (0-255 gray) counts as line; the rest is paper.
const LINE_THRESHOLD = 200;
// Gaps in the drawing up to about twice this many pixels wide count as closed, so paint
// doesn't leak out of a shape whose outline doesn't quite meet.
const GAP_CLOSE = 3;

// Thins a mask of strokes (1 = ink) in place to their 1-pixel-wide middle, keeping every
// stroke connected (Zhang–Suen thinning). The result still stops 4-connected growth.
function thin(mask, width, height) {
    const at = (x, y) => (x < 0 || y < 0 || x >= width || y >= height ? 0 : mask[y * width + x]);
    const remove = [];
    let changed = true;
    while (changed) {
        changed = false;
        for (const pass of [0, 1]) {
            remove.length = 0;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    if (!mask[y * width + x]) {
                        continue;
                    }
                    // Neighbours clockwise from the top.
                    const n = [at(x, y - 1), at(x + 1, y - 1), at(x + 1, y), at(x + 1, y + 1),
                        at(x, y + 1), at(x - 1, y + 1), at(x - 1, y), at(x - 1, y - 1)];
                    const filled = n.reduce((a, b) => a + b, 0);
                    if (filled < 2 || filled > 6) {
                        continue;
                    }
                    let edges = 0;
                    for (let k = 0; k < 8; k++) {
                        if (!n[k] && n[(k + 1) % 8]) {
                            edges++;
                        }
                    }
                    if (edges !== 1) {
                        continue;
                    }
                    const [p2, , p4, , p6, , p8] = n;
                    const ok = pass === 0
                        ? !(p2 && p4 && p6) && !(p4 && p6 && p8)
                        : !(p2 && p4 && p8) && !(p2 && p6 && p8);
                    if (ok) {
                        remove.push(y * width + x);
                    }
                }
            }
            if (remove.length > 0) {
                changed = true;
                remove.forEach((i) => {
                    mask[i] = 0;
                });
            }
        }
    }
}

// A copy of a mask grown by `r` pixels in every direction (a round brush).
function widen(mask, width, height, r) {
    const out = new Uint8Array(mask.length);
    for (let i = 0; i < mask.length; i++) {
        if (!mask[i]) {
            continue;
        }
        const x = i % width;
        const y = Math.floor(i / width);
        for (let dy = -r; dy <= r; dy++) {
            for (let dx = -r; dx <= r; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (dx * dx + dy * dy <= r * r && nx >= 0 && ny >= 0 && nx < width && ny < height) {
                    out[ny * width + nx] = 1;
                }
            }
        }
    }
    return out;
}

// Labels every pixel of a grayscale page (one byte per pixel) with its area. Areas are
// found with the strokes fattened by GAP_CLOSE pixels (gaps closed, the page edge counts
// as a line); then each stroke is thinned to its 1-pixel middle, which becomes the border
// between areas, and everything else joins the nearest area. Returns { labels, count }.
export function findAreas(gray, width, height) {
    const total = width * height;
    const ink = new Uint8Array(total);
    for (let i = 0; i < total; i++) {
        ink[i] = gray[i] < LINE_THRESHOLD ? 1 : 0;
    }
    const fat = widen(ink, width, height, GAP_CLOSE);
    for (let i = 0; i < total; i++) {
        const x = i % width;
        const y = Math.floor(i / width);
        if (x < GAP_CLOSE || y < GAP_CLOSE || x >= width - GAP_CLOSE || y >= height - GAP_CLOSE) {
            fat[i] = 1;
        }
    }
    thin(ink, width, height);
    const line = ink;

    const neighboursOf = (i) => {
        const x = i % width;
        return [x > 0 ? i - 1 : -1, x < width - 1 ? i + 1 : -1, i - width, i >= total - width ? -1 : i + width];
    };
    const labels = new Int32Array(total).fill(-1);
    const stack = new Int32Array(total);
    let count = 0;
    // 4-connected patches of `open` pixels without a label become new areas.
    const label = (open) => {
        for (let start = 0; start < total; start++) {
            if (!open(start) || labels[start] !== -1) {
                continue;
            }
            const id = count++;
            let top = 0;
            stack[top++] = start;
            labels[start] = id;
            while (top > 0) {
                const i = stack[--top];
                for (const n of neighboursOf(i)) {
                    if (n >= 0 && open(n) && labels[n] === -1) {
                        labels[n] = id;
                        stack[top++] = n;
                    }
                }
            }
        }
    };
    // Areas grow out ring by ring into unlabeled `open` pixels.
    const grow = (open) => {
        let ring = [];
        for (let i = 0; i < total; i++) {
            if (labels[i] !== -1) {
                ring.push(i);
            }
        }
        while (ring.length > 0) {
            const next = [];
            for (const i of ring) {
                for (const n of neighboursOf(i)) {
                    if (n >= 0 && open(n) && labels[n] === -1) {
                        labels[n] = labels[i];
                        next.push(n);
                    }
                }
            }
            ring = next;
        }
    };

    // Paper away from the fattened strokes, then up to the thin middle lines; paper no
    // area reached (a narrow space closed in by the lines) gets areas of its own; finally
    // the middle lines join a neighbouring area, so paint reaches under the drawn lines.
    label((i) => !fat[i]);
    grow((i) => !line[i]);
    label((i) => !line[i]);
    grow(() => true);
    return { labels, count };
}

// Joins every area smaller than `minPixels` to a neighbour, so no area is too small for a
// child's finger, and numbers the areas 0.. again. A small area joins its smallest
// neighbour (longest shared border on a tie): small pieces of one thing, like the parts
// of a head, come together first, instead of a head piece vanishing into the background.
// Changes `labels` in place; returns the new count.
export function mergeSmallAreas(labels, width, height, count, minPixels) {
    const parent = Array.from({ length: count }, (_, i) => i);
    const root = (a) => {
        while (parent[a] !== a) {
            parent[a] = parent[parent[a]];
            a = parent[a];
        }
        return a;
    };
    for (;;) {
        // Sizes and shared border lengths of the areas as merged so far.
        const size = new Map();
        const borders = new Map();
        const addBorder = (a, b) => {
            if (!borders.has(a)) {
                borders.set(a, new Map());
            }
            const m = borders.get(a);
            m.set(b, (m.get(b) || 0) + 1);
        };
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const a = root(labels[y * width + x]);
                size.set(a, (size.get(a) || 0) + 1);
                if (x + 1 < width) {
                    const b = root(labels[y * width + x + 1]);
                    if (a !== b) {
                        addBorder(a, b);
                        addBorder(b, a);
                    }
                }
                if (y + 1 < height) {
                    const b = root(labels[(y + 1) * width + x]);
                    if (a !== b) {
                        addBorder(a, b);
                        addBorder(b, a);
                    }
                }
            }
        }
        // Only the smallest area joins a neighbour per round, so sizes stay current.
        const small = [...size.entries()].filter(([a, s]) => s < minPixels && borders.has(a))
            .sort((p, q) => p[1] - q[1]);
        if (small.length === 0) {
            break;
        }
        const [a] = small[0];
        let best = -1;
        for (const [b, length] of borders.get(a)) {
            const better = best === -1 || size.get(b) < size.get(best)
                || (size.get(b) === size.get(best) && length > borders.get(a).get(best));
            if (better) {
                best = b;
            }
        }
        parent[a] = best;
    }

    // Number the remaining areas 0.. in order of first appearance.
    const renumber = new Map();
    for (let i = 0; i < labels.length; i++) {
        const r = root(labels[i]);
        if (!renumber.has(r)) {
            renumber.set(r, renumber.size);
        }
        labels[i] = renumber.get(r);
    }
    return renumber.size;
}

// The outline of area `id` as an SVG path along pixel edges: one closed loop per border
// (outer edge and holes), meant for fill-rule="evenodd". Neighbouring areas share edges
// exactly, so no paper shows between them.
export function areaPath(labels, width, height, id) {
    const inside = (x, y) => x >= 0 && y >= 0 && x < width && y < height && labels[y * width + x] === id;
    // Directed edges with the area on their right (y grows downwards), keyed by start point.
    const edges = new Map();
    const key = (x, y) => y * (width + 1) + x;
    const add = (x1, y1, x2, y2) => {
        const k = key(x1, y1);
        if (!edges.has(k)) {
            edges.set(k, []);
        }
        edges.get(k).push([x2, y2]);
    };
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (!inside(x, y)) {
                continue;
            }
            if (!inside(x, y - 1)) {
                add(x, y, x + 1, y);
            }
            if (!inside(x + 1, y)) {
                add(x + 1, y, x + 1, y + 1);
            }
            if (!inside(x, y + 1)) {
                add(x + 1, y + 1, x, y + 1);
            }
            if (!inside(x - 1, y)) {
                add(x, y + 1, x, y);
            }
        }
    }

    const loops = [];
    for (const [startKey, list] of edges) {
        while (list.length > 0) {
            const sx = startKey % (width + 1);
            const sy = Math.floor(startKey / (width + 1));
            const points = [[sx, sy]];
            let [x, y] = list.pop();
            while (x !== sx || y !== sy) {
                points.push([x, y]);
                const next = edges.get(key(x, y));
                [x, y] = next.pop();
            }
            loops.push(points);
        }
    }

    // Straight runs collapse to their corners.
    return loops.map((points) => {
        const corners = points.filter((p, i) => {
            const prev = points[(i - 1 + points.length) % points.length];
            const next = points[(i + 1) % points.length];
            return (p[0] - prev[0]) * (next[1] - p[1]) !== (p[1] - prev[1]) * (next[0] - p[0]);
        });
        return `M${corners.map(([px, py]) => `${px} ${py}`).join('L')}Z`;
    }).join('');
}
