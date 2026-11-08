// Reads Polish text aloud with the browser's speech synthesis (the iPad has Polish voices),
// so tasks work for a child who reads slowly. Without speech support it stays silent.
// iPad Safari speaks only after a first call from a tap; later calls work from anywhere.
//
// Safari's speech has known quirks, worked around here:
// - an utterance nobody holds on to can stop mid-sentence, so each is kept until it ends;
// - speaking right after cancel() can cut the new one off, so it waits a moment;
// - speech sounded slow and odd on the iPad while the game's own sounds (Web Audio) were
//   running, so those are paused while speaking (sfx.js skips sounds meanwhile). Speech
//   starts a moment late so a sound played with it can finish first.

// Apple's novelty voices: they speak every language, oddly (Grandma is very slow).
const NOVELTY = /eddy|flo|grandma|grandpa|babcia|dziadek|reed|rocko|sandy|shelley|albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|junior|kathy|fred|ralph/i;
// Pause after cancel() before speaking again, in ms.
const AFTER_CANCEL = 150;
// Speech starts this much later than asked (ms), so a short sound played with it (a ding,
// a sparkle) finishes before the game's sounds pause.
const SOUND_TAIL = 350;

let voice = null;
let gameAudio = null;
// Utterances said or waiting, held until they end.
let live = [];
let speaking = false;
let resumeTimer = null;
// Whether speech has started once (from a tap; the iPad needs that).
let unlocked = false;

// The most ordinary Polish voice: an improved (Enhanced, Premium) or plain Zosia on the
// iPad, Paulina on Windows, Google's in Chrome; never a novelty voice.
function rate(v) {
    const name = v.name.toLowerCase();
    let score = 0;
    if (/zosia|paulina|google/.test(name)) score += 10;
    if (/premium|enhanced|rozszerzon|ulepszon|natural/.test(name)) score += 5;
    if (v.localService) score += 1;
    return score;
}

function polishVoice() {
    if (!voice && window.speechSynthesis) {
        const polish = window.speechSynthesis.getVoices()
            .filter((v) => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith('pl') && !NOVELTY.test(v.name));
        voice = polish.sort((a, b) => rate(b) - rate(a))[0] || null;
    }
    return voice;
}

// The voice list can arrive late; look again once it does.
if (window.speechSynthesis && window.speechSynthesis.addEventListener) {
    window.speechSynthesis.addEventListener('voiceschanged', () => {
        voice = null;
    });
}

// The game's Web Audio context (main.js), paused while speaking.
export function setGameAudio(context) {
    gameAudio = context || null;
}

export const isSpeaking = () => speaking;

function resumeGameAudio() {
    clearTimeout(resumeTimer);
    speaking = false;
    if (gameAudio && gameAudio.state === 'suspended') {
        gameAudio.resume();
    }
}

function finished(utterance) {
    live = live.filter((u) => u !== utterance);
    if (!live.length) {
        resumeGameAudio();
    }
}

// Stops what is being said and says `text`; with { after: true } says it once the rest
// is said.
export function say(text, { after = false } = {}) {
    const synth = window.speechSynthesis;
    if (!synth || !text) {
        return;
    }
    let delay = 0;
    if (!after && (synth.speaking || synth.pending || live.length)) {
        live = [];
        synth.cancel();
        delay = AFTER_CANCEL;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pl-PL';
    utterance.rate = 1;
    utterance.pitch = 1;
    const v = polishVoice();
    if (v) {
        utterance.voice = v;
    }
    utterance.onend = () => finished(utterance);
    utterance.onerror = () => finished(utterance);
    live.push(utterance);

    const start = () => {
        if (!live.includes(utterance)) {
            return;
        }
        speaking = true;
        if (gameAudio && gameAudio.state === 'running') {
            gameAudio.suspend();
        }
        // If Safari never says it has finished, the game's sounds come back anyway.
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
            live = [];
            resumeGameAudio();
        }, 4000 + live.reduce((n, u) => n + u.text.length, 0) * 150);
        synth.speak(utterance);
    };
    // The very first time straight away, inside the tap; later after the sounds' tail.
    const wait = unlocked ? Math.max(delay, SOUND_TAIL) : delay;
    unlocked = true;
    if (wait) {
        setTimeout(start, wait);
    } else {
        start();
    }
}

// The voice in use, for the debug corner (Settings).
export function voiceName() {
    const v = polishVoice();
    return v ? v.name : '';
}

export function stopSpeaking() {
    live = [];
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    resumeGameAudio();
}
