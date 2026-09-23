import React, { useMemo, useRef, useState } from 'react';
import { LuChevronUp, LuChevronDown, LuBookmark, LuCheck, LuHeart, LuLightbulb, LuPlay, LuRotateCcw, LuShare2, LuSparkles, LuVolume2 } from 'react-icons/lu';
import { useStore } from '../store/store.js';
import { GRADE_BY_KEY } from '../data/grades.js';
import { vocabFor } from '../data/vocab.js';
import { generateStory } from '../engine/stories.js';
import { speak } from '../lib/speech.js';
import { generateMath } from '../engine/math.js';
import { grammarQuiz, fillItem } from '../engine/quizzes.js';
import { Link } from '../ui/router.js';
import { ExplainBtn } from '../ui/Explainer.jsx';
import Celebration from '../ui/Celebration.jsx';

const colors = ['coral', 'violet', 'sun', 'mint'];
const shuffle = (items) => {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};
const shuffledQuestion = (options, answer) => {
  const out = shuffle(options.map((text, index) => ({ text, correct: index === answer })));
  return { options: out.map((x) => x.text), answer: out.findIndex((x) => x.correct) };
};

function ReelCard({ card, index, total, active, onAnswered }) {
  const { state, dispatch } = useStore();
  const [choice, setChoice] = useState(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const correct = choice !== null && choice === card.answer;
  const answered = choice !== null;
  const answer = (option) => {
    if (answered) return;
    setChoice(option);
    const ok = option === card.answer;
    dispatch({ type: 'answer', grade: state.gradeKey, subject: 'study-break', correct: ok });
    onAnswered(ok);
  };
  return <article className={`reel-card ${colors[index % colors.length]} ${active ? 'active' : ''}`}>
    <div className="reel-glow" />
    <div className="reel-top"><span className="reel-topic"><LuSparkles /> {card.topic}</span><span className="reel-count">{index + 1} / {total}</span></div>
    <div className="reel-art" aria-hidden="true">{card.emoji}</div>
    <div className="reel-content">
      <span className="reel-kicker">{card.kicker}</span>
      <h2>{card.prompt || card.title}</h2>
      <p>{card.text}</p>
      {card.options && <div className="reel-options">{card.options.map((option, optionIndex) => <button key={option} className={answered ? optionIndex === card.answer ? 'right' : optionIndex === choice ? 'wrong' : 'quiet' : ''} onClick={() => answer(optionIndex)} disabled={answered}>{option}</button>)}</div>}
      {answered && <div className={`reel-feedback ${correct ? 'good' : 'try'}`}><span>{correct ? <LuCheck /> : <LuRotateCcw />}</span>{correct ? 'Brilliant! +1 point' : `Good try! The answer is ${card.options[card.answer]}. −1 point.`}</div>}
      {card.storyNumber && <Link to={`/read/${state.gradeKey}/${card.storyNumber}`} className="reel-story-link"><LuPlay /> Read the full story</Link>}
    </div>
    <div className="reel-side">
      <button className={liked ? 'active' : ''} onClick={() => setLiked(!liked)} aria-label="Like this study card"><LuHeart /><small>{liked ? 'Liked' : 'Like'}</small></button>
      <button className={saved ? 'active' : ''} onClick={() => setSaved(!saved)} aria-label="Save this study card"><LuBookmark /><small>{saved ? 'Saved' : 'Save'}</small></button>
      <button onClick={() => speak(card.speech || card.text)} aria-label="Read this card aloud"><LuVolume2 /><small>Listen</small></button>
      <button onClick={() => Promise.resolve(navigator.share?.({ title: card.title, text: card.text })).catch(() => {})} aria-label="Share this study card"><LuShare2 /><small>Share</small></button>
    </div>
  </article>;
}

export default function StudyBreak() {
  const { state } = useStore();
  const grade = GRADE_BY_KEY[state.gradeKey];
  const cards = useMemo(() => {
    const gk = state.gradeKey;
    const emo = ['🦋', '🌈', '🚀', '🦊', '🐳', '🧭', '🌱', '✨', '🦄', '🐢', '🌻', '🎈', '🪁', '🐬', '🍎', '🌙'];
    const fromItem = (it, i, topic, kicker, prompt) => { const q = shuffledQuestion(it.options, it.answer); return { topic, kicker, emoji: emo[i % emo.length], prompt, text: it.q, ...q, speech: it.q }; };
    const out = [];
    // Kindergarten only ever sees letters and numbers here too — no story, grammar, vocabulary
    // definition or fill-in-the-blank cards, since those all lean on reading full sentences.
    if (gk === 'KG') {
      for (let n = 1; n <= 500; n += 2) { const m = generateMath(gk, n); if (m) out.push(fromItem(m, n, 'Letters & numbers', 'Quick challenge', 'Can you solve it?')); }
      return shuffle(out);
    }
    const words = vocabFor(gk);
    words.forEach((word, i) => { const others = shuffle(words.filter((x) => x.w !== word.w)).slice(0, 3).map((x) => x.w); out.push({ topic: 'Word spark', kicker: 'Quick challenge', emoji: emo[i % emo.length], prompt: 'Which word matches this meaning?', text: word.def, ...shuffledQuestion([word.w, ...others], 0), speech: `${word.w}. ${word.def}` }); });
    for (let n = 1; n <= 500; n += 5) { const story = generateStory(gk, n); const src = story && story.questions[0]; if (src) out.push({ topic: 'Story spark', kicker: 'Tiny story break', emoji: emo[n % emo.length], title: story.title, text: story.paragraphs[0], ...shuffledQuestion(src.options, src.answer), storyNumber: n, speech: `${story.title}. ${story.paragraphs[0]}` }); }
    for (let n = 3; n <= 500; n += 7) { const m = generateMath(gk, n); if (m) out.push(fromItem(m, n, 'Math magic', 'Number puzzle', 'Can you solve it?')); }
    grammarQuiz(gk, 40, 'break').forEach((it, i) => it && it.options && out.push(fromItem(it, i, 'Grammar garden', 'Sentence power', 'Pick the best answer')));
    for (let n = 2; n <= 500; n += 10) { const f = fillItem(gk, n); if (f && f.options) out.push(fromItem(f, n, 'Fill the gap', 'Missing word', 'Which word fits?')); }
    return shuffle(out);
  }, [state.gradeKey]);
  const [idx, setIdx] = useState(0);
  const [drag, setDrag] = useState(0);
  const start = useRef(null);
  const [streak, setStreak] = useState(0);
  const [celeb, setCeleb] = useState(null); // { round } while a celebration is showing
  const go = (n) => setIdx((i) => Math.max(0, Math.min(cards.length - 1, i + n)));
  // vertical swipe: up = next card, down = previous card — the same gesture as any short-video feed
  const down = (e) => { if (celeb) return; start.current = e.clientY; };
  const move = (e) => { if (celeb || start.current == null) return; setDrag(e.clientY - start.current); };
  const up = () => { if (start.current == null) return; if (drag < -50) go(1); else if (drag > 50) go(-1); start.current = null; setDrag(0); };
  const onAnswered = (ok) => {
    if (!ok) { setStreak(0); return; }
    const next = streak + 1;
    setStreak(next);
    if (next % 4 === 0) setCeleb({ round: Math.floor(next / 4) - 1 });
  };
  return <div className="study-break-page" tabIndex={0} onKeyDown={(e) => { if (e.key === 'ArrowDown') go(1); if (e.key === 'ArrowUp') go(-1); }}>
    <section className="break-intro"><div><span className="eyebrow">A tiny learning adventure</span><h1>Study break ✨</h1><p>Swipe up for more, made for {grade.label}.</p><ExplainBtn topic="break" small /></div><div className="break-badge"><LuLightbulb /><b>{state.score}</b><small>points</small></div></section>
    <div className="reel-feed vert" aria-label="Study break cards" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up}>
      <div className={`reel-track vert ${drag ? 'dragging' : ''}`} style={{ transform: `translateY(calc(${-idx * 100}% + ${drag}px))` }}>
        {cards.map((card, index) => <ReelCard key={`${card.title}-${index}`} card={card} index={index} total={cards.length} active={index === idx} onAnswered={onAnswered} />)}
      </div>
      {celeb && <Celebration theme={celeb.round} streak={streak} onDone={() => setCeleb(null)} />}
      <div className="reel-vnav">
        <button className="iconbtn" onClick={() => go(-1)} disabled={idx === 0} aria-label="Previous card"><LuChevronUp /></button>
        <span className="reel-vbar"><i style={{ height: `${((idx + 1) / cards.length) * 100}%` }} /></span>
        <button className="iconbtn" onClick={() => go(1)} disabled={idx === cards.length - 1} aria-label="Next card"><LuChevronDown /></button>
      </div>
    </div>
  </div>;
}
