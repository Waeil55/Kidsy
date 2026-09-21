import React, { useMemo, useState } from 'react';
import { LuSearch, LuArrowLeft, LuArrowRight, LuShuffle } from 'react-icons/lu';
import { useStore } from '../store/store.js';
import { vocabFor } from '../data/vocab.js';
import { GRADE_BY_KEY } from '../data/grades.js';
import { makeRng } from '../lib/rng.js';
import { Seg, SpeakBtn, Empty } from '../ui/ui.jsx';
import { Link } from '../ui/router.js';

function Deck({ cards, speakBack }) {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [order, setOrder] = useState(() => cards.map((_, k) => k));
  if (!cards.length) return <Empty e="🃏" title="No cards yet">Make some in the <Link to="/studio">Studio</Link> or upload a lesson.</Empty>;
  const c = cards[order[i % order.length]];
  const go = (d) => { setFlip(false); setI((i + d + order.length) % order.length); };
  return (
    <div className="col" style={{ maxWidth: 560, margin: '0 auto', width: '100%' }}>
      <div className="tiny muted center" style={{ fontWeight: 800 }}>Card {(i % order.length) + 1} of {order.length} · tap the card to flip</div>
      <button className={`flip ${flip ? 'on' : ''}`} onClick={() => setFlip(!flip)} style={{ border: 0, background: 'none', padding: 0 }} aria-label="Flip card">
        <div><span className="face">{c.front}</span><span className="face back">{c.back}</span></div>
      </button>
      <div className="row wrap" style={{ justifyContent: 'center' }}>
        <button className="btn soft" onClick={() => go(-1)}><LuArrowLeft /> Back</button>
        <SpeakBtn text={() => (flip ? c.back : c.front)} label="Read it" />
        <button className="btn ghost" onClick={() => { setOrder(makeRng(String(Date.now())).shuffle(order)); setI(0); setFlip(false); }}><LuShuffle /> Shuffle</button>
        <button className="btn" onClick={() => go(1)}>Next <LuArrowRight /></button>
      </div>
    </div>
  );
}

export default function Words() {
  const { state } = useStore();
  const g = GRADE_BY_KEY[state.gradeKey];
  const [tab, setTab] = useState('bank');
  const [q, setQ] = useState('');
  const [pos, setPos] = useState('all');
  const mine = state.custom.words.filter((w) => w.grade === g.key).map((w) => ({ ...w, syn: w.syn || [], ant: w.ant || [], mine: true }));
  const words = useMemo(() => [...vocabFor(g.key), ...mine], [g.key, state.custom.words]);
  const shown = words.filter((w) => (pos === 'all' || w.pos === pos) && (!q || (w.w + ' ' + w.def).toLowerCase().includes(q.toLowerCase())));
  const cards = [...words.map((w) => ({ front: w.w, back: `${w.def}${w.ex ? '\n“' + w.ex + '”' : ''}` })), ...state.custom.flashcards.filter((f) => f.grade === g.key).map((f) => ({ front: f.front, back: f.back }))];
  const myCards = state.custom.flashcards.filter((f) => f.grade === g.key);
  return (
    <>
      <div className="row wrap"><div className="grow col"><h1>Words · {g.label}</h1><p className="muted">{words.length} words in this grade{mine.length ? ` (${mine.length} are mine)` : ''}. Tap 🔊 to hear a word.</p></div>
        <Link to={`/play/vocab/1`} className="btn">Quiz me</Link></div>
      <Seg value={tab} onChange={setTab} options={[{ key: 'bank', label: 'Word bank' }, { key: 'flip', label: 'Flashcards' }, { key: 'mine', label: `My cards (${myCards.length})` }]} />
      {tab === 'bank' && (
        <>
          <div className="row wrap">
            <div className="grow" style={{ position: 'relative', minWidth: 220 }}><LuSearch style={{ position: 'absolute', left: 14, top: 14 }} /><input style={{ paddingLeft: 42 }} placeholder="Search words or meanings" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search words" /></div>
            <select style={{ width: 160 }} value={pos} onChange={(e) => setPos(e.target.value)} aria-label="Part of speech"><option value="all">All types</option>{['noun', 'verb', 'adjective', 'adverb'].map((p) => <option key={p}>{p}</option>)}</select>
          </div>
          <div className="grid gauto" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))' }}>
            {shown.map((w) => (
              <div key={w.w} className="card col gap8">
                <div className="row"><h3 className="grow" style={{ fontSize: '1.4rem' }}>{w.w}</h3><span className="pill">{w.pos}</span>{w.mine && <span className="pill gold">mine</span>}<SpeakBtn small text={`${w.w}. ${w.def}`} label="Hear it" /></div>
                <p>{w.def}</p>
                {w.ex && <p className="muted tiny"><i>“{w.ex}”</i></p>}
                <div className="row wrap gap8">{w.syn.slice(0, 3).map((s) => <span key={s} className="pill ok">= {s}</span>)}{w.ant.slice(0, 3).map((s) => <span key={s} className="pill bad">≠ {s}</span>)}</div>
              </div>
            ))}
          </div>
          {!shown.length && <Empty e="🔎" title="No words found">Try a different search.</Empty>}
        </>
      )}
      {tab === 'flip' && <Deck key="all" cards={cards} />}
      {tab === 'mine' && <Deck key="mine" cards={myCards.map((f) => ({ front: f.front, back: f.back }))} />}
    </>
  );
}
