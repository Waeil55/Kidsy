import * as Tone from 'tone';
import confetti from 'canvas-confetti';

let toneCorrect = null;
let toneIncorrect = null;
let tonePop = null;
let audioInitialized = false;
let isMutedAudio = false;
let globalAudioCtx = null;

function fetchAudioContext() {
  if (!globalAudioCtx && typeof window !== 'undefined') {
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (AudioClass) {
      globalAudioCtx = new AudioClass();
    }
  }
  if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume().catch(() => {});
  }
  return globalAudioCtx;
}

export function isAudioMuted() {
  return isMutedAudio;
}

export function toggleAudioSFX() {
  isMutedAudio = !isMutedAudio;
  if (!isMutedAudio) {
    triggerAudioTone('tap');
  }
  return !isMutedAudio;
}

export function triggerAudioTone(kind) {
  if (isMutedAudio) return;
  try {
    const ctx = fetchAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (kind === 'tap') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (kind === 'penalty') {
      // Buzz -1 penalty sound
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.setValueAtTime(110, now + 0.1);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (kind === 'success') {
      // Success arpeggio
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const sOsc = ctx.createOscillator();
        const sGain = ctx.createGain();
        sOsc.type = 'sine';
        sOsc.frequency.value = freq;
        sOsc.connect(sGain);
        sGain.connect(ctx.destination);
        const start = now + idx * 0.07;
        sGain.gain.setValueAtTime(0.18, start);
        sGain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
        sOsc.start(start);
        sOsc.stop(start + 0.3);
      });
    }
  } catch (err) {
    console.warn('Audio tone error:', err);
  }
}

export async function initAudioSystem() {
  if (audioInitialized) return;
  try {
    fetchAudioContext();
    await Tone.start();
    
    toneCorrect = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.02, decay: 0.15, sustain: 0.1, release: 0.4 }
    }).toDestination();
    toneCorrect.volume.value = -10;

    toneIncorrect = new Tone.Synth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.05, decay: 0.25, sustain: 0, release: 0.2 }
    }).toDestination();
    toneIncorrect.volume.value = -12;

    tonePop = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.005, decay: 0.08, sustain: 0, release: 0.08 }
    }).toDestination();
    tonePop.volume.value = -16;

    audioInitialized = true;
  } catch (err) {
    console.warn("Audio Context init deferred:", err);
  }
}

export function playPop() {
  if (isMutedAudio) return;
  triggerAudioTone('tap');
  try {
    if (tonePop && Tone.context.state === 'running') {
      tonePop.triggerAttackRelease("C6", "32n");
    }
  } catch (e) { /* ignore */ }
}

export function playCorrect() {
  if (isMutedAudio) return;
  triggerAudioTone('success');
  try {
    if (toneCorrect && Tone.context.state === 'running') {
      const now = Tone.now();
      toneCorrect.triggerAttackRelease("C5", "8n", now);
      toneCorrect.triggerAttackRelease("E5", "8n", now + 0.09);
      toneCorrect.triggerAttackRelease("G5", "8n", now + 0.18);
      toneCorrect.triggerAttackRelease("C6", "4n", now + 0.28);
    }
  } catch (e) { /* ignore */ }
}

export function playIncorrect() {
  if (isMutedAudio) return;
  triggerAudioTone('penalty');
  try {
    if (toneIncorrect && Tone.context.state === 'running') {
      toneIncorrect.triggerAttackRelease("G#3", "8n");
    }
  } catch (e) { /* ignore */ }
}

export function fireConfetti(isBig = false) {
  if (isBig) {
    const end = Date.now() + 2500;
    const colors = ['#f44383', '#14b8a6', '#059669', '#fbbf24', '#a855f7', '#4F46E5'];
    (function frame() {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } else {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f44383', '#14b8a6', '#059669', '#fbbf24', '#4F46E5']
    });
  }
}

export const PRAISES = [
  "Superstar! That is correct!",
  "Brilliant thinking!",
  "Awesome job!",
  "Spot on! You got it!",
  "Look at you go, learning champion!",
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
