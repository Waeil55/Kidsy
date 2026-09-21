import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { LuVolume2, LuTurtle, LuX, LuMic, LuCheck, LuBookmark, LuSparkles, LuRotateCcw, LuEraser } from 'react-icons/lu';
import { useStore } from '../store/store.js';
import { VOCAB } from '../data/vocab.js';
import { speak, stopSpeaking } from '../lib/speech.js';
import { useMic, toast, confetti } from './ui.jsx';

export const LANGS = [['off', 'No translation'], ['ar', 'العربية'], ['es', 'Español'], ['fr', 'Français'], ['de', 'Deutsch'], ['tr', 'Türkçe'], ['ur', 'اردو'], ['hi', 'हिन्दी']];

const cache = new Map();
const localFind = (grade, w) => {
  const order = [grade, ...Object.keys(VOCAB)];
  for (const g of order) { const hit = (VOCAB[g] || []).find((x) => x.w.toLowerCase() === w); if (hit) return hit; }
  return null;
};
async function lookup(w) {
  const k = 'd:' + w;
  if (cache.has(k)) return cache.get(k);
  try {
    const r = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(w)}`, { signal: AbortSignal.timeout(5000) });
    if (!r.ok) throw new Error('none');
    const j = await r.json();
    const e = j[0];
    const defs = [];
    for (const m of e.meanings || []) for (const d of (m.definitions || []).slice(0, 2)) defs.push({ pos: m.partOfSpeech, def: d.definition, ex: d.example });
    const out = {
      ipa: e.phonetic || (e.phonetics || []).map((p) => p.text).find(Boolean) || '',
      defs: defs.slice(0, 4),
      syn: [...new Set((e.meanings || []).flatMap((m) => [...(m.synonyms || []), ...(m.definitions || []).flatMap((d) => d.synonyms || [])]))].slice(0, 8),
      ant: [...new Set((e.meanings || []).flatMap((m) => [...(m.antonyms || []), ...(m.definitions || []).flatMap((d) => d.antonyms || [])]))].slice(0, 6),
    };
    cache.set(k, out); return out;
  } catch (e) { cache.set(k, null); return null; }
}
async function translate(w, lang) {
  const k = `t:${lang}:${w}`;
  if (cache.has(k)) return cache.get(k);
  try {
    const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(w)}&langpair=en|${lang}`);
    const j = await r.json();
    const t = j && j.responseData && j.responseData.translatedText;
    cache.set(k, t || ''); return t || '';
  } catch (e) { return ''; }
}
// rough syllable split so kids can clap the word
export function syllables(w) {
  const m = w.toLowerCase().replace(/e$/, '').match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy]+$)?|[^aeiouy]+$/g);
  return m && m.length ? m : [w];
}
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

