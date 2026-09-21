import React, { useEffect, useState } from 'react';
import { LuHouse, LuMap, LuPuzzle, LuLanguages, LuGraduationCap, LuLibrary, LuUpload, LuPenLine, LuTrophy, LuUser, LuMenu, LuVolume2, LuVolumeX, LuBookMarked, LuStar, LuFlame, LuListChecks, LuBell, LuBellOff, LuSparkles, LuMic } from 'react-icons/lu';
import { useStore, THEMES, STICKERS } from './store/store.js';
import { GRADES, GRADE_BY_KEY } from './data/grades.js';
import { useHash, parse, Link, go } from './ui/router.js';
import { Overlays, toast, confetti } from './ui/ui.jsx';
import Home from './screens/Home.jsx';
import { MapScreen, LevelScreen } from './screens/Levels.jsx';
import Reader from './screens/Reader.jsx';
import { PracticeHub, PlayScreen } from './screens/Practice.jsx';
import Words from './screens/Words.jsx';
import G3Pack from './screens/G3Pack.jsx';
import Exam from './screens/Exam.jsx';
import IndexScreen from './screens/IndexScreen.jsx';
import Upload, { PackPlay } from './screens/Upload.jsx';
import Studio, { MyStory } from './screens/Studio.jsx';
import Rewards from './screens/Rewards.jsx';
import Me from './screens/Me.jsx';
import MerolaPack from './screens/MerolaPack.jsx';
import StudyBreak from './screens/StudyBreak.jsx';
import SpeakingLab from './screens/SpeakingLab.jsx';

const NAV = [
  ['/', 'Home', LuHouse], ['/map', 'Adventure map', LuMap], ['/practice', 'Practice', LuPuzzle], ['/words', 'Words', LuLanguages],
  ['/g3pack', 'Grade 3 ELA pack', LuBookMarked, 'G3'], ['/exam', 'Exams', LuGraduationCap], ['/index', 'Big index', LuLibrary],
  ['/merola', 'Merola library', LuBookMarked],
  ['/reels', 'Study break', LuSparkles],
  ['/speaking', 'Speaking Lab', LuMic],
  ['/upload', 'Upload a lesson', LuUpload], ['/studio', 'Studio (make your own)', LuPenLine], ['/rewards', 'Scores & stickers', LuTrophy], ['/me', 'Me & settings', LuUser],
];
const BOTTOM = [['/', 'Home', LuHouse], ['/map', 'Map', LuMap], ['/reels', 'Break', LuSparkles], ['/practice', 'Practice', LuPuzzle], ['/rewards', 'Rewards', LuTrophy]];

