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
  ArrowLeftRight
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
  streak,
  onOpenChat,
  onOpenParent,
  customCount = 0
}) {
  const subjects = [
    { id: 'week5', label: '⭐ Week 5', icon: Star, color: 'text-amber-500', active: 'bg-gradient-to-r from-amber-500 via-rosebloom-500 to-purple-600 text-white shadow-amber-500/25' },
    { id: 'english', label: 'Vocab', icon: BookOpen, color: 'text-cyan-600', active: 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-teal-500/25' },
    { id: 'math', label: 'Math', icon: Calculator, color: 'text-rose-500', active: 'bg-gradient-to-r from-rosebloom-500 to-pink-600 text-white shadow-rosebloom-500/25' },
    { id: 'science', label: 'Science', icon: Atom, color: 'text-emerald-600', active: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/25' },
    { id: 'social', label: 'Social', icon: Globe2, color: 'text-amber-600', active: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/25' },
    { id: 'custom', label: 'My Cards', icon: FolderHeart, badge: customCount, color: 'text-purple-600', active: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/25' },
  ];

  const tabs = [
    { id: 'study', label: 'Study', icon: BookOpen, color: 'text-teal-600' },
    { id: 'sentences', label: 'Context', icon: Edit3, color: 'text-amber-600' },
    { id: 'synant', label: 'Syn & Ant', icon: ArrowLeftRight, color: 'text-purple-600' },
    { id: 'quiz', label: 'Match', icon: Target, color: 'text-emerald-600' },
    { id: 'spell', label: 'Spell', icon: Keyboard, color: 'text-pink-600' },
  ];

  return (
    <header className="shrink-0 z-30 bg-white/95 backdrop-blur-md border-b border-rosebloom-100/80 shadow-xs">
      {/* Top Header Row */}
      <div className="max-w-4xl mx-auto px-3 py-1.5 flex items-center justify-between gap-2">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl p-0.5 bg-gradient-to-tr from-teal-400 via-rosebloom-400 to-amber-400 shadow-xs shrink-0">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-rosebloom-500" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-black font-display tracking-tight text-slate-900 leading-none">
              Merola<span className="text-gradient-rose">App</span>
            </h1>
            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-rosebloom-100 text-rosebloom-700">
              Grade 3
            </span>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-1.5">
          {/* Streak */}
          <div 
            id="streak-container"
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-900 shadow-xs transition-transform"
          >
            <Flame id="streak-icon" className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <span className="text-xs font-black">{streak}</span>
          </div>

          {/* AI Tutor */}
          <button
            onClick={() => { playPop(); onOpenChat(); }}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 text-white font-bold text-xs shadow-xs flex items-center gap-1 btn-press"
          >
            <Bot className="w-3.5 h-3.5 animate-bounce" />
            <span className="hidden sm:inline">AI Tutor</span>
          </button>

          {/* Parent Studio */}
          <button
            onClick={() => { playPop(); onOpenParent(); }}
            className="p-1.5 sm:px-2 sm:py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-1 btn-press"
            title="Parent Studio"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Parent</span>
          </button>
        </div>
      </div>

      {/* Colorful Subject Row */}
      <div className="max-w-4xl mx-auto px-2 py-1 border-t border-slate-100 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {subjects.map((sub) => {
          const Icon = sub.icon;
          const isActive = activeSubject === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => { playPop(); onSelectSubject(sub.id); }}
              className={`flex-1 min-w-[68px] py-1 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all btn-press shrink-0 shadow-xs ${
                isActive ? `${sub.active} scale-[1.02]` : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sub.label}</span>
              {sub.badge !== undefined && sub.badge > 0 && (
                <span className="text-[9px] px-1 rounded-full bg-white text-purple-700 font-black">
                  {sub.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Topic Filter Chips (if categories exist) */}
      {categories.length > 1 && (
        <div className="max-w-4xl mx-auto px-2 py-1 border-t border-slate-100/80 flex items-center gap-1 overflow-x-auto no-scrollbar bg-slate-50/50">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pl-1 shrink-0">
            Topic:
          </span>
          <button
            onClick={() => { playPop(); onSelectCategory('all'); }}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all shrink-0 ${
              selectedCategory === 'all' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { playPop(); onSelectCategory(cat); }}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all shrink-0 ${
                selectedCategory === cat 
                  ? 'bg-tealsoft-700 text-white shadow-xs' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Game Mode Tabs Row */}
      <nav className="max-w-4xl mx-auto px-2 py-1 border-t border-slate-100 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar bg-white">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { playPop(); onSelectTab(tab.id); }}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all btn-press ${
                isActive 
                  ? 'bg-rosebloom-50 text-rosebloom-700 border-2 border-rosebloom-300 shadow-xs' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rosebloom-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
