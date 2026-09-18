import confetti from 'canvas-confetti';

let isMuted = false;
const audioCache = new Map();
let currentAudio = null;

export function isAudioMuted() {
  return isMuted;
}

export function toggleAudioSFX() {
  isMuted = !isMuted;
  if (!isMuted) {
    aiSpeak("Sound is on!");
  }
  return !isMuted;
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

export const CORRECTIONS = [
  "Try again, you can do it!",
  "Keep trying, you are almost there!",
  "Good try! Let's check this one together.",
  "Don't worry, try one more time!"
];

/**
 * Lifetime Free Human AI Voice Engine
 * 1. Puter.js (Free Keyless AI TTS: OpenAI Alloy / Nova / Polly)
 * 2. Device Natural Neural SpeechSynthesis fallback
 */
export async function aiSpeak(text, options = {}) {
  if (isMuted || !text || typeof window === 'undefined') return;

  const cleanText = String(text).trim();
  if (!cleanText) return;

  // Stop any currently playing audio stream
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch (e) { /* ignore */ }

  // Check in-memory audio cache
  const cacheKey = cleanText.toLowerCase();
  if (audioCache.has(cacheKey)) {
    try {
      const cached = audioCache.get(cacheKey);
      currentAudio = cached.cloneNode();
      await currentAudio.play();
      return;
    } catch (e) {
      // Audio play blocked or error, fallback to speech synthesis
    }
  }

  // 1. Try Puter.js free AI Text-to-Speech API
  if (window.puter && window.puter.ai && typeof window.puter.ai.txt2speech === 'function') {
    try {
      const audio = await window.puter.ai.txt2speech(cleanText, {
        provider: 'openai',
        model: 'gpt-4o-mini-tts',
        voice: options.voice || 'alloy'
      });

      if (audio && typeof audio.play === 'function') {
        currentAudio = audio;
        audioCache.set(cacheKey, audio);
        await audio.play();
        return;
      }
    } catch (puterErr) {
      console.warn('[Puter AI TTS Fallback]', puterErr?.message || puterErr);
    }
  }

  // 2. High-Fidelity Natural Neural Voice Fallback via Web Speech API
  if ('speechSynthesis' in window) {
    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = options.rate || 0.95;
      utterance.pitch = options.pitch || 1.05;

      const voices = window.speechSynthesis.getVoices();
      // Prioritize natural, friendly human voices
      const humanVoice = voices.find(v => 
        v.lang.startsWith('en') && (
          v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Jenny') ||
          v.name.includes('Guy') ||
          v.name.includes('Aria')
        )
      ) || voices.find(v => v.lang.startsWith('en'));

      if (humanVoice) {
        utterance.voice = humanVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[SpeechSynthesis Error]', err);
    }
  }
}

// Global alias for compatibility with existing components
export function speakText(text, rate = 0.95, pitch = 1.05) {
  return aiSpeak(text, { rate, pitch });
}

// Spoken Human AI Voice Encouragement (Zero synth beeps!)
export function playCorrect() {
  if (isMuted) return;
  const praise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
  aiSpeak(praise);
}

// Gentle Spoken Human AI Voice Guidance (Zero synth error thumps!)
export function playIncorrect() {
  if (isMuted) return;
  const guidance = CORRECTIONS[Math.floor(Math.random() * CORRECTIONS.length)];
  aiSpeak(guidance);
}

// Clean tactile tap (Zero synth beeps!)
export function playPop() {
  if (isMuted) return;
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(8);
    }
  } catch (e) { /* ignore */ }
}

export async function initAudioSystem() {
  // Pre-load voices if speech synthesis is available
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
  }
}

export function triggerAudioTone(kind) {
  if (kind === 'tap') playPop();
  else if (kind === 'penalty') playIncorrect();
  else if (kind === 'success') playCorrect();
}

export function fireConfetti(isBig = false) {
  if (typeof window === 'undefined') return;
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
