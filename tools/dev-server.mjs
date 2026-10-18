// Static dev server with optional live reload.
//
// Serves the project root without caching, on all network interfaces so the game can be
// played from an iPad on the same Wi-Fi. With --livereload it also injects a small
// EventSource client into index.html and tells every connected browser to reload when a
// file in the project changes.
//
// Usage: node tools/dev-server.mjs [port] [--livereload]

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const args = process.argv.slice(2);
const PORT = Number(args.find((a) => !a.startsWith('--')) || 8080);
const LIVE_RELOAD = args.includes('--livereload');

const IGNORED_DIRS = new Set(['.git', '.claude', 'node_modules']);
const RELOAD_PATH = '/__livereload';
const CLIENT_SNIPPET = `<script>new EventSource("${RELOAD_PATH}").onmessage = () => location.reload();</script>`;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg',
    '.wav': 'audio/wav',
    '.md': 'text/markdown; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8'
};

const reloadClients = new Set();

function send(res, status, body, type = 'text/plain; charset=utf-8') {
    res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    res.end(body);
}

// Maps a URL path to a file inside ROOT, refusing anything that escapes it.
function resolvePath(urlPath) {
    const decoded = decodeURIComponent(urlPath.split('?')[0]);
    const file = normalize(join(ROOT, decoded));
    return file === ROOT || file.startsWith(ROOT + sep) ? file : null;
}

async function serveFile(req, res) {
    let file = resolvePath(req.url);
    if (!file) {
        send(res, 403, 'Forbidden');
        return;
    }

    try {
        const info = await stat(file);
        if (info.isDirectory()) {
            file = join(file, 'index.html');
        }
        let body = await readFile(file);

        if (LIVE_RELOAD && file === join(ROOT, 'index.html')) {
            body = Buffer.from(body.toString('utf8').replace('</body>', `${CLIENT_SNIPPET}\n</body>`));
        }
        send(res, 200, body, MIME_TYPES[extname(file).toLowerCase()] || 'application/octet-stream');
        console.log(`${req.method} ${req.url} 200`);
    } catch {
        send(res, 404, 'Not found');
        console.log(`${req.method} ${req.url} 404`);
    }
}

function streamReloads(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-store',
        Connection: 'keep-alive'
    });
    // Keep-alive comments so Safari keeps the stream open.
    const ping = setInterval(() => res.write(': ping\n\n'), 15000);
    reloadClients.add(res);
    req.on('close', () => {
        clearInterval(ping);
        reloadClients.delete(res);
    });
}

function watchForChanges() {
    let timer = null;
    watch(ROOT, { recursive: true }, (_event, filename) => {
        if (!filename || IGNORED_DIRS.has(filename.split(/[\\/]/)[0])) {
            return;
        }
        // Let a burst of writes settle before reloading clients.
        clearTimeout(timer);
        timer = setTimeout(() => {
            console.log('[livereload] change detected, reloading clients');
            reloadClients.forEach((res) => res.write('data: reload\n\n'));
        }, 200);
    });
}

const server = createServer((req, res) => {
    if (LIVE_RELOAD && req.url.split('?')[0] === RELOAD_PATH) {
        streamReloads(req, res);
    } else {
        serveFile(req, res);
    }
});

if (LIVE_RELOAD) {
    watchForChanges();
}

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Serving ${ROOT} on http://0.0.0.0:${PORT} ${LIVE_RELOAD ? 'with' : 'without'} live reload`);
});
