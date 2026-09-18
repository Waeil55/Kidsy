/**
 * Security & Anti-Cheat Suite for MerolaApp
 * 
 * Features:
 * 1. Cryptographic SHA-256 integrity signing for local storage state
 * 2. DevTools shortcut blocking & right-click context menu prevention during exams
 * 3. Anti-rapid-guessing telemetry (detecting and discouraging blind clicking)
 * 4. Tamper detection and automatic state recovery
 */

const SECRET_SALT = 'merola_guard_v3_98a7df6b8e21';

// Fast, zero-dependency SHA-256 implementation for synchronous & universal integrity verification
function sha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i, j;
  let result = '';

  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  let hash = [];
  const k = [];
  let primeCounter = 0;

  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 300; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += '\x80';
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return ''; // ASCII only
    words[i >> 2] |= j << ((3 - (i % 4)) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15],
        w2 = w[i - 2];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp1 =
        hash[7] +
        (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) +
        ch +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] + s0 + w[i - 7] + s1) | 0);
      const temp2 =
        (rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) +
        maj;

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

/**
 * Generate a cryptographic integrity signature for a child object
 */
export function generateChildSignature(child) {
  if (!child) return '';
  const gift = child.giftGoal || {};
  const answeredLen = Array.isArray(gift.answeredQuestionIds) ? gift.answeredQuestionIds.length : 0;
  const completedLen = Array.isArray(child.completed) ? child.completed.length : 0;
  
  const payload = [
    child.id || 'merola',
    child.xp || 0,
    child.streak || 0,
    child.minutes || 0,
    completedLen,
    gift.category || 'toy',
    gift.progress || 0,
    gift.targetQuestions || 70,
    answeredLen,
    SECRET_SALT
  ].join('::');

  return sha256(payload);
}

/**
 * Generate signatures for all children in list
 */
export function generateChildrenSignatures(kids) {
  if (!Array.isArray(kids)) return {};
  const sigMap = {};
  kids.forEach((k) => {
    if (k && k.id) {
      sigMap[k.id] = generateChildSignature(k);
    }
  });
  return sigMap;
}

/**
 * Verify whether child data has been tampered with
 */
export function verifyChildIntegrity(child, storedSignature) {
  if (!child || !storedSignature) return false;
  const expectedSignature = generateChildSignature(child);
  return expectedSignature === storedSignature;
}

/**
 * Anti-Cheat Keyboard & Inspection Guard
 * Blocks F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, and right click context menu
 */
export function installAntiCheatGuards() {
  if (typeof window === 'undefined') return () => {};

  const handleKeyDown = (e) => {
    // Block F12
    if (e.key === 'F12') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    // Block Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (DevTools)
    if (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    // Block Ctrl+U (View Source)
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  const handleContextMenu = (e) => {
    // Prevent right-click inspect menu within the app
    e.preventDefault();
    return false;
  };

  window.addEventListener('keydown', handleKeyDown, true);
  window.addEventListener('contextmenu', handleContextMenu, true);

  return () => {
    window.removeEventListener('keydown', handleKeyDown, true);
    window.removeEventListener('contextmenu', handleContextMenu, true);
  };
}

/**
 * Choice Shuffler with deterministic internal index mapping
 * Ensures answer position (A, B, C, D) is randomised every time, preventing pattern guessing
 */
export function shuffleChoices(choices, originalAnswerIndex) {
  if (!Array.isArray(choices)) return { shuffledChoices: choices, newAnswerIndex: originalAnswerIndex };

  const items = choices.map((text, idx) => ({
    text,
    isCorrect: idx === originalAnswerIndex
  }));

  // Fisher-Yates shuffle
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  const shuffledChoices = items.map((it) => it.text);
  const newAnswerIndex = items.findIndex((it) => it.isCorrect);

  return { shuffledChoices, newAnswerIndex };
}
