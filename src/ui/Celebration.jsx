import React, { useEffect } from 'react';
import { CELEBRATIONS } from '../data/celebrations.js';

// A short, light-weight "streak" celebration: floating emoji, a bounce-in badge, and a couple of
// lines of text — all CSS keyframes, no video or image assets. Shows for a couple of seconds and
// can always be skipped by tapping, so it never blocks a child who wants to keep going.
export default function Celebration({ theme, streak, onDone }) {
  const t = CELEBRATIONS[theme % CELEBRATIONS.length];
  useEffect(() => {
    const id = setTimeout(onDone, 2400);
    return () => clearTimeout(id);
  }, [onDone]);
  const bits = Array.from({ length: 14 }, (_, i) => ({ i, l: Math.round((i * 137) % 100), d: (i % 7) * 0.18, e: t.bits[i % t.bits.length] }));
  return (
    <div className="cele-card" style={{ background: t.bg }} onClick={onDone} role="button" tabIndex={0} aria-label="Continue">
      <div className="cele-bits" aria-hidden="true">{bits.map((b) => <span key={b.i} style={{ left: b.l + '%', animationDelay: b.d + 's' }}>{b.e}</span>)}</div>
      <div className="cele-mid">
        <div className="cele-emoji">{t.emoji}</div>
        <div className="cele-streak">🔥 {streak} in a row!</div>
        <h2>{t.title}</h2>
        <p>{t.line}</p>
      </div>
      <div className="cele-tap">Tap to keep going</div>
    </div>
  );
}
