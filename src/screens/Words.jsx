import React, { useMemo, useState } from 'react';
import { LuSearch, LuArrowLeft, LuArrowRight, LuShuffle } from 'react-icons/lu';
import { useStore } from '../store/store.js';
import { vocabFor } from '../data/vocab.js';
import { GRADE_BY_KEY } from '../data/grades.js';
import { makeRng } from '../lib/rng.js';
import { Seg, SpeakBtn, Empty } from '../ui/ui.jsx';
import { Link } from '../ui/router.js';
import { storyWords } from '../engine/wordbank.js';
import WordSheet from '../ui/WordSheet.jsx';

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

const KG_ALPHABET = [
  { letter: 'A', lower: 'a', word: 'Apple', emoji: '🍎', ex: 'A is for Apple' },
  { letter: 'B', lower: 'b', word: 'Ball', emoji: '⚽', ex: 'B is for Ball' },
  { letter: 'C', lower: 'c', word: 'Cat', emoji: '🐱', ex: 'C is for Cat' },
  { letter: 'D', lower: 'd', word: 'Dog', emoji: '🐶', ex: 'D is for Dog' },
  { letter: 'E', lower: 'e', word: 'Elephant', emoji: '🐘', ex: 'E is for Elephant' },
  { letter: 'F', lower: 'f', word: 'Fish', emoji: '🐟', ex: 'F is for Fish' },
  { letter: 'G', lower: 'g', word: 'Grapes', emoji: '🍇', ex: 'G is for Grapes' },
  { letter: 'H', lower: 'h', word: 'Hat', emoji: '👒', ex: 'H is for Hat' },
  { letter: 'I', lower: 'i', word: 'Igloo', emoji: '🧊', ex: 'I is for Igloo' },
  { letter: 'J', lower: 'j', word: 'Jam', emoji: '🍓', ex: 'J is for Jam' },
  { letter: 'K', lower: 'k', word: 'Kite', emoji: '🪁', ex: 'K is for Kite' },
  { letter: 'L', lower: 'l', word: 'Lion', emoji: '🦁', ex: 'L is for Lion' },
  { letter: 'M', lower: 'm', word: 'Moon', emoji: '🌙', ex: 'M is for Moon' },
  { letter: 'N', lower: 'n', word: 'Nest', emoji: '🪺', ex: 'N is for Nest' },
  { letter: 'O', lower: 'o', word: 'Owl', emoji: '🦉', ex: 'O is for Owl' },
  { letter: 'P', lower: 'p', word: 'Pig', emoji: '🐷', ex: 'P is for Pig' },
  { letter: 'Q', lower: 'q', word: 'Queen', emoji: '👑', ex: 'Q is for Queen' },
  { letter: 'R', lower: 'r', word: 'Rainbow', emoji: '🌈', ex: 'R is for Rainbow' },
  { letter: 'S', lower: 's', word: 'Sun', emoji: '☀️', ex: 'S is for Sun' },
  { letter: 'T', lower: 't', word: 'Tree', emoji: '🌳', ex: 'T is for Tree' },
  { letter: 'U', lower: 'u', word: 'Umbrella', emoji: '☂️', ex: 'U is for Umbrella' },
  { letter: 'V', lower: 'v', word: 'Van', emoji: '🚐', ex: 'V is for Van' },
  { letter: 'W', lower: 'w', word: 'Watermelon', emoji: '🍉', ex: 'W is for Watermelon' },
  { letter: 'X', lower: 'x', word: 'X-ray', emoji: '🩻', ex: 'X is for X-ray' },
  { letter: 'Y', lower: 'y', word: 'Yo-yo', emoji: '🪀', ex: 'Y is for Yo-yo' },
  { letter: 'Z', lower: 'z', word: 'Zebra', emoji: '🦓', ex: 'Z is for Zebra' },
];

