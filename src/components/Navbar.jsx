import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Bot, 
  Settings, 
  BookOpen, 
  Calculator, 
  Atom, 
  Globe2, 
  FolderHeart, 
  Edit3, 
  Target, 
  Keyboard,
  Star,
  ArrowLeftRight,
  ShieldCheck,
  Wifi,
  Map,
  GraduationCap,
  BarChart3,
  Smile,
  Users
} from 'lucide-react';
import { playPop } from '../utils/audio';

export default function Navbar({
  activeSubject,
  onSelectSubject,
  activeTab,
  onSelectTab,
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  streak = 0,
  score = 100,
  gems = 450,
  activeSeat = { seatNum: '01', name: 'Merola [STUDENT_4082]', emoji: '🦊', cohort: 'COHORT_ALPHA' },
  onOpenSeatSwitcher,
  onOpenEducatorGate,
  onOpenChat,
  customCount = 0
}) {
  const subjects = [
    { id: 'week5', label: '⭐ Week 5', icon: Star, active: 'bg-gradient-to-r from-amber-500 via-rosebloom-500 to-purple-600 text-white shadow-squish-orange' },
    { id: 'english', label: 'Vocab', icon: BookOpen, active: 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-squish-emerald' },
    { id: 'math', label: 'Math', icon: Calculator, active: 'bg-gradient-to-r from-rosebloom-500 to-pink-600 text-white shadow-squish-pink' },
    { id: 'science', label: 'Science', icon: Atom, active: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-squish-emerald' },
    { id: 'social', label: 'Social', icon: Globe2, active: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-squish-orange' },
    { id: 'custom', label: 'My Cards', icon: FolderHeart, badge: customCount, active: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-squish-purple' },
  ];

  const mainPages = [
    { id: 'journey', label: 'Journey', icon: Map, color: 'text-indigo-600' },
    { id: 'assessments', label: 'Exams', icon: GraduationCap, color: 'text-purple-600' },
    { id: 'telemetry', label: 'Telemetry', icon: BarChart3, color: 'text-emerald-600' },
    { id: 'companion', label: 'Pal', icon: Smile, color: 'text-pink-600' },
    { id: 'study', label: 'Study', icon: BookOpen, color: 'text-teal-600' },
  ];

  return (
    <header className="shrink-0 z-30 bg-white/95 dark:bg-kid-nightCard/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      
      {/* 1. Dynamic Island & Institutional Status Bar */}
      <div className="max-w-4xl mx-auto px-3 pt-1 pb-0.5 flex justify-between items-center text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-1 text-[10px] font-fredoka font-semibold">
          <span>09:41</span>
          <span className="px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
            CAMPUS-A
          </span>
        </div>

        {/* Dynamic Island Pill */}
        <div 
          onClick={() => { playPop(); onOpenEducatorGate(); }}
          className="cursor-pointer flex items-center gap-1.5 bg-slate-950 text-white px-3 py-0.5 rounded-full text-[10px] font-fredoka shadow-md hover:scale-105 transition active:scale-95 border border-slate-800"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>MerolaApp Enterprise OS ⚡</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Wifi className="w-3 h-3 text-slate-600 dark:text-slate-300" />
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
        </div>
      </div>

      {/* 2. Multi-Seat Profile Selector & Live Score HUD */}
      <div className="max-w-4xl mx-auto px-3 py-1.5 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
        
        {/* Multi-Seat Profile Selector Trigger */}
        <div 
          onClick={() => { playPop(); onOpenSeatSwitcher(); }}
          className="flex items-center gap-2 cursor-pointer squish-btn"
          title="Switch Student Seat"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-xs">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center text-lg">
                <span>{activeSeat.emoji || '🦊'}</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white font-fredoka text-[8px] font-bold px-1 rounded-full border border-white dark:border-slate-900">
              S{activeSeat.seatNum || '01'}
            </div>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1">
              <span className="font-fredoka font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight truncate max-w-[130px] sm:max-w-[180px]">
                {activeSeat.name}
              </span>
              <span className="text-[9px] text-indigo-500">▼</span>
            </div>
            <span className="text-[9px] text-slate-400 font-fredoka block leading-none">
              Cohort: <strong className="text-indigo-600 dark:text-indigo-400">{activeSeat.cohort || 'ALPHA'}</strong>
            </span>
          </div>
        </div>

        {/* Live Score HUD & Governance Gate */}
        <div className="flex items-center gap-1.5">
          
          {/* Live Score Pill with Animated Delta Float */}
          <div className="relative flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-xl shadow-inner">
            <span className="text-xs">🏆</span>
            <div className="flex flex-col leading-none">
              <span className="text-[7px] font-fredoka font-bold uppercase text-indigo-500">Score</span>
              <span id="live-hud-score" className="font-fredoka font-bold text-xs text-indigo-950 dark:text-indigo-200">
                {score}
              </span>
            </div>
            <span 
              id="hud-delta-chip" 
              className="absolute -top-3 -right-2 font-fredoka text-[10px] font-bold px-1.5 py-0.2 rounded-full opacity-0 pointer-events-none transition-all duration-300 shadow-md"
            >
              -1
            </span>
          </div>

          {/* Star Gem Currency */}
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-xl">
            <span className="text-xs">💎</span>
            <span className="font-fredoka font-bold text-xs text-amber-900 dark:text-amber-300">
              {gems}
            </span>
          </div>

          {/* Streak Flame */}
          <div 
            id="streak-container"
            className="flex items-center gap-1 px-2 py-0.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-300"
          >
            <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <span className="text-xs font-fredoka font-bold">{streak}</span>
          </div>

          {/* AI Tutor */}
          <button
            onClick={() => { playPop(); onOpenChat(); }}
            className="p-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-fredoka text-xs font-bold shadow-xs btn-press"
            title="Ask AI Super Tutor"
          >
            <Bot className="w-3.5 h-3.5" />
          </button>

          {/* Educator Institutional Gate */}
          <button
            onClick={() => { playPop(); onOpenEducatorGate(); }}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 btn-press"
            title="Institutional Governance Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 3. Colorful Subject Row */}
      <div className="max-w-4xl mx-auto px-2 py-1 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {subjects.map((sub) => {
          const Icon = sub.icon;
          const isActive = activeSubject === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => { playPop(); onSelectSubject(sub.id); }}
              className={`flex-1 min-w-[72px] py-1 px-2 rounded-xl text-xs font-fredoka font-bold flex items-center justify-center gap-1 transition-all squish-btn shrink-0 ${
                isActive 
                  ? `${sub.active} scale-[1.02]` 
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sub.label}</span>
              {sub.badge !== undefined && sub.badge > 0 && (
                <span className="text-[9px] px-1 rounded-full bg-white text-purple-700 font-bold">
                  {sub.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Topic Filter Chips (if categories exist) */}
      {categories.length > 1 && (
        <div className="max-w-4xl mx-auto px-2 py-0.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 overflow-x-auto no-scrollbar bg-slate-50/50 dark:bg-slate-900/40">
          <span className="text-[9px] font-fredoka font-bold text-slate-400 uppercase tracking-wider pl-1 shrink-0">
            Topic:
          </span>
          <button
            onClick={() => { playPop(); onSelectCategory('all'); }}
            className={`px-2 py-0.5 rounded-full text-[10px] font-fredoka font-bold transition-all shrink-0 ${
              selectedCategory === 'all' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { playPop(); onSelectCategory(cat); }}
              className={`px-2 py-0.5 rounded-full text-[10px] font-fredoka font-bold transition-all shrink-0 ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* 4. Enterprise Page & Mode Dock */}
      <nav className="max-w-4xl mx-auto px-2 py-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around gap-1 bg-white dark:bg-kid-nightCard">
        {mainPages.map((page) => {
          const Icon = page.icon;
          const isActive = activeTab === page.id;
          return (
            <button
              key={page.id}
              onClick={() => { playPop(); onSelectTab(page.id); }}
              className={`flex flex-col items-center gap-0.5 px-3 py-0.5 rounded-2xl transition-all squish-btn ${
                isActive 
                  ? 'text-indigo-600 dark:text-indigo-400 scale-105' 
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm ${
                isActive ? 'bg-indigo-100 dark:bg-indigo-950' : ''
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="font-fredoka text-[10px] font-bold">{page.label}</span>
            </button>
          );
        })}
      </nav>

    </header>
  );
}
