// Makes the areas the game colors from the original coloring pages.
//
//   node tools/make-coloring.mjs            remake every page
//   node tools/make-coloring.mjs <id>       remake one page
//
// For each page in docs/src/data/coloring.js, the original docs/assets/coloring/<id>.png
// (the picture exactly as given) becomes docs/assets/coloring/<id>.coloring.svg beside it:
// one <path> per area paint fills, no lines (the game shows the original's lines on top).
// Each area has a pastel fill so the file can be looked at in a browser; the game ignores
// it. On the way:
//  - `make.blank` boxes (x, y, w, h in the original's pixels) are painted white first, to
//    hide things like a printed title or a website address;
//  - lines get THICKEN pixels fatter so they stay unbroken when the picture shrinks to
//    HEIGHT pixels, the size of the page on the coloring screen and of the SVG's units;
//  - tools/coloring-areas.mjs splits it into areas (closing small gaps in the lines), and
//    areas under MIN_AREA_CM2 join their neighbour.
// To add a page: save the original as docs/assets/coloring/<id>.png, add it to
// COLORING_PAGES, run this, and look at the result in the game. Needs ffmpeg on the PATH.

import { spawnSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { areaPath, findAreas, mergeSmallAreas } from './coloring-areas.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DOCS = join(ROOT, 'docs');
const HEIGHT = 380;
const THICKEN = 1;
// No area smaller than this on the girls' iPad, so a small finger can hit it; smaller ones
// join a neighbour. The iPad shows 132 CSS px per inch and the page at 2 CSS px per page
// pixel (STAGE in docs/src/ui/pixel.js), so a centimetre is 132 / 2 / 2.54 page pixels.
const MIN_AREA_CM2 = 1;
const PAGE_PX_PER_CM = 132 / 2 / 2.54;
const MIN_AREA_PX = Math.round(MIN_AREA_CM2 * PAGE_PX_PER_CM * PAGE_PX_PER_CM);
const PREVIEW_COLORS = ['#f7b2cc', '#d9ccf5', '#bfe8d6', '#fff1c9', '#cfe8ff', '#ffe1c4', '#c3b3ea', '#a6dcc4'];

const { COLORING_PAGES, coloringImage, coloringOriginal } = await import(pathToFileURL(join(DOCS, 'src', 'data', 'coloring.js')).href);

const only = process.argv[2];
const pages = COLORING_PAGES.filter((p) => !only || p.id === only);
if (pages.length === 0) {
    console.error(`No page "${only}" in docs/src/data/coloring.js.`);
    process.exit(1);
}

let failed = false;
for (const page of pages) {
    const source = join(DOCS, coloringOriginal(page));
    if (!existsSync(source)) {
        console.error(`${page.id}: missing original ${coloringOriginal(page)}`);
        failed = true;
        continue;
    }
    const { blank = [] } = page.make || {};
    const filters = blank.map(([x, y, w, h]) => `drawbox=x=${x}:y=${y}:w=${w}:h=${h}:color=white:t=fill`);
    filters.push('format=gray');
    // Erosion spreads the dark lines by a pixel each time.
    for (let i = 0; i < THICKEN; i++) {
        filters.push('erosion');
    }
    // Area averaging keeps thin lines as gray pixels instead of dropping them.
    filters.push(`scale=-2:${HEIGHT}:flags=area`);

    // One gray byte per pixel, straight from ffmpeg.
    const result = spawnSync('ffmpeg', ['-loglevel', 'error', '-i', source, '-vf', filters.join(','),
        '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], { maxBuffer: 64 * 1024 * 1024 });
    if (result.error || result.status !== 0) {
        console.error(`${page.id}: ${result.error ? `ffmpeg could not start: ${result.error.message}` : result.stderr}`);
        failed = true;
        continue;
    }
    const gray = result.stdout;
    const height = HEIGHT;
    const width = gray.length / height;

    const found = findAreas(gray, width, height);
    const { labels } = found;
    const count = mergeSmallAreas(labels, width, height, found.count, MIN_AREA_PX);
    const paths = [];
    for (let id = 0; id < count; id++) {
        paths.push(`<path id="a${id}" fill="${PREVIEW_COLORS[id % PREVIEW_COLORS.length]}" d="${areaPath(labels, width, height, id)}"/>`);
    }
    const svg = [
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" fill-rule="evenodd" shape-rendering="crispEdges">`,
        `<!-- Areas of the coloring page "${page.title}", made by tools/make-coloring.mjs from ${page.id}.png. -->`,
        ...paths,
        '</svg>',
        ''
    ].join('\n');
    const out = join(DOCS, coloringImage(page));
    writeFileSync(out, svg);
    console.log(`wrote docs/${coloringImage(page)}: ${count} areas, ${Math.round(svg.length / 1024)} kB`);
}
process.exit(failed ? 1 : 0);