export default function App() {
  const { state, dispatch } = useStore();
  const hash = useHash();
  const seg = parse(hash);
  const [open, setOpen] = useState(false);
  const [pop, setPop] = useState(0);
  const g = GRADE_BY_KEY[state.gradeKey];

  useEffect(() => { document.documentElement.dataset.theme = state.theme; document.body.classList.toggle('big', state.settings.bigText); }, [state.theme, state.settings.bigText]);
  useEffect(() => { setOpen(false); }, [hash]);
  useEffect(() => { setPop((p) => p + 1); }, [state.score]);
  useEffect(() => {
    if (state.newStickers && state.newStickers.length) {
      const names = state.newStickers.filter((id) => id !== 'mystery').map((id) => STICKERS.find((s) => s.id === id)).filter(Boolean);
      if (names.length) { confetti(); toast(`New sticker: ${names.map((n) => n.e + ' ' + n.name).join(', ')}`, '🎉'); }
      dispatch({ type: 'clear-new' });
    }
  }, [state.newStickers, dispatch]);

  const key = seg[0] || '';
  const titles = { '': 'Home', map: 'Adventure map', level: 'Level', read: 'Story time', practice: 'Practice', play: 'Practice', words: 'Words', g3pack: 'Grade 3 ELA pack', exam: 'Exams', index: 'Big index', merola: 'Merola library', reels: 'Study break', speaking: 'Speaking Lab', upload: 'Upload a lesson', pack: 'My lesson', mystory: 'My story', studio: 'Studio', rewards: 'Scores & stickers', me: 'Me & settings' };
  const isOn = (p) => (p === '/' ? key === '' : ('/' + key).startsWith(p) || (p === '/practice' && key === 'play') || (p === '/map' && (key === 'level' || key === 'read')));

  let page;
  switch (key) {
    case '': page = <Home />; break;
    case 'map': page = <MapScreen />; break;
    case 'level': page = <LevelScreen level={+seg[1] || 1} />; break;
    case 'read': page = <Reader key={state.gradeKey + seg[2]} grade={state.gradeKey} n={+seg[2] || 1} />; break;
    case 'practice': page = <PracticeHub />; break;
    case 'play': page = <PlayScreen key={seg.join('/')} kind={seg[1]} level={+seg[2] || 0} />; break;
    case 'words': page = <Words />; break;
    case 'g3pack': page = state.gradeKey === 'G3' ? <G3Pack tab={seg[1]} /> : <Home />; break;
    case 'exam': page = <Exam />; break;
    case 'index': page = <IndexScreen />; break;
    case 'merola': page = <MerolaPack section={seg[1]} index={seg[2] === undefined ? null : (+seg[2] || 0)} />; break;
    case 'reels': page = <StudyBreak />; break;
    case 'speaking': page = <SpeakingLab />; break;
    case 'upload': page = <Upload />; break;
    case 'studio': page = <Studio />; break;
    case 'rewards': page = <Rewards />; break;
    case 'me': page = <Me />; break;
    case 'pack': page = <PackPlay key={seg[1]} id={seg[1]} />; break;
    case 'mystory': page = <MyStory key={seg[1]} id={seg[1]} />; break;
    default: page = <Home />;
  }

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
          {NAV.filter((n) => !n[3] || n[3] === state.gradeKey).map(([p, label, Ic]) => (
            <Link key={p} to={p} className={isOn(p) ? 'on' : ''}><Ic />{label}</Link>
          ))}
        </nav>
        <div className="grow" />
        <div className="sidecard">
          <div className="row"><span style={{ fontSize: 34 }}>{state.profile.avatar}</span><div><b>{state.profile.name}</b><div className="tiny" style={{ opacity: .8 }}>{g.emoji} {g.label}</div></div></div>
          <div className="row" style={{ marginTop: 10, justifyContent: 'space-between' }}>
            <div><div className="big">{state.score}</div><div className="tiny" style={{ opacity: .8 }}>points</div></div>
            <div style={{ textAlign: 'right' }}><div className="tiny"><LuFlame style={{ verticalAlign: '-2px' }} /> streak {state.stats.streak}</div><div className="tiny"><LuStar style={{ verticalAlign: '-2px' }} /> {state.stickers.length}/{STICKERS.length} stickers</div></div>
          </div>
        </div>
        <div className="themes" role="group" aria-label="Colour theme">
          {THEMES.map((t) => <button key={t.key} aria-label={t.label} title={t.label} className={state.theme === t.key ? 'on' : ''} style={{ background: `linear-gradient(135deg,${t.a},${t.b})` }} onClick={() => dispatch({ type: 'set', patch: { theme: t.key } })} />)}
        </div>
      </aside>
      <div className="main">
        <header className="top">
          <button className="iconbtn burger" onClick={() => setOpen(true)} aria-label="Open menu"><LuMenu /></button>
          <h2 className="grow">{titles[key] || 'Kidsy'} <span className="pill" style={{ marginLeft: 8, verticalAlign: 'middle' }}>{g.emoji} {g.short}</span></h2>
          <button className={`iconbtn ${state.settings.autoRead ? 'on' : ''}`} title="Read questions to me automatically" aria-label="Toggle automatic read-aloud" onClick={() => dispatch({ type: 'settings', patch: { autoRead: !state.settings.autoRead } })}><LuVolume2 /></button>
          <button className={`iconbtn ${state.settings.sounds ? 'on' : ''}`} title={state.settings.sounds ? 'Mute sounds' : 'Sounds are off'} aria-label="Toggle sound effects" onClick={() => dispatch({ type: 'settings', patch: { sounds: !state.settings.sounds } })}>{state.settings.sounds ? <LuBell /> : <LuBellOff />}</button>
          <Link to="/rewards" className={`scorepill ${pop ? 'pop' : ''}`} key={pop} style={{ textDecoration: 'none', color: 'inherit' }} aria-label={`Score ${state.score}`}><i>⭐</i>{state.score}<span className="lbl tiny muted">pts</span></Link>
        </header>
        <main className="page" key={hash}>{page}</main>
      </div>
      <nav className="bottom" aria-label="Main">
        {BOTTOM.map(([p, label, Ic]) => <Link key={p} to={p} className={isOn(p) ? 'on' : ''}><Ic />{label}</Link>)}
      </nav>
      <Overlays />
    </div>
  );
}
