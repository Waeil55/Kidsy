import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import {
  Home, MessageSquare, User, Play, Pause, Star, Volume2, VolumeX,
  ArrowLeft, Camera, Clock, X, Sparkles, Trophy, Award, Palette,
  RotateCcw, CheckCircle2, ChevronRight, ChevronLeft, Send, Bot,
  BookOpen, Flame, Search, Bell, Check, Shield, Lock, Unlock,
  Languages, Smartphone, Monitor, Heart, Calendar, Layers,
  GraduationCap, BarChart2, RefreshCw, ExternalLink, Sliders, Grid,
  Gamepad2, Smile, Compass, Zap, HelpCircle, Settings, Filter,
  Bookmark, Share2, SlidersHorizontal, Lightbulb, Music, Info, Plus, Trash2, Gift, Users, Clapperboard
} from 'lucide-react';
import { GRADES, shuffleArray, getQuestionsForGrade, getSubjectsForGrade } from './content.js';
import SayItScreen from './SayItScreen.jsx';
import GiftScreen from './GiftScreen.jsx';

let _sctx = null;
const _gac = () => {
  if (typeof window === 'undefined') return null;
  const A = window.AudioContext || window.webkitAudioContext;
  if (!A) return null;
  if (!_sctx) _sctx = new A();
  if (_sctx.state === 'suspended') _sctx.resume().catch(() => {});
  return _sctx;
};

export const playSfx = (type = 'click', muted = false) => {
  if (muted) return;
  try {
    const c = _gac();
    if (!c) return;
    const n = c.currentTime;
    const m = (f, d, w = 'sine', v = 0.18) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = w;
      o.frequency.setValueAtTime(f, n);
      g.gain.setValueAtTime(v, n);
      g.gain.exponentialRampToValueAtTime(0.001, n + d);
      o.connect(g);
      g.connect(c.destination);
      o.start(n);
      o.stop(n + d);
    };
    if (type === 'click') m(480, 0.06);
    else if (type === 'pop') { m(320, 0.1); setTimeout(() => m(850, 0.09), 10); }
    else if (type === 'coin') { m(987.77, 0.35); setTimeout(() => m(1318.51, 0.2), 80); }
    else if (type === 'correct') [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => setTimeout(() => m(f, 0.22, 'triangle'), i * 80));
    else if (type === 'celebrate') [440, 554.37, 659.25, 880, 1108.73].forEach((f, i) => setTimeout(() => m(f, 0.3), i * 90));
  } catch {}
};

export const speak = (text, lang = 'en-US') => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text || ''));
      u.rate = 0.96;
      u.pitch = 1.15;
      u.lang = lang;
      window.speechSynthesis.speak(u);
    } catch {}
  }
};

// Kid kid-design CSS lives in ONE place now: src/index.css (kid-3d-btn,
// animate-kid-*, kid-bottomnav, kid-bg-*). This stub keeps call sites working.
const KidStyles = () => null;

const BlueBirdIcon = memo(() => (
  <svg viewBox="0 0 120 120" className="w-24 h-24 select-none drop-shadow-md animate-[bounce_3s_ease-in-out_infinite]">
    <ellipse cx="60" cy="65" rx="36" ry="38" fill="#4B96FF"/>
    <ellipse cx="60" cy="72" rx="26" ry="26" fill="#D3E8FF"/>
    <ellipse cx="48" cy="103" rx="8" ry="4" fill="#FFB703"/>
    <ellipse cx="72" cy="103" rx="8" ry="4" fill="#FFB703"/>
    <path d="M60 27C56 16,52 14,48 18C52 24,56 26,60 28Z" fill="#2E79E6"/>
    <path d="M63 26C66 14,71 13,74 18C70 24,66 26,63 28Z" fill="#3A86FF"/>
    <circle cx="50" cy="52" r="7" fill="#FFF"/><circle cx="51" cy="52" r="4.5" fill="#1E293B"/><circle cx="53" cy="50" r="1.8" fill="#FFF"/>
    <circle cx="70" cy="52" r="7" fill="#FFF"/><circle cx="69" cy="52" r="4.5" fill="#1E293B"/><circle cx="71" cy="50" r="1.8" fill="#FFF"/>
    <ellipse cx="43" cy="61" rx="4.5" ry="2.5" fill="#FF9EAA" opacity="0.7"/>
    <ellipse cx="77" cy="61" rx="4.5" ry="2.5" fill="#FF9EAA" opacity="0.7"/>
    <path d="M57 58L63 58L60 65Z" fill="#FB8500"/>
    <ellipse cx="28" cy="65" rx="9" ry="18" fill="#2E79E6" transform="rotate(15 28 65)"/>
    <ellipse cx="92" cy="65" rx="9" ry="18" fill="#2E79E6" transform="rotate(-15 92 65)"/>
    <path d="M44 68L60 74L76 68L74 86L60 89L46 86Z" fill="#EF4444"/>
    <path d="M46 70L60 75L60 88L47 84Z" fill="#FCA5A5"/><path d="M60 75L74 70L73 84L60 88Z" fill="#FEE2E2"/>
    <line x1="60" y1="74" x2="60" y2="89" stroke="#DC2626" strokeWidth="2"/>
  </svg>
));

const HappyLionIcon = memo(() => (
  <svg viewBox="0 0 140 140" className="w-28 h-28 select-none drop-shadow-md hover:scale-105 transition-transform duration-300">
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((d,i)=>(<circle key={i} cx={70+44*Math.cos(d*Math.PI/180)} cy={70+44*Math.sin(d*Math.PI/180)} r="17" fill={i%2===0?'#FDBA74':'#F59E0B'}/>))}
    <circle cx="45" cy="42" r="12" fill="#FBBF24"/><circle cx="45" cy="42" r="7" fill="#FDE68A"/>
    <circle cx="95" cy="42" r="12" fill="#FBBF24"/><circle cx="95" cy="42" r="7" fill="#FDE68A"/>
    <circle cx="70" cy="70" r="38" fill="#FDE047"/>
    <ellipse cx="56" cy="63" rx="5" ry="6" fill="#451A03"/><circle cx="58" cy="61" r="2" fill="#FFF"/>
    <ellipse cx="84" cy="63" rx="5" ry="6" fill="#451A03"/><circle cx="86" cy="61" r="2" fill="#FFF"/>
    <ellipse cx="48" cy="74" rx="6" ry="3.5" fill="#FCA5A5"/>
    <ellipse cx="92" cy="74" rx="6" ry="3.5" fill="#FCA5A5"/>
    <polygon points="70,69 66,74 74,74" fill="#B45309"/>
    <path d="M66 76Q70 80 74 76" stroke="#78350F" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  </svg>
));

