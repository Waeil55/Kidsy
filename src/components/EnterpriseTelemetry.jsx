import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  RotateCcw
} from 'lucide-react';
import { playPop } from '../utils/audio';

export default function EnterpriseTelemetry({
  stats = {},
  telemetryLogs = [],
  activeStudentName = "[STUDENT_UID_4082]",
  cohort = "COHORT_ALPHA",
  score = 100,
  penalties = 0,
  onResetStats
}) {
  const totalAttempts = (stats.totalAnswered || 24) + penalties;
  const correctCount = stats.totalCorrect || 22;
  const accuracyRate = totalAttempts > 0 
    ? ((correctCount / totalAttempts) * 100).toFixed(1) 
    : "94.2";

  const defaultLogs = [
    { text: "Spelling Item [WORD_INDEX_A1]", result: "+10 Pts (Success)", isWin: true },
    { text: "Speech Verification [PHONEME_02]", result: "-1 Pt (Penalty)", isWin: false },
    { text: "Sentence Syntax [SYNTAX_05]", result: "+10 Pts (Success)", isWin: true },
    { text: "Synonym Matching [SYN_DIVERSE]", result: "+10 Pts (Success)", isWin: true },
  ];

  const displayLogs = telemetryLogs.length > 0 ? telemetryLogs : defaultLogs;

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between overflow-y-auto no-scrollbar py-1 w-full max-w-lg mx-auto">
      
      {/* Header Info */}
      <div className="flex justify-between items-center px-1 shrink-0 mb-1">
        <span className="text-[10px] font-fredoka font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
          <BarChart3 className="w-3 h-3" />
          <span>Institutional Telemetry & Analytics</span>
        </span>
        <span className="text-[10px] font-fredoka font-bold text-slate-500 dark:text-slate-400">
          Cohort: <strong className="text-indigo-600 dark:text-indigo-400">{cohort}</strong>
        </span>
      </div>

      {/* Telemetry KPI Summary Cards */}
      <div className="grid grid-cols-2 gap-2 shrink-0 my-1">
        <div className="bg-white dark:bg-kid-nightCard p-3 rounded-2xl border border-slate-200 dark:border-kid-nightBorder shadow-xs">
          <span className="text-[10px] font-fredoka text-slate-400 uppercase font-bold block">
            Accuracy Metric
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-fredoka font-bold text-slate-900 dark:text-white">
              {accuracyRate}%
            </span>
            <span className="text-[10px] font-fredoka text-emerald-500 font-bold flex items-center">
              <TrendingUp className="w-3 h-3 inline" /> +3.1%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Total Attempts: {totalAttempts}</p>
        </div>

        <div className="bg-white dark:bg-kid-nightCard p-3 rounded-2xl border border-slate-200 dark:border-kid-nightBorder shadow-xs">
          <span className="text-[10px] font-fredoka text-slate-400 uppercase font-bold block">
            Penalties Deducted
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-fredoka font-bold text-rose-500">
              -{penalties || 1} pt
            </span>
            <span className="text-[10px] font-fredoka text-slate-400">Errors</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Penalty Rate: 4.8%</p>
        </div>
      </div>

      {/* Competency Benchmark Matrix Bars */}
      <div className="bg-white dark:bg-kid-nightCard rounded-3xl p-3.5 shadow-squish-card border-2 border-slate-100 dark:border-kid-nightBorder my-1 shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="font-fredoka font-bold text-sm text-slate-800 dark:text-white">
            Competency Benchmark ({activeStudentName})
          </h4>
          <span className="text-[10px] font-fredoka text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
            Grade 3 Standard
          </span>
        </div>

        <div className="space-y-2 text-xs font-fredoka">
          <div>
            <div className="flex justify-between text-[11px] mb-0.5">
              <span className="text-slate-600 dark:text-slate-300">Phonics & Spelling Mastery</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">92%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: '92%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-0.5">
              <span className="text-slate-600 dark:text-slate-300">Speech & Pronunciation Confidence</span>
              <span className="text-emerald-500 font-bold">88%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '88%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-0.5">
              <span className="text-slate-600 dark:text-slate-300">Syntax & Sentence Architecture</span>
              <span className="text-purple-500 font-bold">84%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: '84%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-0.5">
              <span className="text-slate-600 dark:text-slate-300">Vocabulary & Context Nuance</span>
              <span className="text-amber-500 font-bold">96%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: '96%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Exam Telemetry Log */}
      <div className="bg-white dark:bg-kid-nightCard rounded-3xl p-3 shadow-squish-card border-2 border-slate-100 dark:border-kid-nightBorder my-1 flex-1 min-h-[140px] flex flex-col justify-between">
        <div>
          <h4 className="font-fredoka font-bold text-xs text-slate-800 dark:text-white mb-2 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span>Live Audit Session Stream</span>
          </h4>
          <div className="space-y-1.5 text-[11px] font-fredoka max-h-36 overflow-y-auto no-scrollbar">
            {displayLogs.slice(0, 6).map((log, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-1.5 truncate pr-2">
                  {log.isWin 
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    : <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  }
                  <span className="text-slate-700 dark:text-slate-300 truncate">{log.text}</span>
                </div>
                <span className={`font-bold shrink-0 ${log.isWin ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {log.result}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800 mt-2">
          <span className="text-[10px] text-slate-400 font-fredoka">Session ID: #EP-40829</span>
          <button
            onClick={() => { playPop(); alert("Telemetry stream exported to institutional storage!"); }}
            className="text-[11px] font-fredoka font-bold text-indigo-600 hover:text-indigo-700 btn-press"
          >
            Export Telemetry Log
          </button>
        </div>
      </div>

    </div>
  );
}
