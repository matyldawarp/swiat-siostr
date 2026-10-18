// Quick checks of the game code and data that need no browser: `npm run check`.
//
// 1. Imports: every imported file exists and exports the imported names, and every file in
//    docs/src is reachable from main.js (a file nobody imports is never loaded).
// 2. Missing imports: a module uses a name another module exports without importing it.
//    Those would only fail in the browser, when the code runs.
// 3. Loading: every module is imported in Node with a stubbed Phaser, which catches syntax
//    errors and mistakes in top-level code.
// 4. Data: characters, cakes and the music list are complete and point at existing files.
// 5. House rules from CLAUDE.md that are easy to check mechanically.
//
// Exits with code 1 and lists the problems if anything is wrong.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const DOCS = join(ROOT, 'docs');
const SRC = join(DOCS, 'src');
const MAIN = join(SRC, 'main.js');

const problems = [];
const rel = (file) => relative(ROOT, file).split(sep).join('/');
const fail = (file, message) => problems.push(`${file ? rel(file) + ': ' : ''}${message}`);

function listJs(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) {
            return listJs(path);
        }
        return entry.name.endsWith('.js') ? [path] : [];
    });
}

// Source without comments and string contents, so names inside them are not counted.
function stripCode(source) {
    return source
        .replace(/\/\*[\s\S]*?\*\//g, ' ')
        .replace(/(^|[^:\\])\/\/.*$/gm, '$1')
        .replace(/`(?:\\.|\$\{[^}]*\}|[^`\\])*`/g, '``')
        .replace(/'(?:\\.|[^'\\\n])*'/g, "''")
        .replace(/"(?:\\.|[^"\\\n])*"/g, '""');
}

function parseModule(file) {
    const source = readFileSync(file, 'utf8');
    const imports = [];
    for (const m of source.matchAll(/import\s*\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]/g)) {
        const names = m[1].split(',').map((n) => n.trim().split(/\s+as\s+/).pop()).filter(Boolean);
        const original = m[1].split(',').map((n) => n.trim().split(/\s+as\s+/)[0]).filter(Boolean);
        imports.push({ from: resolve(dirname(file), m[2]), names, original });
    }
    const exports = new Set();
    for (const m of source.matchAll(/export\s+(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/g)) {
        exports.add(m[1]);
    }
    for (const m of source.matchAll(/export\s*\{([^}]*)\}/g)) {
        m[1].split(',').map((n) => n.trim().split(/\s+as\s+/).pop()).filter(Boolean).forEach((n) => exports.add(n));
    }
    // Top-level declarations (no indentation), exported or not.
    const declared = new Set(exports);
    for (const m of source.matchAll(/^(?:export\s+)?(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/gm)) {
        declared.add(m[1]);
    }
    return { file, source, imports, exports, declared };
}

const files = listJs(SRC);
const modules = new Map(files.map((f) => [f, parseModule(f)]));

// --- 1. Imports -------------------------------------------------------------------------

for (const mod of modules.values()) {
    for (const imp of mod.imports) {
        const target = modules.get(imp.from);
        if (!target) {
            fail(mod.file, `imports a missing file ${rel(imp.from)}`);
            continue;
        }
        imp.original.forEach((name) => {
            if (!target.exports.has(name)) {
                fail(mod.file, `imports ${name} from ${rel(imp.from)}, which does not export it`);
            }
        });
    }
}

const reachable = new Set();
const visit = (file) => {
    if (reachable.has(file) || !modules.has(file)) {
        return;
    }
    reachable.add(file);
    modules.get(file).imports.forEach((imp) => visit(imp.from));
};
visit(MAIN);
files.filter((f) => !reachable.has(f)).forEach((f) => fail(f, 'is not imported from main.js (directly or indirectly), so the game never loads it'));

// --- 2. Missing imports -----------------------------------------------------------------

const exporters = new Map();
for (const mod of modules.values()) {
    mod.exports.forEach((name) => {
        if (!exporters.has(name)) {
            exporters.set(name, []);
        }
        exporters.get(name).push(mod.file);
    });
}
for (const mod of modules.values()) {
    const known = new Set([...mod.declared, ...mod.imports.flatMap((imp) => imp.names)]);
    const code = stripCode(mod.source);
    for (const [name, from] of exporters) {
        if (known.has(name)) {
            continue;
        }
        // A use of the name that is not a property access (`.name`), an object key (`name:`)
        // or a method definition (`name(args) {`).
        const use = new RegExp(`(^|[^.\\w$])${name.replace(/\$/g, '\\$')}(?![\\w$])(?!\\s*:(?!:))(?!\\s*\\([^)]*\\)\\s*\\{)`, 'm');
        // Local variables and parameters may shadow the name; skip those files.
        const local = new RegExp(`(?:const|let|var|function)\\s+${name}\\b|[(,]\\s*${name}\\s*[,)=]`);
        if (use.test(code) && !local.test(code)) {
            fail(mod.file, `uses ${name} without importing it (exported by ${from.map(rel).join(', ')})`);
        }
    }
}

// --- 3. Loading ---------------------------------------------------------------------------

// Stand-in for anything Phaser offers: properties, calls and `new` all give another stub,
// and classes can extend it.
function stub() {
    const fn = function () {};
    return new Proxy(fn, {
        get: (target, key) => (key === 'prototype' ? target.prototype : key === Symbol.toPrimitive ? () => 0 : stub()),
        apply: () => stub(),
        construct: () => stub()
    });
}
globalThis.Phaser = stub();
// main.js starts the game once fonts load; never resolving keeps the game from starting.
globalThis.document = { fonts: { load: () => new Promise(() => {}) } };
globalThis.window = globalThis;

const loaded = {};
for (const file of files) {
    try {
        loaded[rel(file)] = await import(pathToFileURL(file).href);
    } catch (error) {
        fail(file, `fails to load: ${error.message}`);
    }
}

// --- 4. Data ------------------------------------------------------------------------------

const charactersModule = loaded['docs/src/data/characters.js'];
const iconsModule = loaded['docs/src/gfx/icons.js'];
const musicModule = loaded['docs/src/data/music.js'];
const charactersFile = join(SRC, 'data', 'characters.js');
const musicFile = join(SRC, 'data', 'music.js');

if (charactersModule) {
    const { CHARACTERS, CHARACTER_SLOTS, CHARACTER_CAKES } = charactersModule;
    const ids = new Set();
    CHARACTERS.forEach((c, i) => {
        const where = `character ${c.id || '#' + i}`;
        if (!c.id || !/^[a-z0-9]+$/.test(c.id)) {
            fail(charactersFile, `${where}: id must be lowercase letters and digits`);
        }
        if (ids.has(c.id)) {
            fail(charactersFile, `${where}: duplicate id`);
        }
        ids.add(c.id);
        if (!c.name) {
            fail(charactersFile, `${where}: missing name`);
        }
        if (typeof c.species !== 'string') {
            fail(charactersFile, `${where}: species must be a string (may be empty)`);
        }
        if (!c.colors || typeof c.colors.body !== 'number') {
            fail(charactersFile, `${where}: missing colors.body`);
        }
        if (!c.pixels && (typeof c.colors?.light !== 'number' || typeof c.colors?.pink !== 'number')) {
            fail(charactersFile, `${where}: a hamster without pixels needs colors.light and colors.pink`);
        }
        if (c.pixels) {
            const allowed = new Set(['.', '#', 'E', 'W', 'O', ...Object.keys(c.palette || {})]);
            if (c.pixels.length !== 16 || c.pixels.some((row) => row.length !== 16)) {
                fail(charactersFile, `${where}: pixels must be 16 rows of 16 characters`);
            }
            const unknown = new Set([...c.pixels.join('')].filter((ch) => !allowed.has(ch)));
            if (unknown.size > 0) {
                fail(charactersFile, `${where}: pixels use letters without a colour: ${[...unknown].join(' ')}`);
            }
        }
        const sound = c.sound;
        if (!sound || !['sine', 'triangle', 'square', 'sawtooth'].includes(sound.wave)
            || typeof sound.gap !== 'number' || !Array.isArray(sound.chirps) || sound.chirps.length === 0
            || sound.chirps.some((ch) => !(ch.from > 0 && ch.to > 0 && ch.duration > 0))) {
            fail(charactersFile, `${where}: sound needs wave, gap and chirps of { from, to, duration } (all above 0)`);
        }
    });
    if (CHARACTERS.length > CHARACTER_SLOTS) {
        fail(charactersFile, `${CHARACTERS.length} characters but only ${CHARACTER_SLOTS} slots (CHARACTER_SLOTS)`);
    }
    Object.entries(CHARACTER_CAKES).forEach(([id, cake]) => {
        if (!ids.has(id)) {
            fail(charactersFile, `CHARACTER_CAKES.${id}: no character with this id`);
        }
        if (iconsModule && !iconsModule.CAKE_TOPPINGS[cake.topping]) {
            fail(charactersFile, `CHARACTER_CAKES.${id}: unknown topping "${cake.topping}" (see CAKE_TOPPINGS in gfx/icons.js)`);
        }
    });
}

const personalitiesModule = loaded['docs/src/data/personalities.js'];
const personalitiesFile = join(SRC, 'data', 'personalities.js');
if (personalitiesModule) {
    const { PERSONALITIES, DEFAULTS } = personalitiesModule;
    // Records draw calls instead of drawing, to see that every icon can be drawn.
    const fakeGraphics = new Proxy({}, { get: () => () => {} });
    Object.entries(PERSONALITIES).forEach(([key, p]) => {
        const where = `PERSONALITIES.${key}`;
        if (!p.name) {
            fail(personalitiesFile, `${where}: missing name`);
        }
        if (typeof p.icon !== 'function') {
            fail(personalitiesFile, `${where}: icon must be a drawing function (g, cx, cy, size)`);
        } else {
            try {
                p.icon(fakeGraphics, 0, 0, 20);
            } catch (error) {
                fail(personalitiesFile, `${where}: icon fails to draw: ${error.message}`);
            }
        }
        Object.keys(p).filter((k) => !['name', 'icon'].includes(k)).forEach((k) => {
            if (!(k in DEFAULTS)) {
                fail(personalitiesFile, `${where}: unknown field ${k} (fields are listed in DEFAULTS)`);
            }
        });
        ['wander', 'stay'].forEach((table) => {
            Object.entries(p[table] || {}).forEach(([k, v]) => {
                if (!(k in DEFAULTS[table])) {
                    fail(personalitiesFile, `${where}.${table}: unknown activity ${k}`);
                }
                if (!(v >= 0)) {
                    fail(personalitiesFile, `${where}.${table}.${k}: must be a number, 0 or more`);
                }
            });
        });
        const wander = { ...DEFAULTS.wander, ...p.wander };
        if (Object.values(wander).reduce((a, b) => a + b, 0) <= 0) {
            fail(personalitiesFile, `${where}.wander: weights must not all be 0`);
        }
    });
}

if (musicModule) {
    musicModule.MUSIC.forEach((song, i) => {
        const where = `MUSIC[${i}] (${song.title || '?'})`;
        const slug = /^assets\/music\/[a-z0-9-]+\.(bin|jpg)$/;
        ['artist', 'title', 'youtubeUrl'].forEach((key) => {
            if (!song[key]) {
                fail(musicFile, `${where}: missing ${key}`);
            }
        });
        if (song.license !== 'Public domain') {
            fail(musicFile, `${where}: license must be "Public domain"`);
        }
        if (song.youtubeUrl && !/^https:\/\/(www\.youtube\.com|youtu\.be|music\.youtube\.com)\//.test(song.youtubeUrl)) {
            fail(musicFile, `${where}: youtubeUrl is not a YouTube link`);
        }
        if (typeof song.color !== 'number') {
            fail(musicFile, `${where}: missing color`);
        }
        if (!slug.test(song.file || '') || !song.file.endsWith('.bin')) {
            fail(musicFile, `${where}: file must be assets/music/<autor-tytul>.bin (lowercase, digits, dashes)`);
        } else if (!existsSync(join(DOCS, song.file))) {
            fail(musicFile, `${where}: ${song.file} does not exist`);
        }
        if (song.thumb) {
            if (!slug.test(song.thumb) || song.thumb.replace(/\.jpg$/, '') !== (song.file || '').replace(/\.bin$/, '')) {
                fail(musicFile, `${where}: thumb must be the same name as the file, ending in .jpg`);
            } else if (!existsSync(join(DOCS, song.thumb))) {
                fail(musicFile, `${where}: ${song.thumb} does not exist`);
            }
        }
    });
}

// --- 5. House rules -----------------------------------------------------------------------

for (const mod of modules.values()) {
    const code = stripCode(mod.source);
    if (!mod.file.endsWith(join('ui', 'pixel.js')) && /\.add\.text\(/.test(code)) {
        fail(mod.file, 'creates text with add.text; use PixelUI.addText so it stays sharp');
    }
    if (!mod.file.endsWith('BaseScene.js') && /extends\s+Phaser\.Scene\b/.test(code)) {
        fail(mod.file, 'extends Phaser.Scene; extend BaseScene (scenes/BaseScene.js) and implement build()');
    }
    if (/extends\s+BaseScene\b/.test(code) && /^\s{4}create\s*\(/m.test(code)) {
        fail(mod.file, 'defines create(); a BaseScene implements build({ width, height }) instead');
    }
}

const mainCode = readFileSync(MAIN, 'utf8');
const sceneList = mainCode.match(/scene:\s*\[([^\]]*)\]/);
if (!sceneList || sceneList[1].split(',').map((s) => s.trim()).filter(Boolean).pop() !== 'OverlayScene') {
    fail(MAIN, 'OverlayScene must be last in the scene list');
}

const html = readFileSync(join(DOCS, 'index.html'), 'utf8');
for (const m of html.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)) {
    if (!/^https:\/\//.test(m[1]) && m[1] !== 'src/main.js') {
        fail(join(DOCS, 'index.html'), `loads ${m[1]}; game code must be imported from src/main.js instead`);
    }
}

// --- Report -------------------------------------------------------------------------------

if (problems.length > 0) {
    console.error(`Found ${problems.length} problem${problems.length === 1 ? '' : 's'}:`);
    problems.forEach((p) => console.error(`  - ${p}`));
    process.exit(1);
}
console.log(`OK: ${files.length} modules, ${charactersModule?.CHARACTERS.length ?? 0} characters, ${musicModule?.MUSIC.length ?? 0} songs`);
