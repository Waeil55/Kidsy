import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LuX, LuPlay, LuPause, LuVolume2, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { useStore } from '../store/store.js';
import { speak, stopSpeaking } from '../lib/speech.js';
import { EXPLAINERS } from '../data/explainers.js';

// A tiny, code-only "explainer video": a few emoji and a caption per step, animated with CSS only
// (no image or video files, so it stays light) and read aloud with the app's own voice. Mounts only
// while open, and cleans up every timer and any speech the instant it closes.
export function ExplainBtn({ topic, label = 'Watch', small, className = '' }) {
  const [open, setOpen] = useState(false);
  if (!EXPLAINERS[topic]) return null;
  return (
    <>
      <button type="button" className={`explainbtn ${small ? 'sm' : ''} ${className}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }} aria-label={`${label}: how this works`}>
        <span className="explainbtn-ico">▶</span>{label}
      </button>
      {open && <Explainer topic={topic} onClose={() => setOpen(false)} />}
    </>
  );
}

export default function Explainer({ topic, onClose }) {
  const { state } = useStore();
  const scene = EXPLAINERS[topic] || EXPLAINERS.math;
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timer = useRef(null);
  const step = scene.steps[i];

  useEffect(() => {
    stopSpeaking();
    speak(step.cap, { rate: state.settings.rate });
    return () => stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, topic]);

  useEffect(() => {
    if (!playing) return () => {};
    timer.current = setTimeout(() => setI((n) => (n + 1) % scene.steps.length), 3600);
    return () => clearTimeout(timer.current);
  }, [i, playing, scene.steps.length]);

  useEffect(() => () => { stopSpeaking(); clearTimeout(timer.current); }, []);

  const go = (d) => setI((n) => (n + d + scene.steps.length) % scene.steps.length);

  return createPortal(
    <div className="explain-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="explain" role="dialog" aria-label={scene.title}>
        <button className="explain-x" onClick={onClose} aria-label="Close"><LuX /></button>
        <header className="explain-head">
          <span className="explain-emoji" aria-hidden="true">{scene.emoji}</span>
          <div><b>{scene.title}</b><small>{i + 1} of {scene.steps.length}</small></div>
        </header>
        <div className="explain-stage" key={i}>
          <div className="explain-art" aria-hidden="true">{step.big}</div>
          <p className="explain-cap">{step.cap}</p>
        </div>
        <div className="explain-dots" role="tablist" aria-label="Steps">
          {scene.steps.map((_, k) => <i key={k} role="tab" aria-selected={k === i} className={k === i ? 'on' : ''} onClick={() => setI(k)} />)}
        </div>
        <div className="explain-controls">
          <button className="iconbtn" onClick={() => go(-1)} aria-label="Previous step"><LuChevronLeft /></button>
          <button className="iconbtn on" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause' : 'Play'}>{playing ? <LuPause /> : <LuPlay />}</button>
          <button className="iconbtn" onClick={() => speak(step.cap, { rate: state.settings.rate })} aria-label="Read again"><LuVolume2 /></button>
          <button className="iconbtn" onClick={() => go(1)} aria-label="Next step"><LuChevronRight /></button>
        </div>
      </section>
    </div>,
    document.body
  );
}
