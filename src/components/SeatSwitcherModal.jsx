import React from 'react';
import { Users, Check } from 'lucide-react';
import { playPop, triggerAudioTone, speakText } from '../utils/audio';

export default function SeatSwitcherModal({
  isOpen,
  onClose,
  activeSeat,
  setActiveSeat
}) {
  if (!isOpen) return null;

  const seats = [
    { id: 'seat-1', seatNum: '01', name: 'Merola [STUDENT_4082]', emoji: '🦊', cohort: 'COHORT_ALPHA' },
    { id: 'seat-2', seatNum: '02', name: 'Leo [STUDENT_8190]', emoji: '🐼', cohort: 'COHORT_BETA' },
    { id: 'seat-3', seatNum: '03', name: 'Joy [STUDENT_9312]', emoji: '🦄', cohort: 'COHORT_GAMMA' },
  ];

  const handleSelectSeat = (s) => {
    playPop();
    triggerAudioTone('success');
    setActiveSeat(s);
    speakText(`Welcome back, ${s.name.split(' ')[0]}!`, 1.1, 1.25);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xs w-full p-5 shadow-2xl border-2 border-indigo-200 dark:border-indigo-800 text-slate-900 dark:text-white pop">
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="font-fredoka font-bold text-base">Multi-Seat Switcher</h3>
          </div>
          <button 
            onClick={() => { playPop(); onClose(); }}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-fredoka">
          Select enrolled student seat profile:
        </p>

        <div className="space-y-2 mb-4">
          {seats.map((s) => {
            const isActive = activeSeat.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => handleSelectSeat(s)}
                className={`w-full p-2.5 rounded-2xl border flex items-center justify-between font-fredoka text-xs transition-all squish-btn ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                  <span className="text-xl">{s.emoji}</span>
                  <div className="text-left">
                    <span className="block leading-tight">{s.name}</span>
                    <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-normal">
                      Seat {s.seatNum} • {s.cohort}
                    </span>
                  </div>
                </div>
                {isActive ? (
                  <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">Switch</span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => { playPop(); onClose(); }}
          className="w-full py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-fredoka font-bold text-xs btn-press"
        >
          Close
        </button>

      </div>
    </div>
  );
}
