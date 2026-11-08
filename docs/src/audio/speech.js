// Reads Polish text aloud with the browser's speech synthesis (the iPad has Polish voices),
// so tasks work for a child who reads slowly. Without speech support it stays silent.
// iPad Safari speaks only after a first call from a tap; later calls work from anywhere.

let voice = null;

function polishVoice() {
    if (!voice && window.speechSynthesis) {
        voice = window.speechSynthesis.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith('pl')) || null;
    }
    return voice;
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
    utterance.rate = 0.9;
    const v = polishVoice();
    if (v) {
        utterance.voice = v;
    }
    synth.speak(utterance);
}

export function stopSpeaking() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}
