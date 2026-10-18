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
export function playCrunch(scene) {
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

// Plays a sequence of soft tones: [{ freq, duration }], each starting after the previous one.
export function playNotes(scene, notes, wave = 'triangle', volume = 0.15) {
    const audio = getAudio(scene);
    if (!audio) {
        return;
    }
    const { ctx, output } = audio;
    let t = ctx.currentTime + 0.01;

    notes.forEach(({ freq, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(volume, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
        osc.connect(gain);
        gain.connect(output);
        osc.start(t);
        osc.stop(t + duration + 0.02);
        t += duration * 0.8;
    });
}

// Soft lullaby while resting in the hospital bed.
export function playLullaby(scene) {
    playNotes(scene, [
        { freq: 392, duration: 0.5 },
        { freq: 330, duration: 0.5 },
        { freq: 392, duration: 0.5 },
        { freq: 330, duration: 0.5 },
        { freq: 349, duration: 0.5 },
        { freq: 294, duration: 0.5 },
        { freq: 262, duration: 0.9 }
    ], 'sine', 0.08);
}

// "Ding-dong" when a visitor arrives.
export function playDoorbell(scene) {
    playNotes(scene, [{ freq: 784, duration: 0.35 }, { freq: 622, duration: 0.6 }], 'sine', 0.12);
}

// Soft "plop" when an ingredient lands in the bowl.
export function playPlop(scene) {
    const audio = getAudio(scene);
    if (!audio) {
        return;
    }
    const { ctx, output } = audio;
    const t = ctx.currentTime + 0.005;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.12);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    osc.connect(gain);
    gain.connect(output);
    osc.start(t);
    osc.stop(t + 0.16);
}

// Swish of the whisk in the batter.
export function playWhisk(scene) {
    const audio = getAudio(scene);
    if (!audio) {
        return;
    }
    const { ctx, output } = audio;
    const duration = 0.12;
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((Math.PI * i) / data.length);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.value = 0.25;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    source.start();
}

// Little sparkle for a cake decoration.
export function playSparkle(scene) {
    playNotes(scene, [
        { freq: 1568, duration: 0.08 },
        { freq: 2093, duration: 0.08 },
        { freq: 2637, duration: 0.16 }
    ], 'sine', 0.08);
}

// Thermometer "done" chime.
export function playDing(scene) {
    playNotes(scene, [{ freq: 1319, duration: 0.18 }, { freq: 1760, duration: 0.35 }], 'sine', 0.12);
}

// Happy rising arpeggio for the sticker.
export function playFanfare(scene) {
    playNotes(scene, [
        { freq: 523, duration: 0.14 },
        { freq: 659, duration: 0.14 },
        { freq: 784, duration: 0.14 },
        { freq: 1047, duration: 0.4 }
    ]);
}

// Soft pat when the plaster sticks.
export function playPat(scene) {
    playNotes(scene, [{ freq: 330, duration: 0.08 }, { freq: 440, duration: 0.12 }], 'sine', 0.12);
}

// Short tick for a step on the map.
export function playStep(scene) {
    playNotes(scene, [{ freq: 900 + Math.random() * 200, duration: 0.03 }], 'square', 0.03);
}

// "A-psik!": a short rising "a" followed by a hissy burst.
export function playSneeze(scene) {
    const audio = getAudio(scene);
    if (!audio) {
        return;
    }
    const { ctx, output } = audio;
    const t = ctx.currentTime + 0.01;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(500, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.18);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.1, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    osc.connect(gain);
    gain.connect(output);
    osc.start(t);
    osc.stop(t + 0.22);

    const duration = 0.15;
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3000;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.25;
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(output);
    noise.start(t + 0.22);
}

// Little rising "blup" of a bath bubble.
export function playBubble(scene) {
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
export function playSnore(scene) {
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
export function playWheelTick(scene) {
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
export function playCharacterSound(scene, sound) {
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
