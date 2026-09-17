import confetti from 'canvas-confetti';

let audioCtx = null;
let isMuted = false;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (AudioClass) {
      audioCtx = new AudioClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isAudioMuted() {
  return isMuted;
}

export function toggleAudioSFX() {
  isMuted = !isMuted;
  if (!isMuted) playPop();
  return !isMuted;
}

// Instant zero-latency tap click
export function playPop() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  } catch (e) { /* ignore */ }
}

// Duolingo-style signature joyful ascending fanfare
export function playCorrect() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      const startTime = now + idx * 0.07;
      const duration = 0.22;

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (e) { /* ignore */ }
}

// Gentle low error thump
export function playIncorrect() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    [190, 140].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + idx * 0.09 + 0.12);

      const startTime = now + idx * 0.09;
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.12);
    });
  } catch (e) { /* ignore */ }
}

export async function initAudioSystem() {
  getAudioContext();
}

export function triggerAudioTone(kind) {
  if (kind === 'tap') playPop();
  else if (kind === 'penalty') playIncorrect();
  else if (kind === 'success') playCorrect();
}

export function fireConfetti(isBig = false) {
  if (isBig) {
    const end = Date.now() + 2000;
    const colors = ['#58CC02', '#1CB0F6', '#FF9600', '#CE82FF', '#FF4B4B'];
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  } else {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#58CC02', '#1CB0F6', '#FF9600', '#CE82FF']
    });
  }
}

export const PRAISES = [
  "Superstar! That is correct!",
  "Brilliant thinking!",
  "Awesome job!",
  "Spot on! You got it!",
  "Look at you go, champion!",
  "You are crushing it!",
  "High five! Fantastic answer!"
];

export function speakText(text, rate = 0.95, pitch = 1.15) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Victoria')));
    if (friendlyVoice) utterance.voice = friendlyVoice;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("Speech synthesis error:", err);
  }
}

export function createSpeechRecognizer(onResult, onEnd, onError) {
  if (typeof window === 'undefined') return null;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    if (event.results && event.results[0]) {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    }
  };

  if (onEnd) recognition.onend = onEnd;
  if (onError) recognition.onerror = onError;

  return recognition;
}
