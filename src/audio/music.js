// Background music player built on a plain <audio> element, so songs stream instead of
// delaying the game's start. Browsers (especially on iPad) only allow playback after a
// tap, so the chosen song starts on the first touch or click. The chosen song repeats,
// and the choice (or silence) is remembered per device.

const MUSIC_VOLUME = 0.35;
const MUSIC_STORAGE_KEY = 'swiat-siostr-music';

const Music = {
    audio: null,
    // Index into MUSIC of the chosen song, or -1 for silence.
    current: -1,
    started: false,

    init() {
        if (MUSIC.length === 0) {
            return;
        }
        this.current = this.loadChoice();

        this.audio = new Audio();
        this.audio.volume = MUSIC_VOLUME;
        this.audio.loop = true;

        const start = () => {
            if (!this.started) {
                this.started = true;
                this.play();
            }
        };
        document.addEventListener('touchend', start, { passive: true });
        document.addEventListener('click', start);
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

    play() {
        if (!this.audio || this.current < 0) {
            return;
        }
        const file = MUSIC[this.current].file;
        if (!this.audio.src.endsWith(file)) {
            this.audio.src = file;
        }
        this.audio.play().catch(() => {});
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
        this.audio.src = MUSIC[index].file;
        this.audio.currentTime = 0;
        this.play();
    }
};
