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

// Little rising "blup" of a bath bubble.
function playBubble(scene) {
    const audio = getAudio(scene);
    if (!audio) {
        return;
    }
    const { ctx, output } = audio;
    const t = ctx.currentTime + 0.005;
    const from = 300 + Math.random() * 300;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(from * 3, t + 0.07);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.08, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

    osc.connect(gain);
    gain.connect(output);
    osc.start(t);
    osc.stop(t + 0.09);
}

// Soft, low breath for each floating "z" while sleeping.
function playSnore(scene) {
    const audio = getAudio(scene);
    if (!audio) {
        return;
    }
    const { ctx, output } = audio;
    const t = ctx.currentTime + 0.01;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.5);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.06, t + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

    osc.connect(gain);
    gain.connect(output);
    osc.start(t);
    osc.stop(t + 0.55);
}

// Quiet click of the spinning wheel.
function playWheelTick(scene) {
    const audio = getAudio(scene);
    if (!audio) {
        return;
    }
    const { ctx, output } = audio;
    const t = ctx.currentTime + 0.005;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1800, t);
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

    osc.connect(gain);
    gain.connect(output);
    osc.start(t);
    osc.stop(t + 0.03);
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
