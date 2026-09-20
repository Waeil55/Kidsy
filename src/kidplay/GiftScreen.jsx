import React, { useState, useEffect } from 'react';
import {
  Gift, ArrowLeft, Sparkles, Trophy, Flame, Clock, Lock, Star,
  CheckCircle2, ChevronRight, Play
} from 'lucide-react';
import {
  speakText, playCorrect, playPop, fireConfetti
} from '../utils/audio.js';

const MILESTONES = [
  { q: 10, label: 'Story Starter', emoji: '🧸', color: '#F59E0B' },
  { q: 25, label: 'Word Wizard', emoji: '🧙', color: '#8B5CF6' },
  { q: 40, label: 'Reading Hero', emoji: '🦸', color: '#EF4444' },
  { q: 55, label: 'Super Scholar', emoji: '🎓', color: '#10B981' },
  { q: 70, label: 'Grand Champion', emoji: '👑', color: '#3B82F6' },
];

export default function GiftScreen({ profile, onBack, onNavigate, onFinish }) {
  const [unboxed, setUnboxed] = useState(null);

  const answered = (profile && (profile.answeredQuestions || profile.totalAnswered)) || 0;
  const targetQ = 70;
  const pct = Math.min(100, Math.round((answered / targetQ) * 100));

  const xp = (profile && (profile.xp || profile.coins)) || 0;
  const streak = (profile && profile.streak) || 0;
  const minutes = (profile && (profile.minutes || profile.learningMinutes)) || 0;

  const reached = MILESTONES.filter(m => answered >= m.q);
  const next = MILESTONES.filter(m => answered < m.q)[0] || null;
  const newlyEarned = reached.length;

  const R = 56;
  const CIRC = 2 * Math.PI * RWhereTheBuildLies.webp;

  useEffect(() => {
    if (pct >= 100) {
      fireConfetti(true);
      speakText('Wow! You are a Grand Champion, you earned every single gift!');
    }
  }, [pct]);

  const handleUnbox = () => {
    playCorrect();
    playPop();
    fireConfetti(true);
    setUnboxed(next || MILESTONES[MILESTONES.length - 1]);
    speakText('Yay! You unboxed ' + ((next || MILESTONES[MILESTONES.length - 1]).label) + '!');
    if (onFinish) onFinish({ type: 'gift', badge: (next || MILESTONES[MILESTONES.length - 1]).label, earned: true });
  };

  const ringColor = pct >= 100 ? '#34D399' : '#8B5CF6';

  return (
    <div className="min-h-screen pb-28" style={{ background: 'linear-gradient(180deg, #fffbeb 0%, #fef3c7 50%, #fff7ed 100%)' }}>
      <div className="max-w-md mx-auto px-4 pt-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => { playPop(); onBack(); }}
            className="kid-3d-btn w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 shadow-md">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <Gift size={22} className="text-orange-500" style={{ fill: '#FDBA74' }} /> Gift Box
            </h1>
            <p className="text-xs font-bold text-amber-700/70">Answer questions, earn surprise gifts!</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-black text-gray-700">Your Gift Progress</span>
            <span className="text-sm font-black text-purple-600">{answered}/{targetQ} questions</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-32 h-32 flex-shrink-0" style={{ transform: 'rotate(-90deg)' }}>
              <svg viewBox="0 0 136 136" className="w-full h-full">
                <circle cx="68" cy="68" r={R} fill="none" stroke="#E5E7EB" strokeWidth="12" />
                <circle cx="68" cy="68" r={R} fill="none" stroke={ringColor} strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={CIRC} strokeDashoffset={CIRC - (CIRC * pct) / 100}
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ transform: 'rotate(90deg)' }}>
                <div className="text-3xl">{pct >= 100 ? '🎁' : '🎀'}</div>
                <div className="text-xl font-black text-gray-800">{pct}%</div>
              </div>
            </div>
            <p className="text-sm font-bold text-gray-600 flex-1">
              {next ? (
                <>Answer <span className="text-purple-600 font-black">{next.q - answered}</span> more to unbox <span className="font-black text-gray-800">{next.label} {next.emoji}</span>!</>
              ) : (
                <span className="text-green-600 font-black">All gifts earned! 🎉</span>
              )}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-gray-700 flex items-center gap-1"><Sparkles size={16} className="text-amber-500" /> Milestones</h2>
            <span className="text-xs font-black text-green-600">{reached.length} of {MILESTONES.length} earned</span>
          </div>
          <div className="space-y-3">
            {MILESTONES.map(m => {
              const done = reached.includes(m);
              return (
                <div key={m.q} className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: done ? '#D1FAE5' : '#F3F4F6', border: done ? '3px solid #34D399' : '3px solid #E5E7EB' }}>
                    {done ? <CheckCircle2 size={18} className="text-green-500" /> : m.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={'text-sm font-black ' + (done ? 'text-green-600' : 'text-gray-500')}>{m.label}</span>
                      <span className="text-[10px] font-black text-gray-400">{m.q} Qs</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: (Math.min(100, (answered / m.q) * 100)) + '%', background: m.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {unboxed ? (
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-xl p-6 text-center mb-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 text-7xl flex items-center justify-around flex-wrap">
              <span>🎉</span><span>✨</span><span>🎈</span><span>💫</span><span>⭐</span>
            </div>
            <div className="relative">
              <div className="text-6xl mb-2 animate-kid-bounce">{unboxed.emoji}</div>
              <div className="text-lg font-black text-white">You unboxed the {unboxed.label} Gift!</div>
              <button onClick={() => { playPop(); setUnboxed(null); }} className="kid-3d-btn mt-4 px-5 py-2 rounded-full bg-white text-purple-700 font-black text-sm">
                Wrap it up
              </button>
            </div>
          </div>
        ) : (
          <button onClick={handleUnbox} className="kid-3d-btn w-full py-4 rounded-3xl text-white font-black text-lg mb-4"
            style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' }}>
            <span className="flex items-center justify-center gap-2">
              {next ? <Lock size={18} /> : <Sparkles size={18} />}
              {next ? ('Study Now to Earn It!   ' + next.q + ' Qs') : 'Unbox Your Grand Gift!'}
            </span>
          </button>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl shadow-md p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-500"><Star size={16} style={{ fill: '#F59E0B' }} /><span className="text-[10px] font-black text-gray-400">XP</span></div>
            <div className="text-xl font-black text-gray-800 mt-1">{xp}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-orange-500"><Flame size={16} style={{ fill: '#F97316' }} /><span className="text-[10px] font-black text-gray-400">Streak</span></div>
            <div className="text-xl font-black text-gray-800 mt-1">{streak} days</div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-blue-500"><Clock size={16} /><span className="text-[10px] font-black text-gray-400">Minutes</span></div>
            <div className="text-xl font-black text-gray-800 mt-1">{minutes}</div>
          </div>
        </div>

        {minutes > 0 && (
          <button onClick={() => { playPop(); onNavigate('sayit'); }}
            className="kid-3d-btn w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-green-400 to-teal-500 text-white font-black flex items-center justify-center gap-2">
            <Play size={18} /> Keep Learning, Keep Earning
          </button>
        )}
      </div>
    </div>
  );
}
