import * as Tone from 'tone';
import confetti from 'canvas-confetti';

let toneCorrect = null;
let toneIncorrect = null;
let tonePop = null;
let audioInitialized = false;

export async function initAudioSystem() {
  if (audioInitialized) return;
  try {
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
  try {
    if (tonePop && Tone.context.state === 'running') {
      tonePop.triggerAttackRelease("C6", "32n");
    }
  } catch (e) { /* ignore */ }
}

export function playCorrect() {
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
  try {
    if (toneIncorrect && Tone.context.state === 'running') {
      toneIncorrect.triggerAttackRelease("G#3", "8n");
    }
  } catch (e) { /* ignore */ }
}

export function fireConfetti(isBig = false) {
  if (isBig) {
    const end = Date.now() + 2500;
    const colors = ['#f44383', '#14b8a6', '#059669', '#fbbf24', '#a855f7'];
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
      colors: ['#f44383', '#14b8a6', '#059669', '#fbbf24']
    });
  }
}

export const PRAISES = [
  "Superstar! That is correct!",
  "Brilliant thinking!",
  "Awesome job!",
  "Spot on! You got it!",
  "Look at you go, math and science wizard!",
  "You are crushing it!",
  "High five! Fantastic answer!"
];

export function speakText(text, rate = 0.95, pitch = 1.15) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    // Prefer higher quality friendly voices if available
    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Victoria')));
    if (friendlyVoice) utterance.voice = friendlyVoice;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("Speech synthesis error:", err);
  }
}

export function createSpeechRecognizer(onResult, onEnd, onError) {
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
