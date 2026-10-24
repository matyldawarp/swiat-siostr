// Finds the area of a coloring page to paint, at the moment a finger taps it, from the
// blank original: no prepared areas. Plain arrays only (no canvas), so it runs anywhere.
//
// Lines are the dark pixels; the page edge counts as a line too. An area is a space
// enclosed by lines for at least MIN_ENCLOSED of its border: the rest may be small gaps
// where a drawn outline doesn't quite meet, and paint must not leak out through them.
// To find it, gaps are closed on trial by fattening every line by r pixels (r from
// MAX_GAP_RADIUS down to 0); the paper reachable from the finger without crossing a
// fattened line, plus the margin along the lines that fattening took away, is a
// candidate. Where it is cut off by a closed gap instead of a real line, it touches paper
// outside. The first (smallest) candidate enclosed enough wins; with r = 0 nothing is
// closed, so plain paper up to the lines is always a last resort.
// Paint then reaches a few pixels under the lines, but never across one.

// Darker than this (0-255 gray) counts as line.
const INK = 200;
// Gaps up to about twice this many pixels wide (in the original's pixels) can be closed.
const MAX_GAP_RADIUS = 7;
// How much of an area's border must be line or page edge.
const MIN_ENCLOSED = 0.95;
// How far paint goes under a line (pixels), so no paper shows along its soft edge.
const UNDER_LINE = 4;
// A tap right on a line paints the paper nearest to it, up to this far away.
const TAP_REACH = 5;

