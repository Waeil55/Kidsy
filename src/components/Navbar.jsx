import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Bot, 
  Settings, 
  BookOpen, 
  Calculator, 
  Atom, 
  FolderHeart, 
  Edit3, 
  Target, 
  Keyboard 
} from 'lucide-react';
import { playPop } from '../utils/audio';

export default function Navbar({
  activeSubject,
  onSelectSubject,
  activeTab,
  onSelectTab,
  streak,
  onOpenChat,
  onOpenParent,
  customCount = 0
}) {
  const subjects = [
    { id: 'english', label: 'Vocab', icon: BookOpen, color: 'text-tealsoft-600', activeBg: 'bg-tealsoft-600 text-white' },
    { id: 'math', label: 'Math', icon: Calculator, color: 'text-rosebloom-600', activeBg: 'bg-rosebloom-600 text-white' },
    { id: 'science', label: 'Science', icon: Atom, color: 'text-emerald-600', activeBg: 'bg-emerald-600 text-white' },
    { id: 'custom', label: 'My Cards', icon: FolderHeart, badge: customCount, color: 'text-purple-600', activeBg: 'bg-purple-600 text-white' },
  ];

  const tabs = [
    { id: 'study', label: 'Study', icon: BookOpen },
    { id: 'sentences', label: 'Context', icon: Edit3 },
    { id: 'quiz', label: 'Match', icon: Target },
    { id: 'spell', label: 'Spell & Solve', icon: Keyboard },
  ];

  return (
    <header className="shrink-0 z-30 bg-white/95 backdrop-blur-md border-b border-rosebloom-100/80 shadow-xs">
      {/* Top Brand & Actions Bar */}
      <div className="max-w-4xl mx-auto px-4 pt-3 pb-2 flex items-center justify-between gap-2">
        
        {/* Logo & Grade Badge */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl p-0.5 bg-gradient-to-tr from-tealsoft-500 via-rosebloom-400 to-emerald-400 shadow-sm shrink-0">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-rosebloom-500" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-slate-900 leading-none">
                Merola<span className="text-gradient-rose">App</span>
              </h1>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-rosebloom-50 text-rosebloom-700 border border-rosebloom-200/80 hidden sm:inline-block">
                Grade 3
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5 leading-none">
              Gamified Super Tutor
            </p>
          </div>
        </div>

        {/* Right Action Badges: Streak, AI Tutor, Parent Portal */}
        <div className="flex items-center gap-2">
          
          {/* Streak Flame Container */}
          <div 
            id="streak-container"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200/90 shadow-xs transition-transform duration-200"
            title="Current Answer Streak"
          >
            <Flame id="streak-icon" className="w-4 h-4 text-orange-500 animate-pulse drop-shadow-sm" />
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] font-bold text-amber-700 uppercase leading-none">Streak</span>
              <span id="streak-counter" className="text-sm font-black text-amber-900 leading-none">{streak}</span>
            </div>
          </div>

          {/* AI Chat Button */}
          <button
            onClick={() => { playPop(); onOpenChat(); }}
            className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 btn-press"
            title="Ask AI Super Tutor"
          >
            <Bot className="w-4 h-4 animate-bounce" />
            <span className="hidden sm:inline">AI Tutor</span>
          </button>

          {/* Parent Studio Button */}
          <button
            onClick={() => { playPop(); onOpenParent(); }}
            className="px-2.5 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200/80 flex items-center gap-1.5 btn-press transition-colors"
            title="Parent Studio (Upload & Camera)"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Parent</span>
          </button>
        </div>
      </div>

      {/* Subject Selector Bar */}
      <div className="max-w-4xl mx-auto px-4 py-1.5 border-t border-slate-100 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 sm:gap-2">
          {subjects.map((sub) => {
            const Icon = sub.icon;
            const isActive = activeSubject === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => { playPop(); onSelectSubject(sub.id); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all btn-press shrink-0 ${
                  isActive 
                    ? `${sub.activeBg} shadow-sm scale-[1.02]` 
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : sub.color}`} />
                <span>{sub.label}</span>
                {sub.badge !== undefined && sub.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isActive ? 'bg-white text-purple-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {sub.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <span className="text-[11px] font-bold text-slate-400 capitalize hidden md:inline-block">
          Active: {activeSubject}
        </span>
      </div>

      {/* Game Mode Tabs */}
      <nav className="max-w-4xl mx-auto px-4 py-1.5 bg-slate-50/80 border-t border-slate-100 overflow-x-auto no-scrollbar">
        <div className="flex gap-1.5 sm:gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { playPop(); onSelectTab(tab.id); }}
                className={`flex-1 min-w-[76px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all btn-press ${
                  isActive
                    ? 'bg-white text-rosebloom-700 shadow-sm border border-rosebloom-200/70 scale-[1.01]'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rosebloom-500' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
