// Tiny WebAudio sound effects (no audio files needed).
let ctx = null;
const tone = (f, t, d, type = 'sine', g = 0.08) => {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(), v = ctx.createGain();
    o.type = type; o.frequency.value = f; v.gain.value = g;
    o.connect(v); v.connect(ctx.destination);
    const s = ctx.currentTime + t;
    v.gain.setValueAtTime(g, s); v.gain.exponentialRampToValueAtTime(0.0001, s + d);
    o.start(s); o.stop(s + d + 0.02);
  } catch (e) { /* audio not available */ }
};
export const sfx = {
  ok: () => { tone(660, 0, 0.12, 'triangle'); tone(880, 0.1, 0.18, 'triangle'); },
  bad: () => { tone(220, 0, 0.22, 'sawtooth', 0.05); tone(170, 0.12, 0.28, 'sawtooth', 0.05); },
  win: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.22, 'triangle')),
  tap: () => tone(500, 0, 0.05, 'sine', 0.04),
};
