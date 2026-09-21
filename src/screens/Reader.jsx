import React, { useMemo, useState } from 'react';
import { LuMic, LuMicOff, LuVolume2, LuSquare, LuType, LuArrowRight, LuRotateCcw, LuMap } from 'react-icons/lu';
import { useStore, storyRec } from '../store/store.js';
import { generateStory, levelOf } from '../engine/stories.js';
import { speak, stopSpeaking, ttsSupported, alignRead, readingScore, tokenize } from '../lib/speech.js';
import QuizRunner from '../ui/QuizRunner.jsx';
import { Crumb, Notice, useMic, MicBtn, toast, confetti } from '../ui/ui.jsx';
import { Link, go } from '../ui/router.js';

export default function Reader({ grade, n }) {
  const { state, dispatch } = useStore();
  const story = useMemo(() => generateStory(grade, n), [grade, n]);
  const [set, setSet] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [cur, setCur] = useState(-1);
  const [speaking, setSpeaking] = useState(false);
  const [hits, setHits] = useState([]);
  const [pos, setPos] = useState(0);
  const [readRes, setReadRes] = useState(null);
  const [big, setBig] = useState(state.settings.bigText);

  const full = story ? story.paragraphs.join(' ') : '';
  const offsets = useMemo(() => { const o = []; full.replace(/\S+/g, (m, i) => { o.push(i); return m; }); return o; }, [full]);
  const tokens = useMemo(() => tokenize(full), [full]);

  const mic = useMic({
    continuous: true,
    onInterim: (fin, interim) => { const r = alignRead(tokens, `${fin} ${interim}`.trim(), 0, []); setHits(r.hits); setPos(r.pos); },
    onFinal: (fin) => {
      const r = alignRead(tokens, fin || '', 0, []);
      const sc = readingScore(r.hits, tokens.length);
      setHits(r.hits); setPos(r.pos); setReadRes(sc);
      if (sc.pct >= 60) { dispatch({ type: 'flag', key: 'readAloud' }); confetti(); toast(`You read ${sc.pct}% of the story aloud!`, '🎤'); }
    },
  });

  if (!story) return <Notice kind="err">That story does not exist.</Notice>;
  const level = levelOf(n);
  const rec = storyRec(state, grade, n);
  const items = story.questions.filter((q) => q.set === set).map((q) => ({ id: `${story.id}-${q.id}`, q: q.q, options: q.options, answer: q.answer, subject: 'reading' }));

  const readAloud = () => {
    if (speaking) { stopSpeaking(); setSpeaking(false); setCur(-1); return; }
    setSpeaking(true);
    speak(full, { rate: state.settings.rate, onBoundary: (ci) => { let k = 0; while (k + 1 < offsets.length && offsets[k + 1] <= ci) k++; setCur(k); }, onEnd: () => { setSpeaking(false); setCur(-1); } });
  };
  const startMic = () => { setReadRes(null); setHits([]); setPos(0); stopSpeaking(); setSpeaking(false); mic.start(); };

  let ti = -1;
  const para = (p, pi) => (
    <p key={pi}>
      {p.split(' ').map((w, wi) => {
        ti++;
        const t = ti;
        const cls = t === cur ? 'cur' : mic.live && t === pos ? 'cur' : hits[t] === 'ok' ? 'ok' : hits[t] === 'skip' ? 'skip' : '';
        return <span key={wi} className={`w ${cls}`}>{w} </span>;
      })}
    </p>
  );

  const finishNode = (res) => (
    <div className="row wrap" style={{ justifyContent: 'center' }}>
      {set === 0 && <button className="btn" onClick={() => { setSet(1); setAttempt(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Start set 2 <LuArrowRight /></button>}
      {set === 1 && n < 500 && <Link to={`/read/${grade}/${n + 1}`} className="btn">Next story <LuArrowRight /></Link>}
      <button className="btn soft" onClick={() => setAttempt(attempt + 1)}><LuRotateCcw /> Try this set again</button>
      <Link to={`/level/${level}`} className="btn ghost"><LuMap /> Level {level}</Link>
    </div>
  );

  return (
    <>
      <Crumb to={`/level/${level}`}>Level {level}</Crumb>
      <div className="reader">
        <article className="card story" aria-label="Story">
          <div className="row wrap metarow">
            <span className="pill">{story.kindLabel}</span><span className="pill gold">Story {story.letter} · #{n}</span><span className="pill">{story.wordCount} words</span>
          </div>
          <div className="row" style={{ alignItems: 'flex-start', marginTop: 8 }}><span className="emoji">{story.emoji}</span><h2 className="grow">{story.title}</h2></div>
          <div className="tools" style={{ margin: '4px 0 14px' }}>
            {ttsSupported() && <button className="btn soft sm" onClick={readAloud}>{speaking ? <LuSquare /> : <LuVolume2 />}{speaking ? 'Stop' : 'Read to me'}</button>}
            <MicBtn mic={mic} label="I will read aloud" />
            <button className={`btn sm ${big ? '' : 'soft'}`} onClick={() => setBig(!big)} aria-pressed={big}><LuType /> Bigger text</button>
          </div>
          {mic.err && <Notice kind="warn">{mic.err}</Notice>}
          {(mic.live || readRes) && (
            <div className="readbox" style={{ marginBottom: 12 }}>
              {mic.live ? <b>🎤 Listening… read the story out loud. Words turn green as I hear them.</b>
                : readRes && <b>You read {readRes.ok} of {readRes.total} words ({readRes.pct}%). {readRes.pct >= 80 ? 'Wonderful reading!' : readRes.pct >= 60 ? 'Nice reading!' : 'Try again, a little slower.'}</b>}
            </div>
          )}
          <div className={big ? 'big' : ''}>{story.paragraphs.map(para)}</div>
          {rec && <div className="tiny muted">Best so far: set 1 {rec.sets[0] ?? '–'}% · set 2 {rec.sets[1] ?? '–'}%</div>}
        </article>

        <div className="col">
          <div className="setnav" role="tablist">
            {[0, 1].map((s) => <button key={s} role="tab" aria-selected={set === s} className={set === s ? 'on' : ''} onClick={() => { setSet(s); setAttempt(0); }}>Set {s + 1} <span className="pill">{rec && rec.sets[s] != null ? rec.sets[s] + '%' : '10 Q'}</span></button>)}
          </div>
          <QuizRunner
            key={`${story.id}-${set}-${attempt}`}
            items={items} grade={grade} subject="reading" title={`Set ${set + 1}`}
            onFinish={(res) => dispatch({ type: 'story-set', grade, n, set, correct: res.correct, total: res.total })}
            renderFinish={finishNode}
          />
          <p className="tiny muted center">The story stays right here while you answer. Tap the 🔊 or 🎤 buttons if you want to hear the question or say your answer.</p>
        </div>
      </div>
    </>
  );
}
