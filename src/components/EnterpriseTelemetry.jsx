import React from 'react';
import { Flame, TrendingUp, Award, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function EnterpriseTelemetry({
  stats = {},
  telemetryLogs = [],
  activeStudentName = "Merola",
  cohort = "Grade 3",
  score = 100,
  penalties = 0,
  onResetStats
}) {
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIdx = new Date().getDay(); // 0 = Sun

  const competencies = [
    { label: 'Phonics & Spelling', pct: 94, color: 'bg-duo-green' },
    { label: 'Vocabulary & Definitions', pct: 90, color: 'bg-duo-blue' },
    { label: 'Sentence Syntax & Grammar', pct: 86, color: 'bg-duo-purple' },
    { label: 'Speech & Pronunciation', pct: 92, color: 'bg-duo-orange' },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar py-2 px-4 max-w-lg mx-auto w-full select-none">
      
      {/* Header */}
      <div className="mb-3">
        <h2 className="font-fredoka font-bold text-xl sm:text-2xl text-duo-gray-800 leading-tight">
          Learning Progress
        </h2>
        <p className="text-xs sm:text-sm font-fredoka text-duo-gray-500 mt-0.5">
          Student: <strong className="text-duo-blueDark">{activeStudentName}</strong> • {cohort}
        </p>
      </div>

      {/* Streak Calendar Card (Duolingo Iconic Style) */}
      <div className="duo-card p-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-duo-orangeLight flex items-center justify-center text-duo-orange">
              <Flame className="w-6 h-6 fill-current animate-pulse" />
            </div>
            <div>
              <h3 className="font-fredoka font-bold text-base text-duo-gray-800 leading-tight">
                {stats.streak || 5} Day Streak!
              </h3>
              <p className="text-xs font-fredoka text-duo-gray-500">Practice every day to keep it lit!</p>
            </div>
          </div>
          <span className="text-xs font-fredoka font-bold text-duo-orange bg-duo-orangeLight px-2 py-0.5 rounded-lg">
            Active
          </span>
        </div>

        {/* Days of Week Stepper */}
        <div className="grid grid-cols-7 gap-1.5 pt-2 border-t-2 border-duo-gray-100">
          {daysOfWeek.map((d, i) => {
            const isCompleted = i <= 4; // Simulated past active days
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-fredoka font-bold text-duo-gray-400">{d}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-fredoka text-xs font-bold ${
                  isCompleted 
                    ? 'bg-duo-orange text-white' 
                    : 'bg-duo-gray-100 text-duo-gray-400'
                }`}>
                  {isCompleted ? '✓' : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <div className="duo-card p-3 text-left">
          <span className="text-[10px] font-fredoka font-bold uppercase text-duo-gray-400 block">
            Accuracy Rate
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-fredoka font-bold text-2xl text-duo-greenDark">95.2%</span>
            <span className="text-[10px] font-fredoka text-duo-green font-bold flex items-center">
              <TrendingUp className="w-3 h-3 inline" /> +3%
            </span>
          </div>
          <p className="text-[10px] text-duo-gray-400 font-fredoka mt-0.5">Total answers: 148</p>
        </div>

        <div className="duo-card p-3 text-left">
          <span className="text-[10px] font-fredoka font-bold uppercase text-duo-gray-400 block">
            Mastery Score
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-fredoka font-bold text-2xl text-duo-blueDark">{score} XP</span>
          </div>
          <p className="text-[10px] text-duo-gray-400 font-fredoka mt-0.5">Penalties: {penalties}</p>
        </div>
      </div>

      {/* Competency Mastery Bars */}
      <div className="duo-card p-4 my-auto">
        <h3 className="font-fredoka font-bold text-sm text-duo-gray-800 mb-3">
          Skill Mastery Competencies
        </h3>
        <div className="space-y-3">
          {competencies.map((comp) => (
            <div key={comp.label}>
              <div className="flex justify-between text-xs font-fredoka font-bold mb-1">
                <span className="text-duo-gray-700">{comp.label}</span>
                <span className="text-duo-gray-500">{comp.pct}%</span>
              </div>
              <div className="w-full h-3 bg-duo-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${comp.color} rounded-full transition-all duration-700`}
                  style={{ width: `${comp.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
