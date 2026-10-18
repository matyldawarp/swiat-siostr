// Background music player built on a plain <audio> element, so tracks stream instead of
// delaying the game's start. Browsers (especially on iPad) only allow playback after a
// tap, so it starts on the first touch or click. On/off is remembered per device.

const MUSIC_VOLUME = 0.35;
const MUSIC_STORAGE_KEY = 'swiat-siostr-music';

const Music = {
    audio: null,
    index: 0,
    started: false,
    enabled: true,
    failures: 0,

    init() {
        try {
            this.enabled = localStorage.getItem(MUSIC_STORAGE_KEY) !== 'off';
        } catch {
            this.enabled = true;
        }
        if (MUSIC.length === 0) {
            return;
        }

        this.audio = new Audio();
        this.audio.volume = MUSIC_VOLUME;
        this.audio.addEventListener('ended', () => this.next());
        // Missing or broken file: move on, but give up after trying every track once.
        this.audio.addEventListener('error', () => {
            if (++this.failures < MUSIC.length) {
                this.next();
            }
        });

        const start = () => {
            if (!this.started && this.enabled) {
                this.started = true;
                this.play();
            }
        };
        document.addEventListener('touchend', start, { passive: true });
        document.addEventListener('click', start);
    },

    play() {
        if (!this.audio) {
            return;
        }
        if (!this.audio.src) {
            this.audio.src = MUSIC[this.index].file;
        }
        this.audio.play().catch(() => {});
    },

    next() {
        this.index = (this.index + 1) % MUSIC.length;
        this.audio.src = MUSIC[this.index].file;
        if (this.enabled) {
            this.audio.play().catch(() => {});
        }
    },

    // Called from a tap, so playback is allowed to start here.
    toggle() {
        this.enabled = !this.enabled;
        try {
            localStorage.setItem(MUSIC_STORAGE_KEY, this.enabled ? 'on' : 'off');
        } catch {
            // Storage blocked: the setting just isn't remembered.
        }
        if (this.enabled) {
            this.started = true;
            this.play();
        } else if (this.audio) {
            this.audio.pause();
        }
        return this.enabled;
    }
};
