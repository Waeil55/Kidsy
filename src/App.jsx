import React, { useEffect, useState } from 'react';
import { LuHouse, LuMap, LuPuzzle, LuGraduationCap, LuUser, LuMenu, LuVolume2, LuBookMarked, LuStar, LuFlame, LuBell, LuBellOff } from 'react-icons/lu';
import { useStore, THEMES, STICKERS } from './store/store.js';
import { GRADES, GRADE_BY_KEY } from './data/grades.js';
import { useHash, parse, Link, go } from './ui/router.js';
import { Overlays, toast, confetti } from './ui/ui.jsx';
import { setVoiceConfig } from './lib/speech.js';
import Home from './screens/Home.jsx';
import { MapScreen, LevelScreen } from './screens/Levels.jsx';
import Reader from './screens/Reader.jsx';
import { PracticeHub, PlayScreen } from './screens/Practice.jsx';
import Words from './screens/Words.jsx';
import G3Pack from './screens/G3Pack.jsx';
import Exam from './screens/Exam.jsx';
import Rewards from './screens/Rewards.jsx';
import Me from './screens/Me.jsx';
import MerolaPack from './screens/MerolaPack.jsx';
import FlashcardsScreen from './screens/FlashcardsScreen.jsx';
import Insights from './screens/Insights.jsx';
import Study from './screens/Study.jsx';
import ErrorBoundary from './ui/ErrorBoundary.jsx';
import VocabTalk from './screens/VocabTalk.jsx';
import CustomLab from './screens/CustomLab.jsx';
import Paywall from './screens/Paywall.jsx';
import { initPremium, isLocked, usePremium } from './engine/premium.js';

// Six sections. Each section groups a few pages under one small tab bar; the old page URLs
// keep working so saved links and in-app links still open the right page.
const SECTIONS = [
  { key: 'home', label: 'Home', icon: LuHouse, to: '/', pages: [''] },
  { key: 'learn', label: 'Learn', icon: LuMap, to: '/map', pages: ['map', 'level', 'read', 'study', 'words'],
    tabs: [['/map', 'Adventure map', ['map', 'level', 'read']], ['/study', 'Study guides', ['study']], ['/words', 'Words', ['words']]] },
  { key: 'practice', label: 'Practice', icon: LuPuzzle, to: '/practice', pages: ['practice', 'play', 'cards', 'reels', 'custom-lab'],
    tabs: [['/practice', 'Games', ['practice', 'play']], ['/cards', 'Flashcards', ['cards', 'reels']], ['/custom-lab', 'Custom', ['custom-lab']]] },
  { key: 'exam', label: 'Exams', icon: LuGraduationCap, to: '/exam', pages: ['exam'] },
  { key: 'merola', label: 'Merola', icon: LuBookMarked, to: '/g3pack', grade: 'G3', pages: ['g3pack', 'merola', 'talk'],
    tabs: [['/g3pack', 'Weekly words', ['g3pack']], ['/merola', 'Library', ['merola']], ['/talk', 'Talk buddy', ['talk']]] },
  { key: 'me', label: 'Me', icon: LuUser, to: '/me', pages: ['me', 'insights', 'rewards'],
    tabs: [['/me', 'Profile', ['me']], ['/insights', 'Progress', ['insights']], ['/rewards', 'Rewards', ['rewards']]] },
];

