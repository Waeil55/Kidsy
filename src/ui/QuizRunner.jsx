import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LuCheck, LuArrowRight, LuRotateCcw } from 'react-icons/lu';
import { useStore, pct as pctOf, starsFor } from '../store/store.js';
import { normText } from '../lib/rng.js';
import { matchOption, matchTyped, wordsToNumbers, speak, stopSpeaking } from '../lib/speech.js';
import { SpeakBtn, MicBtn, useMic, Stars, confetti } from './ui.jsx';
import { sfx } from './sfx.js';

const LET = 'ABCDEF';
const PRAISE = ['Great job!', 'Yes! Nice one!', 'Correct!', 'You got it!', 'Brilliant!', 'Super!', 'Well done!'];
const OOPS = ['Not quite.', 'Oops, close!', 'Good try!', 'Almost!'];

export const isAccepted = (typed, accept) => accept.some((a) => normText(a) === normText(typed) || wordsToNumbers(a) === wordsToNumbers(typed));

export default function QuizRunner({ items, grade, subject = 'quiz', title, onFinish, renderFinish, compact }) {
  const { state, dispatch } = useStore();
  const list = useMemo(() => items.filter((x) => (x.options && x.options.length >= 2) || (x.accept && x.accept.length)), [items]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [checked, setChecked] = useState(false);
  const [log, setLog] = useState([]);
  const [fin, setFin] = useState(false);
  const [heard, setHeard] = useState('');
  const [tick, setTick] = useState(0);
  const [flash, setFlash] = useState(null);
  const item = list[i];
  const isMC = item && item.options && item.options.length >= 2;

  const speechText = item ? `${item.q}. ${isMC ? item.options.map((o, k) => `${LET[k]}. ${o}`).join('. ') : ''}` : '';
  useEffect(() => { setPicked(null); setTyped(''); setChecked(false); setHeard(''); setFlash(null); stopSpeaking(); if (state.settings.autoRead && item) speak(speechText, { rate: state.settings.rate }); /* eslint-disable-next-line */ }, [i]);

  const check = (sel = picked, txt = typed) => {
    if (checked || !item) return;
    const ok = isMC ? sel === item.answer : isAccepted(txt, item.accept);
    if (isMC && sel == null) return;
    if (!isMC && !txt.trim()) return;
    setChecked(true); setPicked(sel);
    setFlash(ok ? 'ok' : 'bad'); setTick((t) => t + 1);
    setLog((l) => [...l, { item, ok, picked: isMC ? item.options[sel] : txt }]);
    dispatch({ type: 'answer', grade, subject: item.subject || subject, correct: ok });
    state.settings.sounds && (ok ? sfx.ok() : sfx.bad());
  };
  const choose = (k) => { if (checked) return; setPicked(k); check(k); };
  const next = () => {
    if (i + 1 >= list.length) {
      const c = log.filter((x) => x.ok).length;
      const res = { correct: c, total: list.length, pct: pctOf(c, list.length), log };
      setFin(true);
      if (res.pct >= 90) { confetti(); state.settings.sounds && sfx.win(); }
      onFinish && onFinish(res);
    } else setI(i + 1);
  };

  const mic = useMic({
    onFinal: (fin2, alts) => {
      const all = [fin2, ...alts].filter(Boolean);
      if (!item) return;
      if (checked) { if (/\b(next|continue|go on)\b/i.test(all.join(' '))) next(); return; }
      if (isMC) {
        const k = matchOption(all, item.options);
        if (k >= 0) { setHeard(`I heard “${all[0]}” → ${LET[k]}`); choose(k); } else setHeard(`I heard “${all[0] || '…'}”. Say A, B, C or the answer.`);
      } else { const t = matchTyped(all, item.accept); setTyped(t); setHeard(`I heard “${t}”`); if (t) check(null, t); }
    },
  });

  useEffect(() => {
    const f = (e) => {
      if (fin || !item || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      const k = e.key.toLowerCase();
      if (!checked && isMC) { const idx = 'abcdef'.indexOf(k); const num = parseInt(k, 10) - 1; const v = idx >= 0 && idx < item.options.length ? idx : num >= 0 && num < item.options.length ? num : -1; if (v >= 0) choose(v); }
      if (e.key === 'Enter' && checked) next();
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  });

  if (!list.length) return <div className="card empty"><div className="e">🤔</div><h3>No questions here yet</h3></div>;

  if (fin) {
    const c = log.filter((x) => x.ok).length, p = pctOf(c, list.length), st = starsFor(p);
    const missed = log.filter((x) => !x.ok);
    return (
      <div className="card qcard">
        <div className="result">
          <div className="bigstars"><Stars n={st} /></div>
          <h2>{p >= 90 ? 'Amazing!' : p >= 70 ? 'Great work!' : p >= 50 ? 'Good effort!' : 'Keep practicing!'}</h2>
          <p className="muted">You got <b>{c}</b> of <b>{list.length}</b> right ({p}%).</p>
          {renderFinish && renderFinish({ correct: c, total: list.length, pct: p, log })}
        </div>
        {missed.length > 0 && (
          <details>
            <summary style={{ fontWeight: 800, cursor: 'pointer' }}>Look at the {missed.length} I missed</summary>
            <div className="col" style={{ marginTop: 10 }}>
              {missed.map((m, k) => (
                <div className="card soft flat" key={k}>
                  <div style={{ fontWeight: 800 }}>{m.item.q}</div>
                  <div className="tiny">You said: <b>{m.picked || '—'}</b> · Answer: <b style={{ color: 'var(--ok)' }}>{m.item.options ? m.item.options[m.item.answer] : m.item.accept[0]}</b></div>
                  {m.item.explain && <div className="tiny muted">{m.item.explain}</div>}
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    );
  }

  const ok = checked && log[log.length - 1]?.ok;
  const correctText = isMC ? item.options[item.answer] : item.accept[0];
  return (
    <div className="card qcard" style={{ position: 'relative' }}>
      {flash && <span key={tick} className={`plus ${flash}`}>{flash === 'ok' ? '+1' : '−1'}</span>}
      <div className="qhead">
        {title && <span className="pill">{title}</span>}
        <span className="tiny muted" style={{ fontWeight: 800 }}>Question {i + 1} of {list.length}</span>
        <div className="dots" aria-hidden="true">{list.map((_, k) => <i key={k} className={k === i ? 'cur' : log[k] ? (log[k].ok ? 'ok' : 'bad') : ''} />)}</div>
        <SpeakBtn small text={speechText} label="Read the question" />
        <MicBtn small mic={mic} label="Say my answer" />
      </div>
      <div className="qtext">{item.q}</div>
      {isMC ? (
        <div className="opts" role="group" aria-label="Answer choices">
          {item.options.map((o, k) => (
            <button key={k} disabled={checked} onClick={() => choose(k)} className={`opt ${checked ? (k === item.answer ? 'ok' : k === picked ? 'bad' : 'dim') : ''}`}>
              <span className="k">{LET[k]}</span><span>{o}</span>
              {checked && k === item.answer && <LuCheck style={{ marginLeft: 'auto' }} />}
            </button>
          ))}
        </div>
      ) : (
        <div className="row">
          <input value={typed} disabled={checked} onChange={(e) => setTyped(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && check(null, typed)} placeholder="Type or say your answer" aria-label="Your answer" autoFocus />
          {!checked && <button className="btn" onClick={() => check(null, typed)}>Check</button>}
        </div>
      )}
      {(heard || mic.err) && !checked && <div className="heard">{mic.err || heard}</div>}
      {checked && (
        <>
          <div className={`fb ${ok ? 'ok' : 'bad'}`}>
            <span style={{ fontSize: 26 }}>{ok ? '🎉' : '💡'}</span>
            <div>
              <b>{ok ? PRAISE[(i * 3) % PRAISE.length] : OOPS[i % OOPS.length]}</b>
              {!ok && <div>The answer is <b>{correctText}</b>.</div>}
              {item.explain && <div className="tiny" style={{ fontWeight: 600, marginTop: 2 }}>{item.explain}</div>}
              {!ok && state.score === 0 && <div className="tiny" style={{ fontWeight: 600 }}>Your score stays at 0 — it never goes below zero.</div>}
            </div>
          </div>
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button className="btn" onClick={next}>{i + 1 >= list.length ? 'See my result' : 'Next'} <LuArrowRight /></button>
          </div>
        </>
      )}
    </div>
  );
}
