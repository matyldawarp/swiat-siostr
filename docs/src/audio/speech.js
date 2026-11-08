// Polish read aloud in the school, from recordings: docs/assets/speech/<file>.m4a, one per
// text, made by `node tools/make-speech.mjs` (Piper, voice "gosia"). The iPad's own speech
// synthesis spoke slowly and broke off mid-sentence, so the game doesn't use it.
// A text without a recording stays silent; `npm run check` lists the missing ones.

export const SPEECH_DIR = 'assets/speech';

// Polish letters to plain ones, for file names.
const PLAIN = { ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' };

// The recording's file name (without .m4a): the first words, then a checksum of the whole
// text (FNV-1a), so any change to the text needs a new recording.
export function speechFile(text) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
        hash ^= text.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    const words = text.toLowerCase().replace(/[ąćęłńóśźż]/g, (ch) => PLAIN[ch])
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 32).replace(/-$/, '');
    return `${words}-${hash.toString(16).padStart(8, '0')}`;
}

const key = (text) => `speech-${speechFile(text)}`;

// Loads the recordings of `texts` in a scene's preload().
export function loadSpeech(scene, texts) {
    texts.forEach((text) => {
        if (!scene.cache.audio.exists(key(text))) {
            scene.load.audio(key(text), `${SPEECH_DIR}/${speechFile(text)}.m4a`);
        }
    });
}

let current = null;
let queue = [];

function playNext(scene) {
    current = null;
    const text = queue.shift();
    if (!text) {
        return;
    }
    if (!scene.cache.audio.exists(key(text))) {
        playNext(scene);
        return;
    }
    const sound = scene.sound.add(key(text));
    current = sound;
    sound.once('complete', () => {
        sound.destroy();
        if (current === sound) {
            playNext(scene);
        }
    });
    sound.play();
}

// Stops what is being said and says `text`; with { after: true } says it once the rest
// is said.
export function say(scene, text, { after = false } = {}) {
    if (!text) {
        return;
    }
    if (!after) {
        stopSpeaking();
    }
    queue.push(text);
    if (!current) {
        playNext(scene);
    }
}

export function stopSpeaking() {
    queue = [];
    if (current) {
        const sound = current;
        current = null;
        sound.stop();
        sound.destroy();
    }
}
