// Adds a song from YouTube to the game, following the music rules in CLAUDE.md.
//
// Step 1, look up who made it (prints the video title, channel and description):
//   node tools/add-song.mjs <youtube-url>
// Step 2, add it once the artist and title are certain:
//   node tools/add-song.mjs <youtube-url> --artist "Dove Cameron" --title "If Only" [--album "..."] [--color 0xf7b2cc]
//
// Step 2 downloads the audio as MP3 with ID3 tags (artist, title, album), saves it as
// docs/assets/music/<autor-tytul>.bin, saves the thumbnail shrunk to 48x27 as
// <autor-tytul>.jpg next to it, appends the song to docs/src/data/music.js (license
// "Public domain", youtubeUrl exactly as given) and runs `npm run check`.
// Needs yt-dlp and ffmpeg on the PATH.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MUSIC_DIR = join(ROOT, 'docs', 'assets', 'music');
const MUSIC_LIST = join(ROOT, 'docs', 'src', 'data', 'music.js');

// Pastel row colours for the song chooser, used in turn by new songs.
const COLORS = [0xd9ccf5, 0xf7b2cc, 0xbfe8d6, 0xffe1c4, 0xcfe8ff, 0xfff1c9];

function parseArgs(argv) {
    const options = {};
    const rest = [];
    for (let i = 0; i < argv.length; i++) {
        if (argv[i].startsWith('--')) {
            options[argv[i].slice(2)] = argv[++i];
        } else {
            rest.push(argv[i]);
        }
    }
    return { url: rest[0], ...options };
}

function run(command, args) {
    const result = spawnSync(command, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    if (result.error) {
        throw new Error(`${command} could not start (${result.error.code}); is it installed and on the PATH?`);
    }
    if (result.status !== 0) {
        throw new Error(`${command} failed:\n${result.stderr}`);
    }
    return result.stdout;
}

// "Dove Cameron", "If Only" -> "dove-cameron-if-only", without Polish letters.
function slugify(...parts) {
    return parts.join(' ')
        .replace(/ł/g, 'l').replace(/Ł/g, 'L')
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function quote(text) {
    return `'${String(text).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

const args = parseArgs(process.argv.slice(2));
if (!args.url) {
    console.error('Usage: node tools/add-song.mjs <youtube-url> [--artist "..." --title "..." --album "..." --color 0x...]');
    process.exit(1);
}

if (!args.artist || !args.title) {
    const info = JSON.parse(run('yt-dlp', ['--dump-single-json', '--no-playlist', args.url]));
    console.log(`Video title: ${info.title}`);
    console.log(`Channel:     ${info.channel || info.uploader}`);
    if (info.artist || info.track) {
        console.log(`YouTube Music says: ${info.artist || '?'} - ${info.track || '?'}${info.album ? ` (album: ${info.album})` : ''}`);
    }
    console.log(`Description:\n${(info.description || '').split('\n').slice(0, 15).join('\n')}`);
    console.log('\nWork out the artist and title from the description and channel (not the video title),');
    console.log('then run again with --artist and --title. Ask the user if unsure.');
    process.exit(0);
}

const slug = slugify(args.artist, args.title);
const binPath = join(MUSIC_DIR, `${slug}.bin`);
const jpgPath = join(MUSIC_DIR, `${slug}.jpg`);
const listSource = readFileSync(MUSIC_LIST, 'utf8');
if (existsSync(binPath) || listSource.includes(`assets/music/${slug}.bin`)) {
    console.error(`${slug}.bin is already in the game.`);
    process.exit(1);
}

const work = mkdtempSync(join(tmpdir(), 'add-song-'));
try {
    // Audio as MP3, then tagged; the tags are written into a fresh copy.
    run('yt-dlp', ['--no-playlist', '-x', '--audio-format', 'mp3', '--audio-quality', '0', '-o', join(work, 'audio.%(ext)s'), args.url]);
    const tags = ['-metadata', `artist=${args.artist}`, '-metadata', `title=${args.title}`];
    if (args.album) {
        tags.push('-metadata', `album=${args.album}`);
    }
    run('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(work, 'audio.mp3'), '-map', '0:a', '-c', 'copy', ...tags, '-id3v2_version', '3', '-f', 'mp3', binPath]);

    // Thumbnail shrunk to pixel-art size.
    run('yt-dlp', ['--no-playlist', '--skip-download', '--write-thumbnail', '--convert-thumbnails', 'jpg', '-o', join(work, 'thumb.%(ext)s'), args.url]);
    const thumb = readdirSync(work).find((f) => f.startsWith('thumb.'));
    run('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(work, thumb), '-vf', 'scale=48:27:flags=area', '-frames:v', '1', jpgPath]);
} finally {
    rmSync(work, { recursive: true, force: true });
}

const songCount = (listSource.match(/file:\s*'/g) || []).length;
const color = args.color || `0x${COLORS[songCount % COLORS.length].toString(16)}`;
const entry = [
    '    {',
    `        file: 'assets/music/${slug}.bin',`,
    `        thumb: 'assets/music/${slug}.jpg',`,
    `        artist: ${quote(args.artist)},`,
    `        title: ${quote(args.title)},`,
    ...(args.album ? [`        album: ${quote(args.album)},`] : []),
    `        youtubeUrl: ${quote(args.url)},`,
    "        license: 'Public domain',",
    `        color: ${color}`,
    '    }'
].join('\n');

const end = listSource.lastIndexOf('];');
const before = listSource.slice(0, end).replace(/\s*$/, '');
const separator = before.endsWith('[') ? '\n' : ',\n';
writeFileSync(MUSIC_LIST, `${before}${separator}${entry}\n${listSource.slice(end)}`);

console.log(`Added ${args.artist} - ${args.title} as ${slug}.bin`);
spawnSync(process.execPath, [join(ROOT, 'tools', 'check.mjs')], { stdio: 'inherit' });
