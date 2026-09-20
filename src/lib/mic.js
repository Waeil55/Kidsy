/* Kid microphone — kids speak answers out loud.
   Uses Web Speech recognition when available, degrades gracefully. */

export function micSupported() {
  return typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function listenOnce({ lang = 'en-US', timeout = 8000, onResult, onError, onEnd } = {}) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    onError && onError(new Error('unsupported'));
    return () => {};
  }
  let stopped = false;
  let rec;
  try {
    rec = new SR();
  } catch (e) {
    onError && onError(e);
    return () => {};
  }
  rec.lang = lang;
  rec.interimResults = false;
  rec.maxAlternatives = 3;
  const timer = setTimeout(() => {
    try {
      rec.stop();
    } catch (e) { /* ignore */ }
  }, timeout);
  rec.onresult = (ev) => {
    const alts = [];
    try {
      const res = ev.results[0];
      for (let i = 0; i < res.length; i++) alts.push(res[i].transcript);
    } catch (e) { /* ignore */ }
    clearTimeout(timer);
    onResult && onResult(alts[0] || '', alts);
  };
  rec.onerror = (ev) => {
    clearTimeout(timer);
    onError && onError(new Error((ev && ev.error) || 'mic-error'));
  };
  rec.onend = () => {
    clearTimeout(timer);
    if (!stopped) onEnd && onEnd();
  };
  try {
    rec.start();
  } catch (e) {
    clearTimeout(timer);
    onError && onError(e);
  }
  return () => {
    stopped = true;
    clearTimeout(timer);
    try {
      rec.stop();
    } catch (e) { /* ignore */ }
  };
}

function norm(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

const NUMBER_WORDS = {
  zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6',
  seven: '7', eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12',
  thirteen: '13', fourteen: '14', fifteen: '15', sixteen: '16', seventeen: '17',
  eighteen: '18', nineteen: '19', twenty: '20', thirty: '30', forty: '40', fifty: '50',
};

/* Does the spoken transcript match the expected answer option? */
export function transcriptMatches(transcript, expected) {
  const t = norm(transcript);
  const e = norm(expected);
  if (!t || !e) return false;
  if (t === e || t.includes(e) || e.includes(t)) return true;
  // number words <-> digits
  const tDigits = t.split(' ').map((w) => NUMBER_WORDS[w] || w).join(' ');
  const eDigits = e.split(' ').map((w) => NUMBER_WORDS[w] || w).join(' ');
  if (tDigits === eDigits || tDigits.includes(eDigits) || eDigits.includes(tDigits)) return true;
  // word overlap: at least 2 meaningful shared words or all short expected words
  const stop = new Set(['the', 'a', 'an', 'is', 'are', 'to', 'of', 'and', 'in', 'it', 'that', 'this']);
  const tw = new Set(t.split(' ').filter((w) => w && !stop.has(w)));
  const ew = e.split(' ').filter((w) => w && !stop.has(w));
  if (ew.length === 0) return false;
  const hit = ew.filter((w) => tw.has(w)).length;
  return hit >= Math.min(ew.length, 2) && hit > 0;
}
