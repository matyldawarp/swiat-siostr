// Turns a black-and-white coloring page into the small grayscale PNG the game colors in.
//
//   node tools/make-coloring.mjs <source image> <name> [--height 380] [--thicken 3] [--blank x,y,w,h ...]
//
// The source (keep it in assets/coloring-src/, outside docs/) is shrunk to `--height` game
// pixels (the page area of the coloring screen), so its lines become pixel-art lines.
// Before that the lines are made `--thicken` pixels fatter on each side, so after
// shrinking they stay unbroken and paint can't leak through them from one area into the
// next (check the number of areas in the game if a page fills strangely).
// `--blank` paints a white box over parts that must go first, such as a printed title or
// a website address, in source pixels; it may repeat.
// The result is docs/assets/coloring/<name>.png; then add the page to
// docs/src/data/coloring.js. Needs ffmpeg on the PATH.

import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT_DIR = join(ROOT, 'docs', 'assets', 'coloring');

const argv = process.argv.slice(2);
const [source, name] = argv.filter((a, i) => !a.startsWith('--') && !argv[i - 1]?.startsWith('--'));
if (!source || !name || !/^[a-z0-9-]+$/.test(name)) {
    console.error('Usage: node tools/make-coloring.mjs <source image> <name: lowercase-with-dashes> [--height 380] [--blank x,y,w,h ...]');
    process.exit(1);
}
const option = (flag) => argv.flatMap((a, i) => (a === flag ? [argv[i + 1]] : []));
const height = Number(option('--height')[0] || 380);

const filters = option('--blank').map((box) => {
    const [x, y, w, h] = box.split(',').map(Number);
    return `drawbox=x=${x}:y=${y}:w=${w}:h=${h}:color=white:t=fill`;
});
// Erosion spreads the dark lines by a pixel each time.
filters.push('format=gray');
const thicken = Number(option('--thicken')[0] ?? 3);
for (let i = 0; i < thicken; i++) {
    filters.push('erosion');
}
// Area averaging keeps thin lines as gray pixels instead of dropping them; the game then
// counts anything darker than its threshold as line.
filters.push(`scale=-2:${height}:flags=area`);

mkdirSync(OUT_DIR, { recursive: true });
const out = join(OUT_DIR, `${name}.png`);
const result = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', source, '-vf', filters.join(','), '-frames:v', '1', out], { encoding: 'utf8' });
if (result.error || result.status !== 0) {
    console.error(result.error ? `ffmpeg could not start: ${result.error.message}` : result.stderr);
    process.exit(1);
}
console.log(`wrote docs/assets/coloring/${name}.png`);
