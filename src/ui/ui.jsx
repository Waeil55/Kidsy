import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LuStar, LuVolume2, LuSquare, LuMic, LuMicOff, LuX, LuArrowLeft } from 'react-icons/lu';
import { speak, stopSpeaking, listen, micSupported, ttsSupported } from '../lib/speech.js';
import { useStore } from '../store/store.js';
import { Link } from './router.js';

export const Stars = ({ n = 0, max = 3, className = '' }) => (
  <span className={`stars ${className}`} aria-label={`${n} of ${max} stars`}>
    {Array.from({ length: max }, (_, i) => <LuStar key={i} className={i < n ? 'on' : ''} />)}
  </span>
);
export const Ring = ({ pct = 0, size = 84, children }) => (
  <div className="ring" style={{ '--p': pct, '--s': size + 'px' }}><b>{children ?? pct + '%'}</b></div>
);
export const Bar = ({ pct = 0 }) => <div className="bar"><i style={{ width: Math.min(100, pct) + '%' }} /></div>;
export const Seg = ({ value, onChange, options }) => (
  <div className="seg" role="tablist">
    {options.map((o) => <button key={o.key ?? o} role="tab" aria-selected={value === (o.key ?? o)} className={value === (o.key ?? o) ? 'on' : ''} onClick={() => onChange(o.key ?? o)}>{o.label ?? o}</button>)}
  </div>
);
export const Crumb = ({ to, children }) => <Link to={to} className="crumb"><LuArrowLeft size={18} /> {children}</Link>;
export const Empty = ({ e = '🫧', title, children }) => <div className="empty"><div className="e">{e}</div><h3>{title}</h3><div>{children}</div></div>;
export const Notice = ({ kind = 'info', children }) => <div className={`notice ${kind}`}><span>{kind === 'warn' ? '⚠️' : kind === 'err' ? '⛔' : 'ℹ️'}</span><div>{children}</div></div>;

export function Modal({ title, children, onClose, actions }) {
  useEffect(() => { const f = (e) => e.key === 'Escape' && onClose && onClose(); window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f); }, [onClose]);
  return (
    <div className="modalbg" onMouseDown={(e) => e.target === e.currentTarget && onClose && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="row"><h2 className="grow">{title}</h2>{onClose && <button className="iconbtn" onClick={onClose} aria-label="Close"><LuX /></button>}</div>
        <div className="col">{children}</div>
        {actions && <div className="row wrap" style={{ justifyContent: 'flex-end' }}>{actions}</div>}
      </div>
    </div>
  );
}

// ---- toast + confetti (fire from anywhere with toast('…') / confetti()) ----
export const toast = (msg, icon = '✨') => window.dispatchEvent(new CustomEvent('kidsy-toast', { detail: { msg, icon, id: Math.random() } }));
export const confetti = () => window.dispatchEvent(new CustomEvent('kidsy-confetti'));
export function Overlays() {
  const [toasts, setToasts] = useState([]);
  const [bits, setBits] = useState([]);
  useEffect(() => {
    const t = (e) => { setToasts((x) => [...x, e.detail]); setTimeout(() => setToasts((x) => x.filter((y) => y.id !== e.detail.id)), 3200); };
    const c = () => { const cols = ['#f43f5e', '#f59e0b', '#22c55e', '#0ea5e9', '#a855f7', '#ec4899']; setBits(Array.from({ length: 44 }, (_, i) => ({ i, l: Math.random() * 100, d: Math.random() * 0.8, c: cols[i % cols.length] }))); setTimeout(() => setBits([]), 3200); };
    window.addEventListener('kidsy-toast', t); window.addEventListener('kidsy-confetti', c);
    return () => { window.removeEventListener('kidsy-toast', t); window.removeEventListener('kidsy-confetti', c); };
  }, []);
  return (
    <>
      <div className="toasts" aria-live="polite">{toasts.map((t) => <div className="toast" key={t.id}><span>{t.icon}</span>{t.msg}</div>)}</div>
      {bits.length > 0 && <div className="confetti" aria-hidden="true">{bits.map((b) => <i key={b.i} style={{ left: b.l + '%', background: b.c, animationDelay: b.d + 's' }} />)}</div>}
    </>
  );
}

// ---- speech buttons -------------------------------------------------------------------------
export function SpeakBtn({ text, label = 'Read to me', small, onBoundary, onEnd, className = '' }) {
  const { state } = useStore();
  const [on, setOn] = useState(false);
  const stopRef = useRef(null);
  useEffect(() => () => stopSpeaking(), []);
  if (!ttsSupported()) return null;
  const toggle = () => {
    if (on) { stopSpeaking(); setOn(false); return; }
    setOn(true);
    stopRef.current = speak(typeof text === 'function' ? text() : text, { rate: state.settings.rate, onBoundary, onEnd: () => { setOn(false); onEnd && onEnd(); } });
  };
  return small
    ? <button className={`iconbtn ${on ? 'on' : ''} ${className}`} onClick={toggle} aria-label={on ? 'Stop reading' : label} title={label}>{on ? <LuSquare /> : <LuVolume2 />}</button>
    : <button className={`btn soft sm ${className}`} onClick={toggle}>{on ? <LuSquare /> : <LuVolume2 />}{on ? 'Stop' : label}</button>;
}

// useMic: one-shot listening for answers (or continuous for reading aloud).
export function useMic({ onFinal, onInterim, continuous = false }) {
  const { state } = useStore();
  const [live, setLive] = useState(false);
  const [err, setErr] = useState('');
  const h = useRef(null);
  const cb = useRef({});
  cb.current = { onFinal, onInterim };
  const stop = useCallback(() => { h.current && h.current.stop(); }, []);
  const start = useCallback(() => {
    setErr(''); stopSpeaking();
    let alts = [];
    h.current = listen({
      lang: state.settings.micLang, continuous,
      onAlternatives: (a) => { alts = alts.concat(a); },
      onText: (fin, interim) => cb.current.onInterim && cb.current.onInterim(fin, interim),
      onEnd: (e, fin) => {
        setLive(false);
        if (e && e !== 'no-speech' && e !== 'aborted') setErr(e === 'not-allowed' || e === 'service-not-allowed' ? 'Microphone is blocked. Allow it in your browser settings.' : e === 'unsupported' ? 'This browser cannot listen. Try Chrome, Edge or Safari.' : 'Could not hear you. Try again.');
        else if (e === 'no-speech') setErr('I did not hear anything. Tap the mic and try again.');
        if (fin || alts.length) cb.current.onFinal && cb.current.onFinal(fin, alts);
      },
    });
    setLive(true);
  }, [state.settings.micLang, continuous]);
  useEffect(() => () => h.current && h.current.stop(), []);
  return { live, err, start, stop, supported: micSupported() };
}

export function MicBtn({ mic, label = 'Say it', small }) {
  if (!mic.supported) return small ? null : <span className="tiny muted">🎤 Microphone needs Chrome, Edge or Safari</span>;
  const on = () => (mic.live ? mic.stop() : mic.start());
  return small
    ? <button className={`iconbtn micbtn ${mic.live ? 'live' : ''}`} onClick={on} aria-label={mic.live ? 'Stop listening' : label} title={label}>{mic.live ? <LuMicOff /> : <LuMic />}</button>
    : <button className={`btn soft sm micbtn ${mic.live ? 'live' : ''}`} onClick={on}>{mic.live ? <LuMicOff /> : <LuMic />}{mic.live ? 'Listening… tap to stop' : label}</button>;
}
