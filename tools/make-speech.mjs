// Records everything the school says aloud (spokenTexts() in docs/src/data/school.js) as
// docs/assets/speech/<file>.m4a, with Piper and its Polish voice "gosia". Only missing
// recordings are made (all of them with --all); recordings no text needs any more go.
//
// Piper isn't in the repository. Once: from https://github.com/rhasspy/piper/releases
// unpack piper_windows_amd64.zip into %LOCALAPPDATA%\piper (giving piper\piper.exe), and
// put pl_PL-gosia-medium.onnx and .onnx.json from
// https://huggingface.co/rhasspy/piper-voices/tree/main/pl/pl_PL/gosia/medium next to it.
// Another folder can be given in PIPER_DIR. Compressing to m4a uses Windows' own encoder
// (tools/wav-to-m4a.ps1).
//
// Usage: node tools/make-speech.mjs [--all]

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// The game's modules expect Phaser; nothing here draws, so a stand-in will do.
globalThis.Phaser = new Proxy(function () {}, { get: () => globalThis.Phaser, apply: () => globalThis.Phaser });
globalThis.window = globalThis;

const { spokenTexts } = await import('../docs/src/data/school.js');
const { SPEECH_DIR, speechFile } = await import('../docs/src/audio/speech.js');

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT_DIR = join(ROOT, 'docs', SPEECH_DIR);
const PIPER_DIR = process.env.PIPER_DIR || join(process.env.LOCALAPPDATA || '', 'piper');
const PIPER = join(PIPER_DIR, 'piper', 'piper.exe');
const VOICE = join(PIPER_DIR, 'pl_PL-gosia-medium.onnx');
const WORK = join(PIPER_DIR, 'work');
// A little slower than Piper's normal pace, for children; a pause between sentences.
const LENGTH_SCALE = '1.1';
const SENTENCE_SILENCE = '0.3';

if (!existsSync(PIPER) || !existsSync(VOICE)) {
    console.error(`Piper or the gosia voice is missing in ${PIPER_DIR} (see the top of this file).`);
    process.exit(1);
}
mkdirSync(OUT_DIR, { recursive: true });
rmSync(WORK, { recursive: true, force: true });
mkdirSync(WORK, { recursive: true });

const texts = spokenTexts();
const wanted = new Map(texts.map((text) => [speechFile(text), text]));
const todo = [...wanted].filter(([file]) => process.argv.includes('--all') || !existsSync(join(OUT_DIR, `${file}.m4a`)));

if (todo.length) {
    const lines = todo.map(([file, text]) => JSON.stringify({ text, output_file: join(WORK, `${file}.wav`) })).join('\n');
    const piper = spawnSync(PIPER, ['--model', VOICE, '--json-input', '--length_scale', LENGTH_SCALE, '--sentence_silence', SENTENCE_SILENCE],
        { input: `${lines}\n`, encoding: 'utf8' });
    if (piper.status !== 0) {
        console.error(piper.stderr);
        process.exit(1);
    }
    const encode = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', join(ROOT, 'tools', 'wav-to-m4a.ps1'), WORK],
        { encoding: 'utf8' });
    if (encode.status !== 0) {
        console.error(encode.stderr || encode.stdout);
        process.exit(1);
    }
    for (const [file, text] of todo) {
        renameSync(join(WORK, `${file}.m4a`), join(OUT_DIR, `${file}.m4a`));
        console.log(`recorded ${file}.m4a: ${text}`);
    }
}
rmSync(WORK, { recursive: true, force: true });

for (const name of readdirSync(OUT_DIR).filter((f) => f.endsWith('.m4a'))) {
    if (!wanted.has(name.slice(0, -4))) {
        rmSync(join(OUT_DIR, name));
        console.log(`removed ${name} (no text needs it)`);
    }
}
console.log(`${texts.length} texts, ${todo.length} recorded now`);
