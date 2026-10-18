// Minimal service worker so browsers offer "Install app". It caches nothing on purpose:
// the game is changed often during development and must always load the newest files.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

// Only page loads go through here, straight to the network; everything else is untouched.
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(fetch(event.request));
    }
});