export default function App() {
  const { state, dispatch } = useStore();
  const hash = useHash();
  const seg = parse(hash);
  const [open, setOpen] = useState(false);
  const [pop, setPop] = useState(0);
  const g = GRADE_BY_KEY[state.gradeKey];

  useEffect(() => { document.documentElement.dataset.theme = state.theme; document.body.classList.toggle('big', state.settings.bigText); }, [state.theme, state.settings.bigText]);
  useEffect(() => { setVoiceConfig(state.settings); }, [state.settings.voiceMode, state.settings.accent, state.settings.onlineVoice]);
  useEffect(() => { setOpen(false); }, [hash]);
  usePremium(); // re-render when Kidsy Full is unlocked
  useEffect(() => { initPremium(); }, []);
  useEffect(() => { setPop((p) => p + 1); }, [state.score]);
  useEffect(() => {
    if (state.newStickers && state.newStickers.length) {
      const names = state.newStickers.filter((id) => id !== 'mystery').map((id) => STICKERS.find((s) => s.id === id)).filter(Boolean);
      if (names.length) { confetti(); toast(`New sticker: ${names.map((n) => n.e + ' ' + n.name).join(', ')}`, '🎉'); }
      dispatch({ type: 'clear-new' });
    }
  }, [state.newStickers, dispatch]);

  const rawKey = seg[0] || '';
  // Grade 3 pages fall back to Home for every other grade.
  const key = ['g3pack', 'merola', 'talk'].includes(rawKey) && state.gradeKey !== 'G3' ? '' : rawKey;
  const sections = SECTIONS.filter((x) => !x.grade || x.grade === state.gradeKey);
  const section = sections.find((x) => x.pages.includes(key)) || sections[0];
  const subTab = section.tabs && section.tabs.find((t) => t[2].includes(key));

  let page;
  switch (key) {
    case '': page = <Home />; break;
    case 'map': page = <MapScreen />; break;
    case 'level': page = <LevelScreen level={+seg[1] || 1} />; break;
    case 'read': {
      const readN = seg[2] !== undefined ? (+seg[2] || 1) : (+seg[1] || 1);
      const readGrade = (seg[2] !== undefined && GRADES.some((x) => x.key === seg[1])) ? seg[1] : state.gradeKey;
      page = <Reader key={`${readGrade}-${readN}`} grade={readGrade} n={readN} />;
      break;
    }
    case 'practice': page = <PracticeHub />; break;
    case 'play': page = <PlayScreen key={seg.join('/')} kind={seg[1]} level={+seg[2] || 0} />; break;
    case 'words': page = <Words />; break;
    case 'g3pack': page = state.gradeKey === 'G3' ? <G3Pack tab={seg[1]} /> : <Home />; break;
    case 'exam': page = <Exam />; break;
    case 'custom-lab': page = <CustomLab key={seg[1] || 'lab'} studyOnly initialOp={seg[1] || (g.key === 'KG' ? 'kg_counting' : 'sub')} />; break;
    case 'study': page = <Study />; break;
    case 'merola': page = state.gradeKey === 'G3' ? <MerolaPack section={seg[1]} index={seg[2] === undefined ? null : (+seg[2] || 0)} /> : <Home />; break;
    case 'talk': page = state.gradeKey === 'G3' ? <VocabTalk /> : <Home />; break;
    case 'cards':
    case 'reels': page = <FlashcardsScreen />; break;
    case 'insights': page = <Insights />; break;
    case 'rewards': page = <Rewards />; break;
    case 'me': page = <Me />; break;
    default: page = <Home />;
  }
  if (isLocked(key)) page = <Paywall page={key} />;

  return (
    <div className="app">
      <div className={`scrim ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`side ${open ? 'open' : ''}`} aria-label="Menu">
        <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
          <div className="brand-logo">🦊</div>
          <div><b>Kidsy</b><small>Learn with fun</small></div>
        </Link>
        <div className="gradepick locked-grade" role="status" aria-label="Child grade">
          <span>{g.short}</span><b>{g.label}</b><small>Profile grade</small>
        </div>
        <nav className="nav">
          {sections.map((x) => <Link key={x.key} to={x.to} className={x === section ? 'on' : ''}><x.icon />{x.label}</Link>)}
        </nav>
        <div className="grow" />
        <div className="themes" role="group" aria-label="Colour theme">
          {THEMES.map((t) => <button key={t.key} aria-label={t.label} title={t.label} className={state.theme === t.key ? 'on' : ''} style={{ background: `linear-gradient(135deg,${t.a},${t.b})` }} onClick={() => dispatch({ type: 'set', patch: { theme: t.key } })} />)}
        </div>
      </aside>
      <div className="main">
        <header className="top">
          <button className="iconbtn burger" onClick={() => setOpen(true)} aria-label="Open menu"><LuMenu /></button>
          <h2 className="grow">{key === '' ? `Hi, ${state.profile.name}!` : section.label} <span className="pill" style={{ marginLeft: 8, verticalAlign: 'middle' }}>{g.emoji} {g.short}</span></h2>
          <span className="streakpill" title="Day streak"><LuFlame />{state.stats.streak}</span>
          <button className={`iconbtn ${state.settings.autoRead ? 'on' : ''}`} title="Read questions to me automatically" aria-label="Toggle automatic read-aloud" onClick={() => dispatch({ type: 'settings', patch: { autoRead: !state.settings.autoRead } })}><LuVolume2 /></button>
          <button className={`iconbtn ${state.settings.sounds ? 'on' : ''}`} title={state.settings.sounds ? 'Mute sounds' : 'Sounds are off'} aria-label="Toggle sound effects" onClick={() => dispatch({ type: 'settings', patch: { sounds: !state.settings.sounds } })}>{state.settings.sounds ? <LuBell /> : <LuBellOff />}</button>
          <Link to="/rewards" className={`scorepill ${pop ? 'pop' : ''}`} key={pop} style={{ textDecoration: 'none', color: 'inherit' }} aria-label={`Score ${state.score}`}><i>⭐</i>{state.score}<span className="lbl tiny muted">pts</span></Link>
        </header>
        <main className="page" key={hash} data-route={key || "home"}>
          {section.tabs && (
            <nav className="subtabs" aria-label={`${section.label} pages`}>
              {section.tabs.map(([to, label]) => <Link key={to} to={to} className={subTab && subTab[0] === to ? 'on' : ''}>{label}</Link>)}
            </nav>
          )}
          <ErrorBoundary>
            {page}
          </ErrorBoundary>
        </main>
      </div>
      <nav className="bottom" aria-label="Main">
        {sections.map((x) => <Link key={x.key} to={x.to} className={x === section ? 'on' : ''}><x.icon />{x.label}</Link>)}
      </nav>
      <Overlays />
    </div>
  );
}
