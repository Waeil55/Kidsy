const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, 'NewDesign.jsx');

// We write the file in parts to avoid string escaping issues
const parts = [];

parts.push(`import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import {
  Home, MessageSquare, User, Play, Pause, Star, Volume2, VolumeX,
  ArrowLeft, Camera, Clock, X, Sparkles, Trophy, Award, Palette,
  RotateCcw, CheckCircle2, ChevronRight, ChevronLeft, Send, Bot,
  BookOpen, Flame, Search, Bell, Check, Shield, Lock, Unlock,
  Languages, Smartphone, Monitor, Heart, Calendar, Layers,
  GraduationCap, BarChart2, RefreshCw, ExternalLink, Sliders, Grid,
  Gamepad2, Smile, Compass, Zap, HelpCircle, Settings, Filter,
  Bookmark, Share2, SlidersHorizontal, Lightbulb, Music, Info, Plus, Trash2,
  Gift, ShoppingBag, Gem, Target, Medal, Crown, Ticket
} from 'lucide-react';
import {
  GRADES, shuffleArray, getQuestionsForGrade, getSubjectsForGrade,
  getPhonicsQuestions, getWordList, PHONICS_BANK, WORDS_BANK
} from './content.js';

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
    const now = c.currentTime;
    const m = (f, d, w = 'sine', v = 0.18) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = w; o.frequency.setValueAtTime(f, now);
      g.gain.setValueAtTime(v, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + d);
      o.connect(g); g.connect(c.destination);
      o.start(now); o.stop(now + d);
    };
    if (type === 'click') m(480, 0.06);
    else if (type === 'pop') { m(320, 0.1); setTimeout(() => m(850, 0.09), 10); }
    else if (type === 'coin') { m(987.77, 0.35); setTimeout(() => m(1318.51, 0.2), 80); }
    else if (type === 'correct') [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => setTimeout(() => m(f, 0.22, 'triangle'), i * 80));
    else if (type === 'wrong') { m(200, 0.15, 'sawtooth', 0.1); setTimeout(() => m(150, 0.2, 'sawtooth', 0.1), 120); }
    else if (type === 'celebrate') [440, 554.37, 659.25, 880, 1108.73].forEach((f, i) => setTimeout(() => m(f, 0.3), i * 90));
    else if (type === 'gift') { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => m(f, 0.25, 'triangle', 0.15), i * 120)); }
    else if (type === 'whoosh') { m(600, 0.08); setTimeout(() => m(1200, 0.06), 40); }
    else if (type === 'unlock') { [440, 554, 659, 880, 1109, 1319].forEach((f, i) => setTimeout(() => m(f, 0.2, 'sine', 0.12), i * 80)); }
  } catch {}
};

export const speak = (text, lang = 'en-US') => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text || ''));
      u.rate = 0.96; u.pitch = 1.15; u.lang = lang;
      window.speechSynthesis.speak(u);
    } catch {}
  }
};

const KID_CSS = \`
  @keyframes kb{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px) scale(1.02)}}
  @keyframes kw{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
  @keyframes kf{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px) rotate(2deg)}}
  @keyframes kg{0%{transform:scale(0.8);opacity:0}100%{transform:scale(1);opacity:1}}
  @keyframes kr{0%{transform:rotate(0deg)}25%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}75%{transform:rotate(-3deg)}100%{transform:rotate(0deg)}}
  @keyframes glow{0%,100%{box-shadow:0 0 5px rgba(251,191,36,0.4)}50%{box-shadow:0 0 20px rgba(251,191,36,0.8)}}
  @keyframes sparkle{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.2)}}
  @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
  @keyframes bounceIn{0%{transform:scale(0)}50%{transform:scale(1.15)}100%{transform:scale(1)}}
  @keyframes confetti{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
  .animate-kb{animation:kb 2.5s ease-in-out infinite}
  .animate-kw{animation:kw 1.8s ease-in-out infinite}
  .animate-kf{animation:kf 3s ease-in-out infinite}
  .animate-kg{animation:kg 0.4s cubic-bezier(.34,1.56,.64,1) forwards}
  .animate-kr{animation:kr 0.5s ease-in-out}
  .animate-glow{animation:glow 2s ease-in-out infinite}
  .animate-sparkle{animation:sparkle 1.5s ease-in-out infinite}
  .animate-slideup{animation:slideUp 0.4s ease-out forwards}
  .animate-bouncein{animation:bounceIn 0.5s cubic-bezier(.34,1.56,.64,1) forwards}
  .kid-btn{transition:all .12s cubic-bezier(.34,1.56,.64,1);box-shadow:0 5px 0 rgba(0,0,0,.15),0 8px 20px rgba(0,0,0,.1);cursor:pointer;user-select:none;border:none;outline:none}
  .kid-btn:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 8px 0 rgba(0,0,0,.15),0 14px 28px rgba(0,0,0,.12)}
  .kid-btn:active{transform:translateY(4px) scale(.97);box-shadow:0 1px 0 rgba(0,0,0,.15),0 3px 8px rgba(0,0,0,.1)}
  .kid-card{background:white;border-radius:20px;box-shadow:0 4px 20px rgba(0,0,0,.08);border:2px solid transparent;transition:all .2s ease}
  .kid-card:hover{border-color:#c7d2fe;box-shadow:0 8px 30px rgba(0,0,0,.12)}
  .kid-glow{box-shadow:0 0 15px rgba(99,102,241,0.3)}
  .no-scrollbar::-webkit-scrollbar{display:none}
  .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
\`;

const KidStyles = () => (<style>{KID_CSS}</style>);

// ─── SVG MASCOTS ──────────────────────────────────────────────────────────────
const BlueBirdIcon = memo(() => (
  <svg viewBox="0 0 120 120" className="w-24 h-24 select-none drop-shadow-md animate-kb">
    <ellipse cx="60" cy="65" rx="36" ry="38" fill="#4B96FF"/>
    <ellipse cx="60" cy="72" rx="26" ry="26" fill="#D3E8FF"/>
    <ellipse cx="48" cy="103" rx="8" ry="4" fill="#FFB703"/>
    <ellipse cx="72" cy="103" rx="8" ry="4" fill="#FFB703"/>
    <path d="M60 27C56 16,52 14,48 18C52 24,56 26,60 28Z" fill="#2E79E6"/>
    <path d="M63 26C66 14,71 13,74 18C70 24,66 26,63 28Z" fill="#3A86FF"/>
    <circle cx="50" cy="52" r="7" fill="#FFF"/><circle cx="51" cy="52" r="4.5" fill="#1E293B"/><circle cx="53" cy="50" r="1.8" fill="#FFF"/>
    <circle cx="70" cy="52" r="7" fill="#FFF"/><circle cx="69" cy="52" r="4.5" fill="#1E293B"/><circle cx="71" cy="50" r="1.8" fill="#FFF"/>
    <ellipse cx="43" cy="61" rx="4.5" ry="2.5" fill="#FF9EAA" opacity=".7"/>
    <ellipse cx="77" cy="61" rx="4.5" ry="2.5" fill="#FF9EAA" opacity=".7"/>
    <path d="M57 58L63 58L60 65Z" fill="#FB8500"/>
    <ellipse cx="28" cy="65" rx="9" ry="18" fill="#2E79E6" transform="rotate(15 28 65)"/>
    <ellipse cx="92" cy="65" rx="9" ry="18" fill="#2E79E6" transform="rotate(-15 92 65)"/>
    <path d="M44 68L60 74L76 68L74 86L60 89L46 86Z" fill="#EF4444"/>
  </svg>
));

const HappyLionIcon = memo(() => (
  <svg viewBox="0 0 140 140" className="w-28 h-28 select-none drop-shadow-md hover:scale-105 transition-transform duration-300">
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((d,i)=>(<circle key={i} cx={70+44*Math.cos(d*Math.PI/180)} cy={70+44*Math.sin(d*Math.PI/180)} r="17" fill={i%2===0?'#FDBA74':'#F59E0B'}/>))}
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
    <circle cx="102" cy="28" r="6" fill="#FFF"/><circle cx="103" cy="28" r="3.5" fill="#1E293B"/>
    <rect x="52" y="112" width="14" height="20" rx="7" fill="#65A30D"/>
    <rect x="80" y="112" width="14" height="20" rx="7" fill="#65A30D"/>
  </svg>
));

const TobyTurtleIcon = memo(({ className = "w-32 h-36" }) => (
  <svg viewBox="0 0 160 180" className={className + " select-none drop-shadow-md"}>
    <ellipse cx="80" cy="100" rx="48" ry="42" fill="#22C55E"/>
    <ellipse cx="80" cy="98" rx="42" ry="36" fill="#4ADE80" stroke="#15803D" strokeWidth="3"/>
    <circle cx="80" cy="54" r="26" fill="#86EFAC" stroke="#16A34A" strokeWidth="2"/>
    <circle cx="70" cy="50" r="4.5" fill="#0F172A"/><circle cx="90" cy="50" r="4.5" fill="#0F172A"/>
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
    <circle cx="70" cy="48" r="11" fill="#FB923C"/>
    <circle cx="67" cy="46" r="1.5" fill="#000"/><circle cx="73" cy="46" r="1.5" fill="#000"/>
    <rect x="30" y="62" width="80" height="30" rx="8" fill="#EF4444"/>
    <rect x="36" y="65" width="68" height="12" rx="3" fill="#FEF08A" opacity=".8"/>
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
  </svg>
));

// ─── PROFILES ─────────────────────────────────────────────────────────────────
const AVATARS = [
  { id: 'rex', emoji: '\u{1F98A}', color: '#F59E0B' },
  { id: 'leo', emoji: '\u{1F981}', color: '#EF4444' },
  { id: 'toby', emoji: '\u{1F422}', color: '#22C55E' },
  { id: 'owl', emoji: '\u{1F989}', color: '#7C3AED' },
  { id: 'bear', emoji: '\u{1F43B}', color: '#92400E' },
  { id: 'bird', emoji: '\u{1F426}', color: '#3B82F6' },
  { id: 'cat', emoji: '\u{1F431}', color: '#EC4899' },
  { id: 'dino', emoji: '\u{1F996}', color: '#10B981' },
];

const GIFTS = [
  { id: 'cake', emoji: '\u{1F370}', name: 'Strawberry Cake', cost: 50, category: 'food' },
  { id: 'icecream', emoji: '\u{1F366}', name: 'Ice Cream Cone', cost: 30, category: 'food' },
  { id: 'candy', emoji: '\u{1F36C}', name: 'Candy Pack', cost: 20, category: 'food' },
  { id: 'juice', emoji: '\u{1F9C3}', name: 'Fresh Juice', cost: 25, category: 'food' },
  { id: 'rocket', emoji: '\u{1F680}', name: 'Space Rocket', cost: 80, category: 'toy' },
  { id: 'robot', emoji: '\u{1F916}', name: 'Robot Friend', cost: 100, category: 'toy' },
  { id: 'ball', emoji: '\u{2B50}', name: 'Golden Star Ball', cost: 40, category: 'toy' },
  { id: 'teddy', emoji: '\u{1F9F8}', name: 'Teddy Bear', cost: 60, category: 'toy' },
  { id: 'crown', emoji: '\u{1F451}', name: 'Royal Crown', cost: 120, category: 'special' },
  { id: 'diamond', emoji: '\u{1F48E}', name: 'Magic Diamond', cost: 150, category: 'special' },
  { id: 'trophy', emoji: '\u{1F3C6}', name: 'Champion Trophy', cost: 200, category: 'special' },
  { id: 'rainbow', emoji: '\u{1F308}', name: 'Rainbow Wings', cost: 90, category: 'special' },
];

const BADGES = [
  { id: 'first-step', name: 'First Steps', icon: '\u{1F463}', desc: 'Complete your first quiz', requirement: 1 },
  { id: 'star-10', name: 'Star Collector', icon: '\u{2B50}', desc: 'Earn 10 stars', requirement: 10 },
  { id: 'star-50', name: 'Star Master', icon: '\u{1F31F}', desc: 'Earn 50 stars', requirement: 50 },
  { id: 'star-100', name: 'Star Legend', icon: '\u{1F30C}', desc: 'Earn 100 stars', requirement: 100 },
  { id: 'quiz-5', name: 'Quiz Kid', icon: '\u{1F9E0}', desc: 'Complete 5 quizzes', requirement: 5 },
  { id: 'quiz-20', name: 'Quiz Champion', icon: '\u{1F3C6}', desc: 'Complete 20 quizzes', requirement: 20 },
  { id: 'streak-3', name: 'On Fire', icon: '\u{1F525}', desc: '3 day streak', requirement: 3 },
  { id: 'gift-1', name: 'Gift Hunter', icon: '\u{1F381}', desc: 'Get your first gift', requirement: 1 },
];

function loadProfiles() { try { return JSON.parse(localStorage.getItem('kidplay_profiles') || '[]'); } catch { return []; } }
function saveProfiles(p) { localStorage.setItem('kidplay_profiles', JSON.stringify(p)); }
function loadActiveProfile() { try { return JSON.parse(localStorage.getItem('kidplay_active_profile') || 'null'); } catch { return null; } }
function saveActiveProfile(id) { localStorage.setItem('kidplay_active_profile', JSON.stringify(id)); }
function loadUnlockedGifts() { try { return JSON.parse(localStorage.getItem('kidplay_gifts') || '[]'); } catch { return []; } }
function saveUnlockedGifts(g) { localStorage.setItem('kidplay_gifts', JSON.stringify(g)); }
function loadCompletedQuizzes() { try { return parseInt(localStorage.getItem('kidplay_quiz_count') || '0'); } catch { return 0; } }
function saveCompletedQuizzes(n) { localStorage.setItem('kidplay_quiz_count', String(n)); }

// ─── TOAST ────────────────────────────────────────────────────────────────────
const Toast = memo(({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, []);
  const bg = type === 'celebrate' ? 'from-green-400 to-emerald-500' : type === 'error' ? 'from-red-400 to-rose-500' : 'from-blue-400 to-indigo-500';
  const icon = type === 'celebrate' ? '\u{1F389}' : type === 'error' ? '\u{274C}' : '\u{2139}\u{FE0F}';
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-slideup">
      <div className={\`kid-btn flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r \${bg} text-white font-bold shadow-xl\`}>
        <span className="text-xl">{icon}</span>
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
});

// ─── CREATE PROFILE ───────────────────────────────────────────────────────────
const CreateProfileScreen = memo(({ onDone }) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('G3');
  const [avatarIdx, setAvatarIdx] = useState(0);
  const handleCreate = () => {
    if (!name.trim()) return;
    const profiles = loadProfiles();
    const p = { id: 'p-' + Date.now(), name: name.trim(), grade, avatar: AVATARS[avatarIdx], coins: 50, streak: 0, stars: 0, quizzesCompleted: 0, createdAt: Date.now() };
    profiles.push(p);
    saveProfiles(profiles);
    saveActiveProfile(p.id);
    playSfx('celebrate');
    speak('Welcome ' + p.name + '! Let us learn and play!');
    onDone(p);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <KidStyles />
      <div className="bg-white/95 backdrop-blur rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-bouncein">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2 animate-kb">{'\u{1F31F}'}</div>
          <h1 className="text-2xl font-black" style={{ color: '#6B21A8' }}>Create Your Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Who is learning today?</p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {AVATARS.map((av, i) => (
            <button key={av.id} onClick={() => { setAvatarIdx(i); playSfx('pop'); }}
              className={\`w-14 h-14 rounded-2xl text-2xl flex items-center justify-center transition-all \${i === avatarIdx ? 'ring-4 scale-110 shadow-lg' : 'opacity-60 hover:opacity-100 hover:scale-105'}\`}
              style={{ background: av.color + '20', '--tw-ring-color': av.color }}>
              {av.emoji}
            </button>
          ))}
        </div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name..."
          className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none text-center text-lg font-semibold mb-4 transition-colors" maxLength={20}
          onKeyDown={e => e.key === 'Enter' && handleCreate()} />
        <div className="mb-6">
          <p className="text-xs text-gray-400 text-center mb-2 font-medium">Your grade</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {GRADES.map(g => (
              <button key={g.id} onClick={() => { setGrade(g.id); playSfx('click'); }}
                className={\`px-3 py-1.5 rounded-full text-xs font-bold transition-all \${grade === g.id ? 'text-white shadow-md scale-105' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}\`}
                style={grade === g.id ? { background: g.color } : {}}>
                {g.label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleCreate} disabled={!name.trim()}
          className="kid-btn w-full py-3.5 rounded-2xl text-white font-black text-lg disabled:opacity-40 animate-glow"
          style={{ background: name.trim() ? 'linear-gradient(135deg, ' + AVATARS[avatarIdx].color + ', ' + AVATARS[avatarIdx].color + 'cc)' : '#ccc' }}>
          {'\u{1F680}'} Let's Go!
        </button>
      </div>
    </div>
  );
});
`);
fs.writeFileSync(out, parts.join(''), 'utf8');
console.log('Part 1 written: ' + parts[0].split('\n').length + ' lines');
