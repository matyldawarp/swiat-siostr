function getAudio(scene) {
    const ctx = scene.sound.context;
    if (!ctx) {
        return null;
    }
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
    return { ctx, output: scene.sound.masterVolumeNode || ctx.destination };
}

// Short crunch: a burst of band-passed noise, like a seed shell cracking.
function playCrunch(scene) {
    const audio = getAudio(scene);
    if (!audio) {
        return;
    }
    const { ctx, output } = audio;
    const duration = 0.06;

    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2200 + Math.random() * 1200;
    filter.Q.value = 1.2;

    const gain = ctx.createGain();
    gain.gain.value = 0.5;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    source.start();
}

// Synthesised character sounds, so the game needs no audio files.
// Each chirp is a short oscillator sweep described in the character data.
function playCharacterSound(scene, sound) {
    const audio = getAudio(scene);
    if (!audio) {
        return;
    }
    const { ctx, output } = audio;
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
