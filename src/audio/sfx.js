// Synthesised character sounds, so the game needs no audio files.
// Each chirp is a short oscillator sweep described in the character data.
function playCharacterSound(scene, sound) {
    const ctx = scene.sound.context;
    if (!ctx) {
        return;
    }
    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    const output = scene.sound.masterVolumeNode || ctx.destination;
    let t = ctx.currentTime + 0.01;

    sound.chirps.forEach(({ from, to, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = sound.wave;
        osc.frequency.setValueAtTime(from, t);
        osc.frequency.exponentialRampToValueAtTime(to, t + duration);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.25, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

        osc.connect(gain);
        gain.connect(output);
        osc.start(t);
        osc.stop(t + duration + 0.02);

        t += duration + sound.gap;
    });
}
