// Background music player built on a plain <audio> element.
//
// Song files are MP3s with a .bin extension, so an ordinary HTTP server sends them with a
// generic content type and Safari would refuse to play them. The game
// therefore downloads each song itself and plays it from an in-memory Blob labelled
// audio/mpeg, which works on any static server.
//
// Browsers (especially on iPad) only allow playback to start during a tap. The first tap
// "unlocks" the audio element with a moment of silence; after that the element may start
// songs whenever their download finishes. The chosen song is fetched as soon as the game
// loads, repeats, and the choice (or silence) is remembered per device.

const MUSIC_VOLUME = 0.35;
const MUSIC_STORAGE_KEY = 'swiat-siostr-music';

// A tenth of a second of 8-bit silence as a WAV file, used to unlock the audio element.
function silentWavUrl() {
    const samples = 800;
    const buffer = new ArrayBuffer(44 + samples);
    const view = new DataView(buffer);
    const text = (offset, s) => [...s].forEach((ch, i) => view.setUint8(offset + i, ch.charCodeAt(0)));
    text(0, 'RIFF');
    view.setUint32(4, 36 + samples, true);
    text(8, 'WAVE');
    text(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, 8000, true); // sample rate
    view.setUint32(28, 8000, true); // byte rate
    view.setUint16(32, 1, true); // block align
    view.setUint16(34, 8, true); // bits per sample
    text(36, 'data');
    view.setUint32(40, samples, true);
    new Uint8Array(buffer, 44).fill(128);
    return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
}

const Music = {
    audio: null,
    // Index into MUSIC of the chosen song, or -1 for silence.
    current: -1,
    started: false,
    unlocked: false,
    // Song index -> object URL of the downloaded song, or a pending download.
    urls: {},
    downloads: {},
    available: [0, 1, 2],
    checked: false,
    checkedCallbacks: [],

    init() {
        if (MUSIC.length === 0) {
            this.markChecked();
            return;
        }
        this.current = this.loadChoice();

        this.audio = new Audio();
        this.audio.volume = MUSIC_VOLUME;
        this.audio.loop = true;

        this.checkAvailable();

        const start = () => {
            if (!this.started) {
                this.started = true;
                this.play();
            }
        };
        document.addEventListener('touchend', start, { passive: true });
        document.addEventListener('click', start);
    },

    // Asks the server which song files exist (HEAD, nothing is downloaded), then starts
    // fetching the chosen song if it is one of them.
    checkAvailable() {
        const checks = MUSIC.map((song, i) => fetch(song.file, { method: 'HEAD' })
            .then((res) => (res.ok ? i : null))
            .catch(() => null));

        Promise.all(checks).then((results) => {
            this.available = results.filter((i) => i !== null);
            if (this.current >= 0 && !this.available.includes(this.current)) {
                this.current = this.available.length > 0 ? this.available[0] : -1;
            }
            if (this.current >= 0) {
                this.download(this.current);
            }
            this.markChecked();
        });
    },

    markChecked() {
        this.checked = true;
        this.checkedCallbacks.forEach((cb) => cb());
        this.checkedCallbacks = [];
    },

    // Runs `cb` once it is known which songs are available.
    whenChecked(cb) {
        if (this.checked) {
            cb();
        } else {
            this.checkedCallbacks.push(cb);
        }
    },

    loadChoice() {
        let saved = null;
        try {
            saved = localStorage.getItem(MUSIC_STORAGE_KEY);
        } catch {
            // Storage blocked: fall back to the first song.
        }
        if (saved === 'off') {
            return -1;
        }
        const index = MUSIC.findIndex((m) => m.file === saved);
        return index >= 0 ? index : 0;
    },

    saveChoice() {
        try {
            localStorage.setItem(MUSIC_STORAGE_KEY, this.current < 0 ? 'off' : MUSIC[this.current].file);
        } catch {
            // Storage blocked: the choice just isn't remembered.
        }
    },

    get enabled() {
        return this.current >= 0;
    },

    // Downloads a song once and keeps it as an audio/mpeg Blob. Resolves to its URL, or
    // null when the file is missing (e.g. a fresh clone without the private music).
    download(index) {
        if (this.urls[index]) {
            return Promise.resolve(this.urls[index]);
        }
        if (!this.downloads[index]) {
            this.downloads[index] = fetch(MUSIC[index].file)
                .then((res) => (res.ok ? res.arrayBuffer() : Promise.reject(new Error(res.status))))
                .then((data) => {
                    this.urls[index] = URL.createObjectURL(new Blob([data], { type: 'audio/mpeg' }));
                    return this.urls[index];
                })
                .catch(() => {
                    delete this.downloads[index];
                    return null;
                });
        }
        return this.downloads[index];
    },

    // Must first run during a tap: plays a moment of silence so the element is allowed to
    // start the real song later, once it has downloaded.
    unlock() {
        if (this.unlocked) {
            return;
        }
        this.unlocked = true;
        this.audio.src = silentWavUrl();
        this.audio.play().catch(() => {});
    },

    play() {
        if (!this.audio || this.current < 0) {
            return;
        }
        const index = this.current;
        const url = this.urls[index];
        if (url) {
            // Already downloaded: start right away, still inside the tap.
            this.unlocked = true;
            if (this.audio.src !== url) {
                this.audio.src = url;
            }
            this.audio.play().catch(() => {});
            return;
        }

        this.unlock();
        this.download(index).then((downloaded) => {
            // Skip if the choice changed while downloading, or the file is missing.
            if (downloaded && this.current === index) {
                this.audio.src = downloaded;
                this.audio.play().catch(() => {});
            }
        });
    },

    // Called from a tap, so playback is allowed to start here. -1 means silence.
    select(index) {
        this.current = index;
        this.started = true;
        this.saveChoice();
        if (!this.audio) {
            return;
        }
        if (index < 0) {
            this.audio.pause();
            return;
        }
        if (this.urls[index]) {
            this.audio.src = this.urls[index];
        }
        this.audio.currentTime = 0;
        this.play();
    }
};