const KG_NUMBERS = [
  { num: '1', name: 'One', emoji: '🍎', text: '1 Apple' },
  { num: '2', name: 'Two', emoji: '🍌🍌', text: '2 Bananas' },
  { num: '3', name: 'Three', emoji: '🍓🍓🍓', text: '3 Berries' },
  { num: '4', name: 'Four', emoji: '🐟🐟🐟🐟', text: '4 Fish' },
  { num: '5', name: 'Five', emoji: '⭐⭐⭐⭐⭐', text: '5 Stars' },
  { num: '6', name: 'Six', emoji: '🐞🐞🐞🐞🐞🐞', text: '6 Ladybugs' },
  { num: '7', name: 'Seven', emoji: '🌼🌼🌼🌼🌼🌼🌼', text: '7 Flowers' },
  { num: '8', name: 'Eight', emoji: '🎈🎈🎈🎈🎈🎈🎈🎈', text: '8 Balloons' },
  { num: '9', name: 'Nine', emoji: '🚗🚗🚗🚗🚗🚗🚗🚗🚗', text: '9 Cars' },
  { num: '10', name: 'Ten', emoji: '🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟', text: '10 Stars' },
];

const KG_SHAPES_COLORS = [
  { title: 'Circle', emoji: '⚪', desc: 'Round like a coin' },
  { title: 'Triangle', emoji: '🔺', desc: 'Has 3 pointy corners' },
  { title: 'Square', emoji: '⏹️', desc: 'Has 4 equal sides' },
  { title: 'Star', emoji: '⭐', desc: 'Shining bright in the sky' },
  { title: 'Heart', emoji: '❤️', desc: 'Love and kindness' },
  { title: 'Diamond', emoji: '🔷', desc: 'Pointy top and bottom' },
  { title: 'Red', emoji: '🔴', desc: 'Red like a shiny apple' },
  { title: 'Blue', emoji: '🔵', desc: 'Blue like the ocean sky' },
  { title: 'Green', emoji: '🟢', desc: 'Green like grass and leaves' },
  { title: 'Yellow', emoji: '🟡', desc: 'Yellow like warm sunshine' },
  { title: 'Orange', emoji: '🟠', desc: 'Orange like a sweet orange' },
  { title: 'Purple', emoji: '🟣', desc: 'Purple like sweet grapes' },
];

