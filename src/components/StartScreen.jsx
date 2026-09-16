import React from 'react';
import { Rocket, Sparkles, BookOpen, Calculator, Atom, HeartHandshake } from 'lucide-react';

export default function StartScreen({ onStart }) {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-4">
      {/* Background Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-tealsoft-300/30 via-rosebloom-400/25 to-emerald-300/20 rounded-full blur-3xl -z-10 pointer-events-none animate-float-slow" />

      <div className="relative glass-card-light rounded-3xl p-6 sm:p-8 max-w-md w-full text-center border border-rosebloom-200/80 shadow-2xl shadow-rosebloom-500/10 pop">
        
        {/* Signature Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-rosebloom-200/80 bg-white/90 shadow-sm mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-rosebloom-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 tracking-wide">
            Grade 3 Learning Adventure
          </span>
          <span className="text-[10px] bg-rosebloom-100 text-rosebloom-700 font-mono font-extrabold px-2 py-0.5 rounded-full border border-rosebloom-200">
            PRO
          </span>
        </div>

        {/* Hero Icon */}
        <div className="relative w-24 h-24 mx-auto mb-5 rounded-3xl bg-gradient-to-tr from-tealsoft-500 via-rosebloom-400 to-emerald-400 p-1 shadow-glow-rose">
          <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center shadow-inner">
            <Rocket className="w-12 h-12 text-rosebloom-500 animate-bounce" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tealsoft-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-tealsoft-500"></span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-900 mb-2">
          Welcome to <span className="text-gradient-rose">MerolaApp</span>!
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-medium mb-6 leading-relaxed">
          Master Grade 3 <strong className="text-tealsoft-700">Vocabulary</strong>, <strong className="text-rosebloom-600">Math</strong>, and <strong className="text-emerald-700">Science</strong> with sound, voice, and fun AI tutoring!
        </p>

        {/* Subject previews */}
        <div className="grid grid-cols-3 gap-2.5 mb-7 text-xs font-bold">
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-tealsoft-50/80 border border-tealsoft-200 text-tealsoft-700">
            <BookOpen className="w-5 h-5 text-tealsoft-600" />
            <span>Vocab</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-rosebloom-50/80 border border-rosebloom-200 text-rosebloom-700">
            <Calculator className="w-5 h-5 text-rosebloom-600" />
            <span>Math</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-700">
            <Atom className="w-5 h-5 text-emerald-600" />
            <span>Science</span>
          </div>
        </div>

        {/* Luxury Start Button */}
        <button
          onClick={onStart}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-tealsoft-600 via-tealsoft-500 to-emerald-600 hover:from-tealsoft-500 hover:to-emerald-500 text-white font-black text-lg shadow-lg shadow-tealsoft-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 btn-press group"
        >
          <Sparkles className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
          <span>START LEARNING!</span>
        </button>

        <p className="mt-4 text-[11px] text-slate-400 font-medium">
          Parents can take photos of worksheets or upload files anytime in Parent Studio!
        </p>
      </div>
    </div>
  );
}