export class PageAreas {
    // gray: one byte per pixel of the blank page, `width` x `height`.
    constructor(gray, width, height) {
        this.width = width;
        this.height = height;
        const total = width * height;
        this.ink = new Uint8Array(total);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = y * width + x;
                const edge = x === 0 || y === 0 || x === width - 1 || y === height - 1;
                this.ink[i] = edge || gray[i] < INK ? 1 : 0;
            }
        }
        // The area each paper pixel was found in (-1: none yet), so tapping the same area
        // again gives the same one.
        this.owner = new Int32Array(total).fill(-1);
        this.areas = [];
        this.dist = null;
        this.mark = new Int32Array(total);
        this.stamp = 0;
        this.queue = new Int32Array(total);
    }

    // Distance from every pixel to the nearest line (0 on a line), roughly Euclidean.
    distances() {
        if (this.dist) {
            return this.dist;
        }
        const { width: w, height: h, ink } = this;
        const d = new Float32Array(w * h);
        for (let i = 0; i < d.length; i++) {
            d[i] = ink[i] ? 0 : Infinity;
        }
        const D = Math.SQRT2;
        // The page edge is line, so neighbours of inner pixels are always on the page.
        for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
                const i = y * w + x;
                d[i] = Math.min(d[i], d[i - 1] + 1, d[i - w] + 1, d[i - w - 1] + D, d[i - w + 1] + D);
            }
        }
        for (let y = h - 2; y >= 1; y--) {
            for (let x = w - 2; x >= 1; x--) {
                const i = y * w + x;
                d[i] = Math.min(d[i], d[i + 1] + 1, d[i + w] + 1, d[i + w + 1] + D, d[i + w - 1] + D);
            }
        }
        this.dist = d;
        return d;
    }

    // The area at pixel (x, y): its index in `areas`, or -1 (a line with no paper nearby).
    // An area is { box: { x1, y1, x2, y2 } (inclusive), mask: 1 per pixel of the box to
    // paint }.
    areaAt(x, y) {
        const seed = this.paperNear(Math.round(x), Math.round(y));
        if (seed < 0) {
            return -1;
        }
        if (this.owner[seed] >= 0) {
            return this.owner[seed];
        }
        const dist = this.distances();
        for (let r = MAX_GAP_RADIUS; r >= 0; r--) {
            if (dist[seed] <= r) {
                continue;
            }
            const found = this.trace(seed, r);
            if (found.enclosed >= MIN_ENCLOSED) {
                return this.keep(found);
            }
        }
        return -1;
    }

    // The paper pixel at or nearest to (x, y), or -1.
    paperNear(x, y) {
        const { width: w, height: h, ink } = this;
        let best = -1;
        let bestD = Infinity;
        for (let dy = -TAP_REACH; dy <= TAP_REACH; dy++) {
            for (let dx = -TAP_REACH; dx <= TAP_REACH; dx++) {
                const px = x + dx;
                const py = y + dy;
                const dd = dx * dx + dy * dy;
                if (px >= 0 && py >= 0 && px < w && py < h && !ink[py * w + px] && dd < bestD) {
                    best = py * w + px;
                    bestD = dd;
                }
            }
        }
        return best;
    }

    // The candidate area around `seed` with lines fattened by r: its paper pixels and how
    // much of its border is line.
    trace(seed, r) {
        const { width: w, ink, dist, queue, mark } = this;
        const stamp = ++this.stamp;
        // Paper away from the fattened lines.
        let end = 0;
        queue[end++] = seed;
        mark[seed] = stamp;
        for (let k = 0; k < end; k++) {
            const i = queue[k];
            for (const n of [i - 1, i + 1, i - w, i + w]) {
                if (mark[n] !== stamp && dist[n] > r) {
                    mark[n] = stamp;
                    queue[end++] = n;
                }
            }
        }
        // Back out to the real lines, through the margin fattening took (r + 1 steps, in
        // all 8 directions to reach into corners), but not into paper beyond a closed gap.
        let start = 0;
        for (let step = 0; step <= r && r > 0; step++) {
            const ringEnd = end;
            for (let k = start; k < ringEnd; k++) {
                const i = queue[k];
                for (const n of [i - 1, i + 1, i - w, i + w, i - w - 1, i - w + 1, i + w - 1, i + w + 1]) {
                    if (mark[n] !== stamp && !ink[n] && dist[n] <= r) {
                        mark[n] = stamp;
                        queue[end++] = n;
                    }
                }
            }
            start = ringEnd;
        }
        // Border: pixels of the area next to a line, and paper outside next to the area
        // (where a closed gap cut it off).
        const outside = ++this.stamp;
        let lined = 0;
        let open = 0;
        for (let k = 0; k < end; k++) {
            const i = queue[k];
            let byLine = false;
            for (const n of [i - 1, i + 1, i - w, i + w]) {
                if (ink[n]) {
                    byLine = true;
                } else if (mark[n] !== stamp && mark[n] !== outside) {
                    mark[n] = outside;
                    open++;
                }
            }
            if (byLine) {
                lined++;
            }
        }
        return { pixels: queue.slice(0, end), enclosed: lined / Math.max(1, lined + open) };
    }

    // Stores a found area: its paper, plus a few pixels under the lines around it.
    keep({ pixels }) {
        const { width: w, height: h, ink, owner, mark } = this;
        const id = this.areas.length;
        const stamp = ++this.stamp;
        let ring = [];
        for (const i of pixels) {
            mark[i] = stamp;
            if (owner[i] < 0) {
                owner[i] = id;
            }
            ring.push(i);
        }
        const all = Array.from(pixels);
        for (let step = 0; step < UNDER_LINE; step++) {
            const next = [];
            for (const i of ring) {
                const x = i % w;
                const y = (i - x) / w;
                const around = [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1];
                for (const n of around) {
                    if (n >= 0 && ink[n] && mark[n] !== stamp) {
                        mark[n] = stamp;
                        next.push(n);
                        all.push(n);
                    }
                }
            }
            ring = next;
        }

        const box = { x1: w, y1: h, x2: 0, y2: 0 };
        for (const i of all) {
            const x = i % w;
            const y = (i - x) / w;
            box.x1 = Math.min(box.x1, x);
            box.y1 = Math.min(box.y1, y);
            box.x2 = Math.max(box.x2, x);
            box.y2 = Math.max(box.y2, y);
        }
        const bw = box.x2 - box.x1 + 1;
        const mask = new Uint8Array(bw * (box.y2 - box.y1 + 1));
        for (const i of all) {
            const x = i % w;
            const y = (i - x) / w;
            mask[(y - box.y1) * bw + (x - box.x1)] = 1;
        }
        this.areas.push({ box, mask, size: pixels.length });
        return id;
    }
}