const FriendlyDinoIcon = memo(() => (
  <svg viewBox="0 0 160 140" className="w-28 h-24 select-none drop-shadow-md hover:rotate-3 transition-transform">
    <ellipse cx="75" cy="85" rx="42" ry="38" fill="#84CC16"/>
    <ellipse cx="68" cy="88" rx="28" ry="24" fill="#ECFCCB"/>
    <path d="M90 85C100 80 115 65 118 45C120 30 110 20 95 20C82 20 78 32 82 45C85 55 88 70 88 85Z" fill="#84CC16"/>
    <circle cx="102" cy="28" r="6" fill="#FFF"/><circle cx="103" cy="28" r="3.5" fill="#1E293B"/><circle cx="105" cy="26" r="1.5" fill="#FFF"/>
    <path d="M102 40Q112 44 116 38" stroke="#166534" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <rect x="52" y="112" width="14" height="20" rx="7" fill="#65A30D"/>
    <rect x="80" y="112" width="14" height="20" rx="7" fill="#65A30D"/>
  </svg>
));

const TobyTurtleIcon = memo(({ className = "w-32 h-36" }) => (
  <svg viewBox="0 0 160 180" className={className + " select-none drop-shadow-md"}>
    <ellipse cx="80" cy="100" rx="48" ry="42" fill="#22C55E"/>
    <ellipse cx="80" cy="98" rx="42" ry="36" fill="#4ADE80" stroke="#15803D" strokeWidth="3"/>
    <path d="M60 85L100 85L110 102L95 120L65 120L50 102Z" fill="#86EFAC" stroke="#16A34A" strokeWidth="2"/>
    <ellipse cx="44" cy="130" rx="11" ry="16" fill="#86EFAC" stroke="#16A34A" strokeWidth="2"/>
    <ellipse cx="116" cy="130" rx="11" ry="16" fill="#86EFAC" stroke="#16A34A" strokeWidth="2"/>
    <circle cx="80" cy="54" r="26" fill="#86EFAC" stroke="#16A34A" strokeWidth="2"/>
    <circle cx="70" cy="50" r="4.5" fill="#0F172A"/><circle cx="71" cy="48" r="1.5" fill="#FFF"/>
    <circle cx="90" cy="50" r="4.5" fill="#0F172A"/><circle cx="91" cy="48" r="1.5" fill="#FFF"/>
    <path d="M72 62Q80 68 88 62" stroke="#15803D" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <ellipse cx="80" cy="34" rx="22" ry="5" fill="#3B82F6"/>
    <path d="M66 33C66 22,70 18,80 18C90 18,94 22,94 33Z" fill="#2563EB"/>
    <rect x="66" y="28" width="28" height="5" fill="#1E3A8A"/>
  </svg>
));

const SafariJeepIcon = memo(({ className = "w-28 h-24" }) => (
  <svg viewBox="0 0 140 120" className={className + " select-none drop-shadow-sm"}>
    <circle cx="92" cy="30" r="10" fill="#F59E0B"/>
    <rect x="90" y="36" width="6" height="20" fill="#F59E0B"/>
    <circle cx="48" cy="46" r="12" fill="#94A3B8"/>
    <circle cx="70" cy="48" r="11" fill="#FB923C"/>
    <circle cx="67" cy="46" r="1.5" fill="#000"/><circle cx="73" cy="46" r="1.5" fill="#000"/>
    <polygon points="70,49 68,52 72,52" fill="#B45309"/>
    <rect x="30" y="62" width="80" height="30" rx="8" fill="#EF4444"/>
    <rect x="36" y="65" width="68" height="12" rx="3" fill="#FEF08A" opacity="0.8"/>
    <circle cx="48" cy="94" r="11" fill="#1E293B"/><circle cx="48" cy="94" r="5" fill="#94A3B8"/>
    <circle cx="92" cy="94" r="11" fill="#1E293B"/><circle cx="92" cy="94" r="5" fill="#94A3B8"/>
  </svg>
));

const LetterEKidIcon = memo(({ className = "w-28 h-24" }) => (
  <svg viewBox="0 0 140 120" className={className + " select-none drop-shadow-sm"}>
    <circle cx="45" cy="60" r="18" fill="#CBD5E1"/>
    <circle cx="45" cy="58" r="11" fill="#FED7AA"/>
    <circle cx="42" cy="56" r="1.5" fill="#000"/><circle cx="48" cy="56" r="1.5" fill="#000"/>
    <path d="M72 32L112 32M72 32L72 88L112 88M72 60L104 60" stroke="#F87171" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M72 32L112 32M72 32L72 88L112 88M72 60L104 60" stroke="#FFF" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
));

const AVATARS = [
  { id: 'rex', emoji: '🦊', color: '#F59E0B' },
  { id: 'leo', emoji: '🦁', color: '#EF4444' },
  { id: 'toby', emoji: '🐢', color: '#22C55E' },
  { id: 'owl', emoji: '🦉', color: '#7C3AED' },
  { id: 'bear', emoji: '🐻', color: '#92400E' },
  { id: 'bird', emoji: '🐦', color: '#3B82F6' },
  { id: 'cat', emoji: '🐱', color: '#EC4899' },
  { id: 'dino', emoji: '🦖', color: '#10B981' },
];

function loadProfiles() { try { return JSON.parse(localStorage.getItem('kidplay_profiles') || '[]'); } catch { return []; } }
function saveProfiles(p) { localStorage.setItem('kidplay_profiles', JSON.stringify(p)); }
function loadActiveProfile() { try { return JSON.parse(localStorage.getItem('kidplay_active_profile') || 'null'); } catch { return null; } }
function saveActiveProfile(id) { localStorage.setItem('kidplay_active_profile', JSON.stringify(id)); }

