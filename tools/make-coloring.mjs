// Makes the pictures the game colors in from the original coloring pages.
//
//   node tools/make-coloring.mjs            remake every page
//   node tools/make-coloring.mjs <id>       remake one page
//
// For each page in docs/src/data/coloring.js, the original docs/assets/coloring/<id>.png
// (the picture exactly as given) becomes docs/assets/coloring/<id>.coloring.png beside it:
//  - `make.blank` boxes (x, y, w, h in the original's pixels) are painted white first, to
//    hide things like a printed title or a website address;
//  - lines get THICKEN pixels fatter on each side, the same for every page, so after
//    shrinking they stay unbroken (the game then thins them all to the same width);
//  - the picture shrinks to HEIGHT game pixels, the page area of the coloring screen, so
//    its lines become pixel-art lines.
// To add a page: save the original as docs/assets/coloring/<id>.png, add it to
// COLORING_PAGES, run this, and look at the result in the game. Needs ffmpeg on the PATH.

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DOCS = join(ROOT, 'docs');
const HEIGHT = 380;
const THICKEN = 1;

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
    // Area averaging keeps thin lines as gray pixels instead of dropping them; the game
    // counts anything darker than its threshold as line.
    filters.push(`scale=-2:${HEIGHT}:flags=area`);

    const out = join(DOCS, coloringImage(page));
    const result = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', source, '-vf', filters.join(','), '-frames:v', '1', out], { encoding: 'utf8' });
    if (result.error || result.status !== 0) {
        console.error(`${page.id}: ${result.error ? `ffmpeg could not start: ${result.error.message}` : result.stderr}`);
        failed = true;
        continue;
    }
    console.log(`wrote docs/${coloringImage(page)}`);
}
process.exit(failed ? 1 : 0);
