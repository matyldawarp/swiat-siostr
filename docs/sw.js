// Small service worker: lets browsers offer "Install app" and keeps the game fresh. It
// stores nothing itself. GitHub Pages tells browsers to keep each file for 10 minutes,
// so right after a new version is pushed a device could run old and new files mixed.
// Here every file of the game is checked with the server on each load instead (a quick
// "not modified" answer when nothing changed). Other sites (Phaser, fonts) are untouched.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
        return;
    }
    // A page load can't be copied with new options, so it is fetched again by its address.
    const fresh = request.mode === 'navigate'
        ? new Request(request.url, { cache: 'no-cache', credentials: 'same-origin' })
        : new Request(request, { cache: 'no-cache' });
    event.respondWith(fetch(fresh));
});