const CreateProfileScreen = memo(({ onDone }) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('G3');
  const [avatarIdx, setAvatarIdx] = useState(0);
  const handleCreate = () => {
    if (!name.trim()) return;
    const profiles = loadProfiles();
    const p = { id: 'p-' + Date.now(), name: name.trim(), grade, avatar: AVATARS[avatarIdx], coins: 0, streak: 0, stars: 0, createdAt: Date.now() };
    profiles.push(p);
    saveProfiles(profiles);
    saveActiveProfile(p.id);
    playSfx('celebrate');
    speak('Welcome ' + p.name + '! Let us learn and play!');
    onDone(p);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="bg-white/95 backdrop-blur rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        <h1 className="text-2xl font-black text-center mb-1" style={{ color: '#6B21A8' }}>Create Your Profile</h1>
        <p className="text-center text-sm text-gray-500 mb-6">Who is learning today?</p>
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {AVATARS.map((av, i) => (
            <button key={av.id} onClick={() => setAvatarIdx(i)}
              className={'w-14 h-14 rounded-2xl text-2xl flex items-center justify-center transition-all ' + (i === avatarIdx ? 'ring-4 scale-110 shadow-lg' : 'opacity-70 hover:opacity-100')}
              style={{ background: av.color + '20', '--tw-ring-color': av.color }}>
              {av.emoji}
            </button>
          ))}
        </div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name..."
          className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none text-center text-lg font-semibold mb-4" maxLength={20}
          onKeyDown={e => e.key === 'Enter' && handleCreate()} />
        <div className="mb-6">
          <p className="text-xs text-gray-400 text-center mb-2 font-medium">Your grade</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {GRADES.map(g => (
              <button key={g.id} onClick={() => setGrade(g.id)}
                className={'px-3 py-1.5 rounded-full text-xs font-bold transition-all ' + (grade === g.id ? 'text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}
                style={grade === g.id ? { background: g.color } : {}}>
                {g.label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleCreate} disabled={!name.trim()}
          className="kid-3d-btn w-full py-3 rounded-2xl text-white font-black text-lg disabled:opacity-40"
          style={{ background: name.trim() ? AVATARS[avatarIdx].color : '#ccc' }}>
          Let's Go!
        </button>
      </div>
    </div>
  );
});

const ProfileSelectScreen = memo(({ onSelect, onAddNew }) => {
  const profiles = loadProfiles();
  const handleSelect = (p) => { saveActiveProfile(p.id); playSfx('pop'); speak('Hi ' + p.name + '!'); onSelect(p); };
  const handleDelete = (e, p) => { e.stopPropagation(); if (confirm('Delete ' + p.name + '\'s profile?')) { saveProfiles(profiles.filter(x => x.id !== p.id)); location.reload(); } };
  if (profiles.length === 0) return null;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' }}>
      <div className="bg-white/95 backdrop-blur rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        <h1 className="text-2xl font-black text-center mb-1" style={{ color: '#7C3AED' }}>Who is Playing?</h1>
        <p className="text-center text-sm text-gray-500 mb-6">Choose your profile</p>
        <div className="space-y-3 mb-6">
          {profiles.map(p => (
            <button key={p.id} onClick={() => handleSelect(p)}
              className="kid-3d-btn w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 text-left border-2 border-transparent hover:border-purple-200">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ background: (p.avatar && p.avatar.color ? p.avatar.color : '#3B82F6') + '20' }}>
                {p.avatar && p.avatar.emoji ? p.avatar.emoji : '🦊'}
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-800">{p.name}</div>
                <div className="text-xs text-gray-400">{(GRADES.find(g => g.id === p.grade) || GRADES[2]).label} - {(p.stars || 0)} stars</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{p.coins || 0} coins</span>
                <button onClick={(e) => handleDelete(e, p)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={14}/></button>
              </div>
            </button>
          ))}
        </div>
        <button onClick={onAddNew} className="kid-3d-btn w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
          <Plus size={18} className="inline mr-2" /> New Profile
        </button>
      </div>
    </div>
  );
});

const GradeSelectScreen = memo(({ onSelect, onBack }) => (
  <div className="min-h-screen px-4 py-8" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="kid-3d-btn w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-black text-white">Pick Your Grade</h1>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {GRADES.map(g => (
          <button key={g.id} onClick={() => { playSfx('pop'); onSelect(g); }}
            className="kid-3d-btn p-6 rounded-3xl text-left relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, ' + g.color + 'ee, ' + g.color + '99)' }}>
            <div className="absolute -top-4 -right-4 text-7xl opacity-10 font-black">{g.id.replace('G','')}</div>
            <div className="text-white text-2xl font-black mb-1">{g.label}</div>
            <div className="text-white/70 text-xs font-medium">{g.age}</div>
            <div className="text-white/80 text-xs mt-2">{g.desc}</div>
          </button>
        ))}
      </div>
    </div>
  </div>
));

const SubjectSelectScreen = memo(({ grade, onSelect, onBack }) => {
  const subjects = getSubjectsForGrade(grade.id);
  const icons = { math: '🧮', reading: '🔤', science: '🔬', social: '🌍' };
  return (
    <div className="min-h-screen px-4 py-8" style={{ background: 'linear-gradient(135deg, ' + grade.color + 'dd, ' + grade.color + '88)' }}>
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="kid-3d-btn w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-gray-600">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">{grade.label} Subjects</h1>
            <p className="text-white/70 text-xs">{grade.age}</p>
          </div>
        </div>
        <div className="space-y-3">
          {subjects.map(s => (
            <button key={s.id} onClick={() => { playSfx('pop'); onSelect(s); }}
              className="kid-3d-btn w-full p-5 rounded-2xl bg-white/95 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: grade.color + '20' }}>
                {icons[s.id] || '📖'}
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-gray-800 text-lg">{s.name}</div>
                <div className="text-xs text-gray-400">10 questions</div>
              </div>
              <ChevronRight size={20} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

const QuizScreen = memo(({ grade, subject, questions: propQuestions, onFinish, onBack, profile }) => {
  const questions = useMemo(() => {
    if (propQuestions && propQuestions.length) return shuffleArray([...propQuestions]);
    return getQuestionsForGrade(grade.id, 10);
  }, [grade, subject, propQuestions]);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [timer, setTimer] = useState(30);

  const idxRef = useRef(0);
  const answeredRef = useRef(false);
  const showResultRef = useRef(false);
  const questionsRef = useRef(questions);

  useEffect(() => { idxRef.current = idx; }, [idx]);
  useEffect(() => { answeredRef.current = answered; }, [answered]);
  useEffect(() => { showResultRef.current = showResult; }, [showResult]);
  useEffect(() => { questionsRef.current = questions; }, [questions]);

  const handleAnswer = useCallback((ansIdx) => {
    if (answeredRef.current || showResultRef.current) return;
    setSelected(ansIdx);
    setAnswered(true);
    const curQ = questionsRef.current[idxRef.current];
    if (!curQ) return;
    const isCorrect = ansIdx >= 0 && ansIdx < curQ.options.length && curQ.options[ansIdx] === curQ.correct;
    if (isCorrect) {
      playSfx('correct');
      speak('Correct!');
      setScore(s => s + 1);
    } else {
      playSfx('click');
      speak('The answer is ' + (curQ.correct || ''));
    }
    setTimeout(() => {
      setSelected(null);
      setAnswered(false);
      setTimer(30);
      const curIdx = idxRef.current;
      const curQs = questionsRef.current;
      if (curIdx + 1 < curQs.length) setIdx(curIdx + 1);
      else setShowResult(true);
    }, 1800);
  }, []);

  useEffect(() => {
    if (!answered && !showResult) {
      const t = setInterval(() => {
        setTimer(p => {
          if (p <= 1) {
            handleAnswer(-1);
            return 30;
          }
          return p - 1;
        });
      }, 1000);
      return () => clearInterval(t);
    }
  }, [idx, answered, showResult, handleAnswer]);

  const q = questions[idx];
  const progress = questions.length > 0 ? ((idx + 1) / questions.length) * 100 : 0;

  if (showResult) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪';
    const newCoins = score * 5;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' }}>
        <div className="bg-white/95 backdrop-blur rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
          <div className="text-6xl mb-4 animate-kid-bounce">{emoji}</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">{pct >= 80 ? 'Amazing!' : pct >= 50 ? 'Good Job!' : 'Keep Going!'}</h2>
          <p className="text-gray-500 mb-6">You got <span className="font-bold text-purple-600">{score}/{questions.length}</span> correct</p>
          <div className="flex justify-center gap-6 mb-6">
            <div className="text-center"><div className="text-2xl font-black text-yellow-500">+{newCoins}</div><div className="text-xs text-gray-400">Coins</div></div>
            <div className="text-center"><div className="text-2xl font-black text-blue-500">+{score}</div><div className="text-xs text-gray-400">Stars</div></div>
            <div className="text-center"><div className="text-2xl font-black text-green-500">{pct}%</div><div className="text-xs text-gray-400">Score</div></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { playSfx('click'); onFinish({ score, coins: ((profile && profile.coins) || 0) + newCoins, stars: ((profile && profile.stars) || 0) + score }); }}
              className="kid-3d-btn flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold">
              Done
            </button>
            <button onClick={() => { playSfx('click'); setIdx(0); setScore(0); setShowResult(false); setTimer(30); }}
              className="kid-3d-btn flex-1 py-3 rounded-2xl bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold">
              <RotateCcw size={16} className="inline mr-1" /> Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!q || !q.options || q.options.length === 0) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="bg-white rounded-3xl p-8 text-center">
        <p className="text-gray-600 mb-4">No questions available for this grade.</p>
        <button onClick={onBack} className="kid-3d-btn px-6 py-3 rounded-2xl bg-purple-500 text-white font-bold">Go Back</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-6" style={{ background: 'linear-gradient(135deg, ' + (grade.color || '#3B82F6') + 'dd, ' + (grade.color || '#3B82F6') + '88)' }}>
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="kid-3d-btn w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-gray-600"><ArrowLeft size={20} /></button>
          <div className="flex-1">
            <div className="h-2 bg-white/30 rounded-full overflow-hidden"><div className="h-full bg-white rounded-full transition-all" style={{ width: progress + '%' }}/></div>
          </div>
          <div className="bg-white/90 rounded-full px-3 py-1 text-xs font-bold text-gray-700">{idx+1}/{questions.length}</div>
        </div>
        <div className="bg-white/95 backdrop-blur rounded-3xl p-6 shadow-2xl mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className={timer <= 10 ? 'text-red-500' : 'text-gray-400'} />
            <span className={'text-sm font-bold ' + (timer <= 10 ? 'text-red-500' : 'text-gray-500')}>{timer}s</span>
            <div className="flex-1" />
            <Star size={16} className="text-yellow-500" />
            <span className="text-sm font-bold text-yellow-500">{score}</span>
          </div>
          <div className="text-center mb-6">
            {q.image && <div className="text-6xl mb-4">{q.image}</div>}
            <h2 className="text-xl font-bold text-gray-800">{q.question}</h2>
            {q.hint && <p className="text-xs text-gray-400 mt-2 italic">{q.hint}</p>}
          </div>
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let bg = 'bg-gray-50 hover:bg-gray-100 border-gray-200';
              if (answered) {
                if (opt === q.correct) bg = 'bg-green-100 border-green-500 text-green-800';
                else if (i === selected) bg = 'bg-red-100 border-red-500 text-red-800';
              }
              return (
                <button key={i} onClick={() => handleAnswer(i)} disabled={answered}
                  className={'kid-3d-btn w-full p-4 rounded-xl text-left font-semibold border-2 transition-all ' + bg}>
                  <span className="inline-block w-7 h-7 rounded-full bg-white/80 text-center leading-7 text-sm font-bold text-gray-500 mr-3">{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              );
            })}
          </div>
          {q.explanation && answered && (
            <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-800">
              {q.explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

const COLORS = ['#EF4444','#F97316','#F59E0B','#22C55E','#3B82F6','#8B5CF6','#EC4899','#000000'];

const DrawingCanvas = memo(({ onBack }) => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#3B855E');
  const [size, setSize] = useState(8);
  const drawing = useRef(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    c.width = c.offsetWidth * 2;
    c.height = c.offsetHeight * 2;
    ctx.scale(2, 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, c.offsetWidth, c.offsetHeight);
  }, []);

  const getPos = (e) => {
    const c = canvasRef.current;
    if (!c) return { x: 0, y: 0 };
    const r = c.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return { x: touch.clientX - r.left, y: touch.clientY - r.top };
  };
  const startDraw = (e) => { drawing.current = true; const p = getPos(e); const ctx = canvasRef.current && canvasRef.current.getContext('2d'); if (ctx) { ctx.beginPath(); ctx.moveTo(p.x, p.y); } };
  const draw = (e) => { if (!drawing.current) return; e.preventDefault(); const p = getPos(e); const ctx = canvasRef.current && canvasRef.current.getContext('2d'); if (ctx) { ctx.lineWidth = size; ctx.lineCap = 'round'; ctx.strokeStyle = color; ctx.lineTo(p.x, p.y); ctx.stroke(); } };
  const endDraw = () => { drawing.current = false; };
  const clear = () => { const c = canvasRef.current; if (!c) return; const ctx = c.getContext('2d'); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, c.offsetWidth, c.offsetHeight); };

  return (
    <div className="min-h-screen px-4 py-6" style={{ background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' }}>
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => { playSfx('whoosh'); onBack(); }} className="kid-3d-btn w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-gray-600"><ArrowLeft size={20} /></button>
          <h1 className="text-xl font-black text-white">Draw & Color</h1>
        </div>
        <div className="bg-white rounded-3xl p-4 shadow-2xl mb-4">
          <canvas ref={canvasRef} className="w-full rounded-xl border-2 border-gray-200 cursor-crosshair" style={{ height: 300, touchAction: 'none' }}
            onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
            onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw} />
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-xl">
          <div className="flex gap-2 flex-wrap justify-center mb-3">
            {COLORS.map(c => (
              <button key={c} onClick={() => { setColor(c); playSfx('click'); }}
                className={'w-9 h-9 rounded-full border-3 transition-all ' + (c === color ? 'scale-125 border-gray-800 shadow-lg' : 'border-white hover:scale-110')}
                style={{ background: c }} />
            ))}
          </div>
          <div className="flex items-center gap-3 justify-center">
            <span className="text-xs text-gray-400">Brush:</span>
            {[4,8,16,24].map(s => (
              <button key={s} onClick={() => { setSize(s); playSfx('click'); }}
                className={'rounded-full transition-all ' + (s === size ? 'bg-blue-500' : 'bg-gray-200 hover:bg-gray-300')}
                style={{ width: s + 16, height: s + 16 }}>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="rounded-full bg-white" style={{ width: s, height: s }} />
                </div>
              </button>
            ))}
            <button onClick={() => { clear(); playSfx('click'); }} className="kid-3d-btn ml-4 px-4 py-2 rounded-xl bg-red-100 text-red-600 font-bold text-sm">
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

const MEMORY_ITEMS = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮'];

const MemoryGame = memo(({ onBack }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const pairs = shuffleArray([...MEMORY_ITEMS]).slice(0, 6);
    const deck = shuffleArray([...pairs, ...pairs].map((emoji, i) => ({ id: i, emoji })));
    setCards(deck);
  }, []);

  const handleFlip = (card) => {
    if (flipped.length === 2 || matched.includes(card.emoji) || flipped.find(f => f.id === card.id)) return;
    const newFlipped = [...flipped, card];
    setFlipped(newFlipped);
    playSfx('pop');
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      if (newFlipped[0].emoji === newFlipped[1].emoji) {
        setMatched([...matched, newFlipped[0].emoji]);
        playSfx('correct');
        setFlipped([]);
        if (matched.length + 1 === 6) { playSfx('celebrate'); speak('You matched them all!'); }
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  return (
    <div className="min-h-screen px-4 py-6" style={{ background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' }}>
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => { playSfx('whoosh'); onBack(); }} className="kid-3d-btn w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-gray-600"><ArrowLeft size={20} /></button>
          <h1 className="text-xl font-black text-white">Memory Match</h1>
          <div className="flex-1" />
          <div className="bg-white/90 rounded-full px-3 py-1 text-sm font-bold text-gray-600">{moves} moves</div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {cards.map(card => {
            const isFlipped = flipped.find(f => f.id === card.id) || matched.includes(card.emoji);
            return (
              <button key={card.id} onClick={() => handleFlip(card)}
                className={'kid-3d-btn aspect-square rounded-2xl text-3xl flex items-center justify-center font-bold transition-all ' + (isFlipped ? 'bg-white shadow-lg' : 'bg-gradient-to-br from-purple-400 to-blue-500')}>
                {isFlipped ? card.emoji : '?'}
              </button>
            );
          })}
        </div>
        {matched.length === 6 && (
          <div className="mt-6 text-center">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="text-4xl mb-2">trophy</div>
              <div className="text-xl font-black text-gray-800">You Win!</div>
              <div className="text-gray-500 text-sm">Completed in {moves} moves</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

const STORIES = [
  { id: 1, title: 'The Brave Little Fox', emoji: '🦊', color: '#F59E0B', pages: [
    { text: 'Once upon a time, a little fox named Rex lived in a green forest.', img: '🌲🦊' },
    { text: 'Rex loved to explore every corner of the forest.', img: '🦊🔍' },
    { text: 'One day, Rex found a baby bird stuck in a bush.', img: '🐦🌿' },
    { text: 'Rex carefully helped the bird and brought it back to its nest.', img: '🦊🐦🏠' },
    { text: 'The bird was so happy! They became best friends forever.', img: '🦊🐦❤️' },
  ]},
  { id: 2, title: 'The Curious Turtle', emoji: '🐢', color: '#22C55E', pages: [
    { text: 'Toby the turtle loved reading books under the big tree.', img: '🐢📖🌳' },
    { text: 'One day he found a mysterious map!', img: '🗺️🐢' },
    { text: 'Toby followed the map through mountains and rivers.', img: '⛰️🐢🌊' },
    { text: 'At the end, he found a treasure chest full of storybooks!', img: '📚🐢✨' },
    { text: 'Toby shared the books with all his friends.', img: '🐢🐰🦊📚' },
  ]},
  { id: 3, title: 'The Smart Owl', emoji: '🦉', color: '#7C3AED', pages: [
    { text: 'Olivia the owl was the wisest in the forest school.', img: '🦉🏫' },
    { text: 'She taught her friends about the stars and moon.', img: '🦉🌙⭐' },
    { text: 'The little animals loved learning with Olivia.', img: '🦉🐱🐶🐰' },
    { text: 'They had a big science fair and everyone won a prize!', img: '🏆🦉' },
    { text: 'Olivia was so proud of all her friends!', img: '🦉💕' },
  ]},
];

const StoryReaderScreen = memo(({ onBack }) => {
  const [story, setStory] = useState(null);
  const [page, setPage] = useState(0);

  if (!story) return (
    <div className="min-h-screen px-4 py-6" style={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { playSfx('whoosh'); onBack(); }} className="kid-3d-btn w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-gray-600"><ArrowLeft size={20} /></button>
          <h1 className="text-xl font-black text-white">Story Reader</h1>
        </div>
        <div className="space-y-4">
          {STORIES.map(s => (
            <button key={s.id} onClick={() => { setStory(s); setPage(0); playSfx('pop'); speak(s.title); }}
              className="kid-3d-btn w-full p-5 rounded-2xl bg-white/95 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: s.color + '20' }}>{s.emoji}</div>
              <div className="text-left"><div className="font-bold text-gray-800">{s.title}</div><div className="text-xs text-gray-400">{s.pages.length} pages</div></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const storyPage = story.pages[page];
  return (
    <div className="min-h-screen px-4 py-6" style={{ background: 'linear-gradient(135deg, ' + story.color + 'dd, ' + story.color + '88)' }}>
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => { setStory(null); playSfx('whoosh'); }} className="kid-3d-btn w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-gray-600"><ArrowLeft size={20} /></button>
          <div className="flex-1 text-center text-white font-bold">{story.title}</div>
          <div className="text-white/70 text-sm">{page+1}/{story.pages.length}</div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-2xl text-center mb-4">
          <div className="text-6xl mb-6 animate-kid-bounce">{storyPage.img}</div>
          <p className="text-lg text-gray-800 font-medium leading-relaxed">{storyPage.text}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setPage(Math.max(0, page-1)); playSfx('click'); }} disabled={page===0}
            className="kid-3d-btn flex-1 py-3 rounded-2xl bg-white/90 text-gray-700 font-bold disabled:opacity-40">
            <ChevronLeft size={18} className="inline" /> Back
          </button>
          <button onClick={() => speak(storyPage.text)} className="kid-3d-btn px-4 py-3 rounded-2xl bg-white/90 text-gray-700">
            <Volume2 size={18} />
          </button>
          {page < story.pages.length - 1 ? (
            <button onClick={() => { setPage(page+1); playSfx('click'); speak(story.pages[page+1].text); }}
              className="kid-3d-btn flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
              Next <ChevronRight size={18} className="inline" />
            </button>
          ) : (
            <button onClick={() => { playSfx('celebrate'); speak('Great job finishing the story!'); setStory(null); }}
              className="kid-3d-btn flex-1 py-3 rounded-2xl bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold">
              Done!
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

const EduPlayHubScreen = memo(({ profile, onBack }) => {
  const activities = [
    { id: 'quiz', icon: '🧠', title: 'Quiz Challenge', desc: 'Answer questions and earn stars', bg: 'from-blue-400 to-indigo-500' },
    { id: 'memory', icon: '🃏', title: 'Memory Match', desc: 'Find all the matching pairs', bg: 'from-purple-400 to-pink-500' },
    { id: 'drawing', icon: '🎨', title: 'Draw & Color', desc: 'Express yourself with art', bg: 'from-pink-400 to-rose-500' },
    { id: 'stories', icon: '📖', title: 'Story Reader', desc: 'Read fun interactive stories', bg: 'from-amber-400 to-orange-500' },
    { id: 'math', icon: '🔢', title: 'Math Master', desc: 'Practice your math skills', bg: 'from-emerald-400 to-teal-500' },
    { id: 'vocab', icon: '📚', title: 'Vocabulary', desc: 'Learn new words every day', bg: 'from-cyan-400 to-blue-500' },
  ];
  return (
    <div className="min-h-screen px-4 py-6" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { playSfx('whoosh'); onBack(); }} className="kid-3d-btn w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-gray-600"><ArrowLeft size={20} /></button>
          <div><h1 className="text-xl font-black text-white">EduPlay Hub</h1><p className="text-white/70 text-xs">Pick an activity!</p></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {activities.map(a => (
            <button key={a.id} onClick={() => { playSfx('pop'); }}
              className={'kid-3d-btn p-5 rounded-2xl bg-gradient-to-br ' + a.bg + ' text-white text-left'}>
              <div className="text-3xl mb-3">{a.icon}</div>
              <div className="font-bold text-sm">{a.title}</div>
              <div className="text-white/70 text-xs mt-1">{a.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

const ProfileScreen = memo(({ profile, onBack, onUpdate, section }) => {
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(profile ? profile.name : '');
  const gradeObj = GRADES.find(g => g.id === (profile && profile.grade)) || GRADES[2];
  const handleSave = () => { if (!name.trim()) return; const p = { ...profile, name: name.trim() }; onUpdate(p); setEditName(false); playSfx('coin'); speak('Name changed to ' + name.trim() + '!'); };
  const sectionTitle = section === 'progress' ? 'My Progress' : section === 'family' ? 'My Family' : section === 'more' ? 'More & Settings' : 'My Profile';
  const sectionSub = section === 'progress' ? 'Coins, stars and streak — keep going!' : section === 'family' ? 'Everyone learning together' : section === 'more' ? 'Name, grade and app settings' : 'Everything about me';
  return (
    <div className="min-h-screen px-4 py-8 pb-28 kid-bg-purple">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => { playSfx('whoosh'); onBack(); }} className="kid-3d-btn w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-gray-600"><ArrowLeft size={20} /></button>
          <h1 className="text-xl font-black text-white">{sectionTitle}</h1>
        </div>
        <p className="text-white/70 text-xs font-bold mb-6 ml-12 pl-1">{sectionSub}</p>
        <div className="bg-white/95 backdrop-blur rounded-3xl p-6 shadow-2xl text-center mb-4">
          <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl" style={{ background: ((profile && profile.avatar && profile.avatar.color) || '#3B82F6') + '20' }}>
            {profile && profile.avatar && profile.avatar.emoji ? profile.avatar.emoji : '🦊'}
          </div>
          {editName ? (
            <div className="flex items-center gap-2 justify-center mb-2">
              <input value={name} onChange={e => setName(e.target.value)} className="px-3 py-1 rounded-lg border-2 border-purple-300 text-center font-bold" autoFocus onKeyDown={e => e.key === 'Enter' && handleSave()} />
              <button onClick={handleSave} className="text-green-500"><Check size={20} /></button>
            </div>
          ) : (
            <h2 className="text-xl font-black text-gray-800 mb-1">{profile && profile.name}</h2>
          )}
          <p className="text-sm text-gray-400">{gradeObj.label} - {gradeObj.age}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/90 rounded-2xl p-4 text-center shadow-lg"><div className="text-2xl font-black text-yellow-500">{(profile && profile.coins) || 0}</div><div className="text-xs text-gray-400">Coins</div></div>
          <div className="bg-white/90 rounded-2xl p-4 text-center shadow-lg"><div className="text-2xl font-black text-blue-500">{(profile && profile.stars) || 0}</div><div className="text-xs text-gray-400">Stars</div></div>
          <div className="bg-white/90 rounded-2xl p-4 text-center shadow-lg"><div className="text-2xl font-black text-red-500">{(profile && profile.streak) || 0}</div><div className="text-xs text-gray-400">Streak</div></div>
        </div>
        <button onClick={() => { setEditName(true); playSfx('click'); }}
          className="kid-3d-btn w-full py-3 rounded-2xl bg-white/90 text-gray-700 font-bold mb-3">
          Edit Name
        </button>
      </div>
    </div>
  );
});

const HomeScreen = memo(({ profile, onNavigate }) => {
  if (!profile) return null;
  const gradeObj = GRADES.find(g => g.id === profile.grade) || GRADES[2];
  const subjects = getSubjectsForGrade(gradeObj.id);
  const quickActions = [
    { id: 'quiz', icon: '🧠', label: 'Quiz', color: '#3B82F6' },
    { id: 'memory', icon: '🃏', label: 'Memory', color: '#8B5CF6' },
    { id: 'drawing', icon: '🎨', label: 'Draw', color: '#EC4899' },
    { id: 'stories', icon: '📖', label: 'Stories', color: '#F59E0B' },
    { id: 'sayit', icon: '🎤', label: 'Say-It', color: '#10B981' },
    { id: 'gift', icon: '🎁', label: 'Gift', color: '#F59E0B' },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #eef2ff 0%, #e0e7ff 30%, #f0f4ff 100%)' }}>
      <KidStyles />
      <div className="px-4 pt-6 pb-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => onNavigate('profile')} className="kid-3d-btn w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: (profile.avatar && profile.avatar.color) || '#3B82F6' }}>
                  {profile.avatar && profile.avatar.emoji ? profile.avatar.emoji : '🦊'}
                </div>
              </button>
              <div>
                <div className="text-white font-bold text-lg">{profile.name}</div>
                <div className="text-white/70 text-xs">{gradeObj.label} - {profile.coins || 0} coins</div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-white/15 rounded-2xl p-3 text-center">
              <div className="text-white text-xl font-black">{profile.stars || 0}</div>
              <div className="text-white/60 text-xs">Stars</div>
            </div>
            <div className="flex-1 bg-white/15 rounded-2xl p-3 text-center">
              <div className="text-white text-xl font-black">{profile.streak || 0}</div>
              <div className="text-white/60 text-xs">Streak</div>
            </div>
            <div className="flex-1 bg-white/15 rounded-2xl p-3 text-center">
              <div className="text-white text-xl font-black">{subjects.length}</div>
              <div className="text-white/60 text-xs">Subjects</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center gap-3 py-6">
          <BlueBirdIcon />
          <div className="bg-white rounded-2xl p-4 shadow-lg flex-1 relative">
            <div className="absolute -left-3 top-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent" />
            <p className="text-gray-700 text-sm font-medium">Hi {profile.name}! Ready to learn and play today?</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-gray-800">Quick Play</h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map(a => (
              <button key={a.id} onClick={() => { playSfx('pop'); onNavigate(a.id); }}
                className="kid-3d-btn flex flex-col items-center p-3 rounded-2xl bg-white shadow-md">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-1" style={{ background: a.color + '15' }}>{a.icon}</div>
                <span className="text-xs font-bold text-gray-600">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-gray-800">Meet the Friends</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            <div className="flex-shrink-0 text-center">
              <div className="bg-blue-50 rounded-2xl p-3 mb-1"><BlueBirdIcon /></div>
              <div className="text-xs font-bold text-gray-600">Bella</div>
            </div>
            <div className="flex-shrink-0 text-center">
              <div className="bg-yellow-50 rounded-2xl p-3 mb-1"><HappyLionIcon /></div>
              <div className="text-xs font-bold text-gray-600">Leo</div>
            </div>
            <div className="flex-shrink-0 text-center">
              <div className="bg-green-50 rounded-2xl p-3 mb-1"><FriendlyDinoIcon /></div>
              <div className="text-xs font-bold text-gray-600">Dino</div>
            </div>
            <div className="flex-shrink-0 text-center">
              <div className="bg-purple-50 rounded-2xl p-3 mb-1"><TobyTurtleIcon className="w-20 h-24" /></div>
              <div className="text-xs font-black text-gray-600">Toby</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div onClick={() => { playSfx('whoosh'); onNavigate('quiz'); }}
            className="kid-3d-btn rounded-3xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
            <div className="p-5 flex items-center gap-4">
              <SafariJeepIcon />
              <div>
                <div className="text-white font-black text-lg">Safari Adventure</div>
                <div className="text-white/80 text-sm">Learn with friends!</div>
              </div>
              <ChevronRight size={24} className="text-white/60 ml-auto" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-gray-800">{gradeObj.label} Subjects</h2>
          </div>
          <div className="space-y-3">
            {subjects.map((s, i) => {
              const subjectIcons = { math: '🧮', reading: '🔤', science: '🔬', social: '🌍' };
              const colors = ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6'];
              return (
                <button key={s.id} onClick={() => { playSfx('pop'); onNavigate('quiz', { grade: gradeObj, subject: s }); }}
                  className="kid-3d-btn w-full flex items-center gap-4 p-4 rounded-2xl bg-white shadow-md">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: colors[i % 5] + '15' }}>
                    {subjectIcons[s.id] || '📖'}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-gray-800">{s.name}</div>
                    <div className="text-xs text-gray-400">10 questions</div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-red-100 to-red-50 p-5 flex items-center gap-4">
            <LetterEKidIcon />
            <div>
              <div className="font-black text-gray-800 text-lg">Alphabet Fun</div>
              <div className="text-gray-500 text-sm">Learn A to Z</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-5 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">lightning</div>
              <div>
                <div className="font-black">Daily Challenge</div>
                <div className="text-white/70 text-xs">Complete 5 quizzes today</div>
              </div>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-white rounded-full" style={{ width: '40%' }} />
            </div>
            <div className="text-white/70 text-xs mt-1">2/5 completed</div>
          </div>
        </div>
      </div>

      <div className="kid-bottomnav">
        <div className="kid-bottomnav-inner">
          {[
            { id: 'home', icon: Home, label: 'Home', active: true },
            { id: 'hub', icon: GraduationCap, label: 'Learn' },
            { id: 'stories', icon: BookOpen, label: 'Stories' },
            { id: 'sayit', icon: Clapperboard, label: 'Reels' },
            { id: 'gift', icon: Gift, label: 'Gift' },
            { id: 'progress', icon: BarChart2, label: 'Progress', go: 'profile', tab: 'progress' },
            { id: 'family', icon: Users, label: 'Family', go: 'profile', tab: 'family' },
            { id: 'more', icon: Settings, label: 'More', go: 'profile', tab: 'more' },
          ].map(tab => (
              <button key={tab.id} onClick={() => { playSfx('click'); onNavigate(tab.go || tab.id, tab.tab ? { tab: tab.tab } : undefined); }}
              className={'kid-tab ' + (tab.active ? 'kid-tab-active' : 'kid-tab-idle')}>
              <tab.icon size={20} strokeWidth={tab.active ? 2.5 : 2} />
              <span className="mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

function AppRouter() {
  const [profile, setProfile] = useState(null);
  const [screen, setScreen] = useState('init');
  const [screenData, setScreenData] = useState({});
  const [audioMuted, setAudioMuted] = useState(false);

  useEffect(() => {
    const id = loadActiveProfile();
    const profiles = loadProfiles();
    if (id && profiles.find(p => p.id === id)) {
      setProfile(profiles.find(p => p.id === id));
      setScreen('home');
    } else if (profiles.length > 0) {
      setScreen('select');
    } else {
      setScreen('create');
    }
  }, []);

  const navigate = useCallback((s, data) => { setScreen(s); setScreenData(data || {}); }, []);

  const updateProfile = useCallback((p) => {
    setProfile(p);
    const profiles = loadProfiles().map(x => x.id === p.id ? p : x);
    saveProfiles(profiles);
  }, []);

  const handleQuizFinish = useCallback((result) => {
    setProfile(prev => {
      if (!prev) return prev;
      const updated = { ...prev, coins: result.coins, stars: result.stars };
      const profiles = loadProfiles().map(x => x.id === updated.id ? updated : x);
      saveProfiles(profiles);
      return updated;
    });
    navigate('home');
  }, [navigate]);

  if (screen === 'init') return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="text-center animate-kid-bounce">
        <BlueBirdIcon />
        <div className="text-white font-black text-2xl mt-4">Kidsy</div>
        <div className="text-white/60 text-sm">Loading...</div>
      </div>
    </div>
  );

  if (screen === 'create') return <CreateProfileScreen onDone={(p) => { setProfile(p); setScreen('home'); }} />;

  if (screen === 'select') return <ProfileSelectScreen onSelect={(p) => { setProfile(p); setScreen('home'); }} onAddNew={() => setScreen('create')} />;

  if (screen === 'grades') return <GradeSelectScreen onSelect={(g) => navigate('subjects', { grade: g })} onBack={() => navigate('home')} />;

  if (screen === 'subjects') return <SubjectSelectScreen grade={(screenData && screenData.grade) || GRADES[2]} onSelect={(s) => navigate('quiz', { grade: (screenData && screenData.grade) || GRADES[2], subject: s })} onBack={() => navigate('grades')} />;

  if (screen === 'quiz') return <QuizScreen grade={(screenData && screenData.grade) || GRADES.find(g => g.id === (profile && profile.grade)) || GRADES[2]} subject={screenData && screenData.subject} onFinish={handleQuizFinish} onBack={() => navigate('home')} profile={profile} />;

  if (screen === 'drawing') return <DrawingCanvas onBack={() => navigate('home')} />;

  if (screen === 'memory') return <MemoryGame onBack={() => navigate('home')} />;

  if (screen === 'stories') return <StoryReaderScreen onBack={() => navigate('home')} />;

  if (screen === 'profile') return <ProfileScreen profile={profile} onBack={() => navigate('home')} onUpdate={updateProfile} section={screenData && screenData.tab} />;

  if (screen === 'sayit') return <SayItScreen profile={profile} onFinish={handleQuizFinish} onBack={() => navigate('home')} />;

  if (screen === 'gift') return <GiftScreen profile={profile} onBack={() => navigate('home')} onNavigate={navigate} onFinish={(r) => { fireConfetti(r && r.type === 'gift'); }} />;

  if (screen === 'hub') return <EduPlayHubScreen profile={profile} onBack={() => navigate('home')} />;

  return (
    <HomeScreen
      profile={profile}
      onNavigate={(s, data) => {
        if (s === 'quiz') {
          if (profile && profile.grade) navigate('subjects', { grade: profile.grade });
          else navigate('grades');
        }
        else if (s === 'profile') navigate('profile');
        else navigate(s, data || {});
      }}
    />
  );
}

export default function NewDesignApp() {
  return <AppRouter />;
}
