// Reads Polish text aloud with the browser's speech synthesis (the iPad has Polish voices),
// so tasks work for a child who reads slowly. Without speech support it stays silent.
// iPad Safari speaks only after a first call from a tap; later calls work from anywhere.

// Apple's novelty voices: they speak every language, oddly (Grandma is very slow).
const NOVELTY = /eddy|flo|grandma|grandpa|babcia|dziadek|reed|rocko|sandy|shelley|albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|junior|kathy|fred|ralph/i;

let voice = null;

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

// Stops what is being said and says `text`; with { after: true } says it once the rest
// is said.
export function say(text, { after = false } = {}) {
    const synth = window.speechSynthesis;
    if (!synth || !text) {
        return;
    }
    if (!after) {
        synth.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pl-PL';
    const v = polishVoice();
    if (v) {
        utterance.voice = v;
    }
    synth.speak(utterance);
}

// The voice in use, for the debug corner (Settings).
export function voiceName() {
    const v = polishVoice();
    return v ? v.name : '';
}

export function stopSpeaking() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}
