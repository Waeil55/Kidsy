import React, { useMemo, useRef, useState } from 'react';
import { LuChevronLeft, LuChevronRight, LuBookmark, LuCheck, LuHeart, LuLightbulb, LuPlay, LuRotateCcw, LuShare2, LuSparkles, LuVolume2 } from 'react-icons/lu';
import { useStore } from '../store/store.js';
import { GRADE_BY_KEY } from '../data/grades.js';
import { vocabFor } from '../data/vocab.js';
import { generateStory } from '../engine/stories.js';
import { speak } from '../lib/speech.js';
import { Link } from '../ui/router.js';

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

function ReelCard({ card, index }) {
  const { state, dispatch } = useStore();
  const [choice, setChoice] = useState(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const correct = choice !== null && choice === card.answer;
  const answered = choice !== null;
  const answer = (option) => {
    if (answered) return;
    setChoice(option);
    dispatch({ type: 'answer', grade: state.gradeKey, subject: 'study-break', correct: option === card.answer });
  };
  return <article className={`reel-card ${colors[index % colors.length]}`}>
    <div className="reel-glow" />
    <div className="reel-top"><span className="reel-topic"><LuSparkles /> {card.topic}</span><span className="reel-count">{index + 1} / 8</span></div>
    <div className="reel-art" aria-hidden="true">{card.emoji}</div>
    <div className="reel-content">
      <span className="reel-kicker">{card.kicker}</span>
      <h2>{card.prompt || card.title}</h2>
      <p>{card.text}</p>
      {card.options && <div className="reel-options">{card.options.map((option, optionIndex) => <button key={option} className={answered ? optionIndex === card.answer ? 'right' : optionIndex === choice ? 'wrong' : 'quiet' : ''} onClick={() => answer(optionIndex)} disabled={answered}>{option}</button>)}</div>}
      {answered && <div className={`reel-feedback ${correct ? 'good' : 'try'}`}><span>{correct ? <LuCheck /> : <LuRotateCcw />}</span>{correct ? 'Brilliant! +1 point' : `Good try! The answer is ${card.options[card.answer]}.`}</div>}
      {card.storyNumber && <Link to={`/read/${state.gradeKey}/${card.storyNumber}`} className="reel-story-link"><LuPlay /> Read the full story</Link>}
    </div>
    <div className="reel-actions"><button className={liked ? 'active' : ''} onClick={() => setLiked(!liked)} aria-label="Like this study card"><LuHeart /> <small>{liked ? 'Liked' : 'Like'}</small></button><button className={saved ? 'active' : ''} onClick={() => setSaved(!saved)} aria-label="Save this study card"><LuBookmark /> <small>{saved ? 'Saved' : 'Save'}</small></button><button onClick={() => speak(card.speech || card.text)} aria-label="Read this card aloud"><LuVolume2 /><small>Listen</small></button><button onClick={() => navigator.share?.({ title: card.title, text: card.text })} aria-label="Share this study card"><LuShare2 /><small>Share</small></button></div>
  </article>;
}

export default function StudyBreak() {
  const { state } = useStore();
  const grade = GRADE_BY_KEY[state.gradeKey];
  const cards = useMemo(() => {
    const words = vocabFor(state.gradeKey).slice(0, 4);
    const stories = [1, 2, 3, 4].map((n) => generateStory(state.gradeKey, n));
    return [
      ...words.map((word, index) => { const q = shuffledQuestion([word.w, ...words.filter((x) => x.w !== word.w).slice(0, 3).map((x) => x.w)], 0); return { topic: 'Word spark', kicker: 'Quick challenge', emoji: ['🦋', '🌈', '🚀', '🦊'][index], prompt: 'Which word matches this meaning?', text: word.def, ...q, speech: `${word.w}. ${word.def}` }; }),
      ...stories.map((story, index) => { const source = story.questions.slice(0, 1)[0]; const q = shuffledQuestion(source?.options || [], source?.answer ?? 0); return { topic: 'Story spark', kicker: 'Tiny story break', emoji: ['🐳', '🧭', '🌱', '✨'][index], title: story.title, text: story.paragraphs[0], ...q, storyNumber: index + 1, speech: `${story.title}. ${story.paragraphs.join(' ')}` }; }),
    ];
  }, [state.gradeKey]);
  const [idx, setIdx] = useState(0);
  const [drag, setDrag] = useState(0);
  const start = useRef(null);
  const go = (n) => setIdx((i) => Math.max(0, Math.min(cards.length - 1, i + n)));
  const down = (e) => { start.current = e.clientX; };
  const move = (e) => { if (start.current != null) setDrag(e.clientX - start.current); };
  const up = () => { if (start.current == null) return; if (drag < -50) go(1); else if (drag > 50) go(-1); start.current = null; setDrag(0); };
  return <div className="study-break-page" tabIndex={0} onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(1); if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') go(-1); }}>
    <section className="break-intro"><div><span className="eyebrow">A tiny learning adventure</span><h1>Study break ✨</h1><p>Swipe, tap, learn. Every card is made for {grade.label}.</p></div><div className="break-badge"><LuLightbulb /><b>{state.score}</b><small>points</small></div></section>
    <div className="reel-feed" aria-label="Study break cards" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up}>
      <div className={`reel-track ${drag ? 'dragging' : ''}`} style={{ transform: `translateX(calc(${-idx * 100}% + ${drag}px))` }}>{cards.map((card, index) => <ReelCard key={`${card.title}-${index}`} card={card} index={index} />)}</div>
    </div>
    <div className="reel-nav"><button className="iconbtn" onClick={() => go(-1)} disabled={idx === 0} aria-label="Previous card"><LuChevronLeft /></button><div className="reel-dots">{cards.map((_, i) => <i key={i} className={i === idx ? 'on' : ''} onClick={() => setIdx(i)} />)}</div><button className="iconbtn" onClick={() => go(1)} disabled={idx === cards.length - 1} aria-label="Next card"><LuChevronRight /></button></div>
  </div>;
}