export default function Words() {
  const { state } = useStore();
  const g = GRADE_BY_KEY[state.gradeKey];
  const [tab, setTab] = useState(g.key === 'KG' ? 'letters' : 'bank');

  // Dedicated Kindergarten letters, numbers & flashcards view
  if (g.key === 'KG') {
    const kgCards = [
      ...KG_ALPHABET.map((a) => ({ front: `${a.letter} ${a.lower}`, back: `${a.emoji} ${a.word}\n"${a.ex}!"` })),
      ...KG_NUMBERS.map((n) => ({ front: `${n.num}`, back: `${n.name}\n${n.emoji}` })),
      ...KG_SHAPES_COLORS.map((s) => ({ front: `${s.emoji}`, back: `${s.title}\n"${s.desc}"` })),
    ];
    return (
      <>
        <div className="row wrap">
          <div className="grow col">
            <h1>🔤 Alphabet &amp; Words · Kindergarten</h1>
            <p className="muted">Learn letters A to Z, numbers 1 to 10, and fun shapes &amp; colors. Tap 🔊 to hear the sounds!</p>
          </div>
          <Link to="/play/letters/1" className="btn">Play games</Link>
        </div>
        <Seg value={tab} onChange={setTab} options={[
          { key: 'letters', label: '🔤 Letters A–Z' },
          { key: 'numbers', label: '🔢 Numbers 1–10' },
          { key: 'shapes', label: '🎨 Shapes & Colors' },
          { key: 'flip', label: `🃏 Flashcards (${kgCards.length})` },
        ]} />

        {tab === 'letters' && (
          <div className="grid gauto" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
            {KG_ALPHABET.map((item) => (
              <div key={item.letter} className="card col gap8 center" style={{ textAlign: 'center', padding: '20px 16px' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--brand)' }}>{item.letter} {item.lower}</div>
                <div style={{ fontSize: '2.4rem' }}>{item.emoji}</div>
                <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{item.word}</h3>
                <p className="muted tiny" style={{ fontStyle: 'italic' }}>“{item.ex}”</p>
                <SpeakBtn text={`${item.letter}. ${item.word}. ${item.ex}.`} label="Hear it" />
              </div>
            ))}
          </div>
        )}

        {tab === 'numbers' && (
          <div className="grid gauto" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
            {KG_NUMBERS.map((item) => (
              <div key={item.num} className="card col gap8 center" style={{ textAlign: 'center', padding: '20px 16px' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--brand-2)' }}>{item.num}</div>
                <div style={{ fontSize: '1.8rem', letterSpacing: 2 }}>{item.emoji}</div>
                <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{item.name}</h3>
                <p className="muted tiny">{item.text}</p>
                <SpeakBtn text={`Number ${item.num}. ${item.name}. ${item.text}.`} label="Count it" />
              </div>
            ))}
          </div>
        )}

        {tab === 'shapes' && (
          <div className="grid gauto" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
            {KG_SHAPES_COLORS.map((item) => (
              <div key={item.title} className="card col gap8 center" style={{ textAlign: 'center', padding: '20px 16px' }}>
                <div style={{ fontSize: '3rem' }}>{item.emoji}</div>
                <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{item.title}</h3>
                <p className="muted tiny">“{item.desc}”</p>
                <SpeakBtn text={`${item.title}. ${item.desc}.`} label="Hear it" />
              </div>
            ))}
          </div>
        )}

        {tab === 'flip' && <Deck key="kg-all" cards={kgCards} />}
      </>
    );
  }
  const [q, setQ] = useState('');
  const [pos, setPos] = useState('all');
  const [open, setOpen] = useState(null);
  const [letter, setLetter] = useState('');
  const [more, setMore] = useState(1);
  const bank = useMemo(() => storyWords(g.key), [g.key]);
  const book = state.wordbook || { learned: [], learning: [] };
  const bankShown = bank.filter((x) => (!letter || x.w[0] === letter) && (!q || x.w.includes(q.toLowerCase())));
  const mine = state.custom.words.filter((w) => w.grade === g.key).map((w) => ({ ...w, syn: w.syn || [], ant: w.ant || [], mine: true }));
  const words = useMemo(() => [...vocabFor(g.key), ...mine], [g.key, state.custom.words]);
  const shown = words.filter((w) => (pos === 'all' || w.pos === pos) && (!q || (w.w + ' ' + w.def).toLowerCase().includes(q.toLowerCase())));
  const cards = [...words.map((w) => ({ front: w.w, back: `${w.def}${w.ex ? '\n“' + w.ex + '”' : ''}` })), ...state.custom.flashcards.filter((f) => f.grade === g.key).map((f) => ({ front: f.front, back: f.back }))];
  const myCards = state.custom.flashcards.filter((f) => f.grade === g.key);
  return (
    <>
      <div className="row wrap"><div className="grow col"><h1>Words · {g.label}</h1><p className="muted">{words.length} words in this grade{mine.length ? ` (${mine.length} are mine)` : ''}. Tap 🔊 to hear a word.</p></div>
        <Link to={`/play/vocab/1`} className="btn">Quiz me</Link></div>
      {open && <WordSheet word={open} grade={g.key} rate={state.settings.rate} onClose={() => setOpen(null)} />}
      <Seg value={tab} onChange={setTab} options={[{ key: 'bank', label: 'Word bank' }, { key: 'story', label: `Story words (${bank.length})` }, { key: 'mywords', label: `My words (${book.learning.length + book.learned.length})` }, { key: 'flip', label: 'Flashcards' }, { key: 'mine', label: `My cards (${myCards.length})` }]} />
      {tab === 'bank' && (
        <>
          <div className="row wrap">
            <div className="grow" style={{ position: 'relative', minWidth: 220 }}><LuSearch style={{ position: 'absolute', left: 14, top: 14 }} /><input style={{ paddingLeft: 42 }} placeholder="Search words or meanings" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search words" /></div>
            <select style={{ width: 160 }} value={pos} onChange={(e) => setPos(e.target.value)} aria-label="Part of speech"><option value="all">All types</option>{['noun', 'verb', 'adjective', 'adverb'].map((p) => <option key={p}>{p}</option>)}</select>
          </div>
          <div className="grid gauto" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))' }}>
            {shown.map((w) => (
              <div key={w.w} className="card col gap8">
                <div className="row"><h3 className="grow" style={{ fontSize: '1.4rem' }}>{w.w}</h3><span className="pill">{w.pos}</span>{w.mine && <span className="pill gold">mine</span>}<SpeakBtn small text={`${w.w}. ${w.def}`} label="Hear it" /><button className="btn sm soft" onClick={() => setOpen(w.w.toLowerCase())}>Explore</button></div>
                <p>{w.def}</p>
                {w.ex && <p className="muted tiny"><i>“{w.ex}”</i></p>}
                <div className="row wrap gap8">{w.syn.slice(0, 3).map((s) => <span key={s} className="pill ok">= {s}</span>)}{w.ant.slice(0, 3).map((s) => <span key={s} className="pill bad">≠ {s}</span>)}</div>
              </div>
            ))}
          </div>
          {!shown.length && <Empty e="🔎" title="No words found">Try a different search.</Empty>}
        </>
      )}
      {tab === 'story' && (
        <>
          <div className="row wrap">
            <div className="grow" style={{ position: 'relative', minWidth: 200 }}><LuSearch style={{ position: 'absolute', left: 14, top: 14 }} /><input style={{ paddingLeft: 42 }} placeholder="Search story words" value={q} onChange={(e) => { setQ(e.target.value); setMore(1); }} aria-label="Search story words" /></div>
            <span className="pill gold">{bankShown.length} words · tap one to explore</span>
          </div>
          <div className="alpha">{['', ...'abcdefghijklmnopqrstuvwxyz'].map((l) => <button key={l || 'all'} className={letter === l ? 'on' : ''} onClick={() => { setLetter(l); setMore(1); }}>{l || 'All'}</button>)}</div>
          <div className="wordcloud">{bankShown.slice(0, more * 120).map((x) => <button key={x.w} className={`wchip ${book.learned.includes(x.w) ? 'learned' : book.learning.includes(x.w) ? 'learning' : ''}`} onClick={() => setOpen(x.w)}>{x.w}</button>)}</div>
          {bankShown.length > more * 120 && <button className="btn soft" onClick={() => setMore(more + 1)}>Show more words</button>}
          {!bankShown.length && <Empty e="🔎" title="No words found">Try a different letter or search.</Empty>}
        </>
      )}
      {tab === 'mywords' && (
        <div className="col">
          {[['learning', 'Still learning', 'wchip learning'], ['learned', 'I know these', 'wchip learned']].map(([k, label, cls]) => (
            <div key={k} className="card"><h3>{label} ({book[k].length})</h3>{book[k].length ? <div className="wordcloud" style={{ marginTop: 10 }}>{book[k].map((w) => <button key={w} className={cls} onClick={() => setOpen(w)}>{w}</button>)}</div> : <p className="muted">Tap a word in any story or in the Story words tab, then choose “Still learning” or “I know it”.</p>}</div>
          ))}
        </div>
      )}
      {tab === 'flip' && <Deck key="all" cards={cards} />}
      {tab === 'mine' && <Deck key="mine" cards={myCards.map((f) => ({ front: f.front, back: f.back }))} />}
    </>
  );
}