export default function WordSheet({ word, sentence, grade, rate = 0.9, onClose }) {
  const { state, dispatch } = useStore();
  const clean = word.toLowerCase().replace(/[^a-z']/g, '');
  const local = useMemo(() => localFind(grade, clean), [grade, clean]);
  const [online, setOnline] = useState(undefined);
  const [tr, setTr] = useState('');
  const [tab, setTab] = useState('meaning');
  const lang = state.settings.wordLang || 'off';
  const book = state.wordbook || { learned: [], learning: [] };
  const status = book.learned.includes(clean) ? 'learned' : book.learning.includes(clean) ? 'learning' : '';

  useEffect(() => { setTab('meaning'); setOnline(undefined); lookup(clean).then(setOnline); }, [clean]);
  useEffect(() => { setTr(''); if (lang !== 'off') translate(clean, lang).then(setTr); }, [clean, lang]);
  useEffect(() => { speak(clean, { rate }); return () => stopSpeaking(); }, [clean]); // eslint-disable-line

  const defs = [];
  if (local) defs.push({ pos: local.pos, def: local.def, ex: local.ex });
  (online ? online.defs : []).forEach((d) => { if (!local || d.def !== local.def) defs.push(d); });
  const examples = [...new Set([sentence, local && local.ex, ...defs.map((d) => d.ex)].filter(Boolean))];
  const syn = [...new Set([...(local ? local.syn || [] : []), ...(online ? online.syn : [])])].slice(0, 8);
  const ant = [...new Set([...(local ? local.ant || [] : []), ...(online ? online.ant : [])])].slice(0, 6);
  const parts = syllables(clean);

  const mark = (kind) => {
    const learned = book.learned.filter((x) => x !== clean), learning = book.learning.filter((x) => x !== clean);
    (kind === 'learned' ? learned : learning).push(clean);
    dispatch({ type: 'set', patch: { wordbook: { learned, learning } } });
    if (kind === 'learned') { confetti(); toast(`“${clean}” is a word you know!`, '🌟'); } else toast(`“${clean}” saved to practise`, '📌');
  };
  const clear = () => dispatch({ type: 'set', patch: { wordbook: { learned: book.learned.filter((x) => x !== clean), learning: book.learning.filter((x) => x !== clean) } } });

  // say it
  const [said, setSaid] = useState('');
  const mic = useMic({ onFinal: (fin, alts = []) => { const all = [fin, ...alts].join(' ').toLowerCase(); setSaid(all.includes(clean) ? 'ok' : 'try'); if (all.includes(clean)) { confetti(); speak('Great job!', { rate }); } } });
  // spell it
  const letters = useMemo(() => shuffle(clean.replace(/'/g, '').split('')), [clean]);
  const [built, setBuilt] = useState([]);
  useEffect(() => { setBuilt([]); setSaid(''); }, [clean]);
  const target = clean.replace(/'/g, '');
  const spelled = built.length === target.length ? (built.map((i) => letters[i]).join('') === target ? 'ok' : 'bad') : '';
  useEffect(() => { if (spelled === 'ok') { confetti(); speak(`${target}. Correct!`, { rate }); } }, [spelled]); // eslint-disable-line

  return createPortal(
    <div className="wsheet-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="wsheet" role="dialog" aria-label={`Word: ${clean}`}>
        <button className="wsheet-x" onClick={onClose} aria-label="Close"><LuX /></button>
        <header className="wsheet-head">
          <div className="wsheet-word">
            <h3>{clean}</h3>
            <div className="wsheet-syl">{parts.map((p, i) => <i key={i}>{p}</i>)}</div>
            {online && online.ipa && <span className="wsheet-ipa">{online.ipa}</span>}
          </div>
          <div className="wsheet-hear">
            <button className="btn sm" onClick={() => speak(clean, { rate })}><LuVolume2 /> Hear</button>
            <button className="btn sm soft" onClick={() => speak(clean, { rate: 0.5 })}><LuTurtle /> Slow</button>
          </div>
        </header>
        <div className="wsheet-tr">
          <select value={lang} onChange={(e) => dispatch({ type: 'settings', patch: { wordLang: e.target.value } })} aria-label="Translate to">
            {LANGS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
          {lang !== 'off' && <b dir="auto">{tr || '…'}</b>}
        </div>
        <nav className="wsheet-tabs" role="tablist">
          {[['meaning', 'Meaning'], ['examples', 'Examples'], ['words', 'Word pals'], ['practice', 'Practice']].map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
        </nav>
        <div className="wsheet-body">
          {tab === 'meaning' && (defs.length ? defs.slice(0, 3).map((d, i) => (
            <p key={i} className="wsheet-def">{d.pos && <span className="pill">{d.pos}</span>} {d.def}<button className="wsheet-say" onClick={() => speak(d.def, { rate })} aria-label="Read meaning"><LuVolume2 /></button></p>
          )) : <p className="muted">{online === undefined ? 'Looking it up…' : 'No dictionary entry found. Hear the word and see how it is used in the story.'}</p>)}
          {tab === 'examples' && (examples.length ? examples.map((s, i) => (
            <p key={i} className="wsheet-ex"><span className="pill gold">{i === 0 && s === sentence ? 'In your story' : 'Example'}</span> {s.split(new RegExp(`(\\b${clean}\\w*)`, 'i')).map((x, j) => (j % 2 ? <mark key={j}>{x}</mark> : x))}<button className="wsheet-say" onClick={() => speak(s, { rate })} aria-label="Read sentence"><LuVolume2 /></button></p>
          )) : <p className="muted">No examples yet.</p>)}
          {tab === 'words' && (
            <div className="wsheet-pals">
              <div><b>Same meaning</b><div className="chips">{syn.length ? syn.map((s) => <button key={s} className="chip ok" onClick={() => speak(s, { rate })}>{s}</button>) : <span className="muted tiny">none found</span>}</div></div>
              <div><b>Opposite</b><div className="chips">{ant.length ? ant.map((s) => <button key={s} className="chip bad" onClick={() => speak(s, { rate })}>{s}</button>) : <span className="muted tiny">none found</span>}</div></div>
            </div>
          )}
          {tab === 'practice' && (
            <div className="wsheet-prac">
              <div className="prac-card">
                <b>Say it</b>
                <button className={`iconbtn micbtn ${mic.live ? 'live' : ''}`} onClick={() => (mic.live ? mic.stop() : (setSaid(''), mic.start()))} aria-label="Say the word"><LuMic /></button>
                <span className={`prac-msg ${said}`}>{mic.err || (said === 'ok' ? 'Perfect!' : said === 'try' ? 'Try again' : mic.live ? 'Listening…' : 'Tap and say it')}</span>
              </div>
              <div className="prac-card">
                <b>Spell it</b>
                <div className={`spell-slots ${spelled}`}>{target.split('').map((_, i) => <i key={i}>{built[i] != null ? letters[built[i]] : ''}</i>)}</div>
                <div className="spell-keys">{letters.map((l, i) => <button key={i} disabled={built.includes(i)} onClick={() => built.length < target.length && setBuilt([...built, i])}>{l}</button>)}</div>
                <button className="btn sm ghost" onClick={() => setBuilt([])}><LuRotateCcw /> Again</button>
              </div>
            </div>
          )}
        </div>
        <footer className="wsheet-foot">
          <button className={`btn soft ${status === 'learning' ? 'sel' : ''}`} onClick={() => mark('learning')}><LuBookmark /> Still learning</button>
          <button className={`btn ${status === 'learned' ? 'sel' : ''}`} onClick={() => mark('learned')}><LuCheck /> I know it</button>
          {status && <button className="iconbtn" onClick={clear} aria-label="Remove mark" title="Remove mark"><LuEraser /></button>}
        </footer>
      </section>
    </div>,
    document.body
  );
}
