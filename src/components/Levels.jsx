import React, { useState } from 'react';
import { LEVELS_PER_GRADE, getLevel, genStory, genMath, gradeName } from '../data/grades.js';
import { levelUnlocked } from '../store/scores.js';

/* 50-level strip for the active grade + level runner modal.
   A level = grade story + smart quiz + grade math. Levels lock in order. */

export function LevelsStrip({ gradeKey, scores, onPlay }) {
  return (
    <div className="pt-2">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-display font-black text-xl text-slate-800">Levels · {gradeName(gradeKey)}</h3>
        <span className="text-xs font-bold text-slate-400">{LEVELS_PER_GRADE} levels, unlock in order</span>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-2 px-1">
        {Array.from({ length: LEVELS_PER_GRADE }, (_, i) => i + 1).map((n) => {
          const done = (scores.grades[gradeKey] && scores.grades[gradeKey].levelsDone.includes(n)) || false;
          const open = levelUnlocked(scores, gradeKey, n);
          return (
            <button
              key={n}
              disabled={!open}
              onClick={() => onPlay(n)}
              className={'w-14 h-14 rounded-2xl font-display font-black text-base shrink-0 transition active:scale-95 flex flex-col items-center justify-center ' + (
                done
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : open
                    ? 'bg-white border-2 border-theme-main text-theme-main shadow-card-3d'
                    : 'bg-slate-100 text-slate-300'
              )}
            >
              {done ? <i className="fa-solid fa-star text-sm"></i> : !open ? <i className="fa-solid fa-lock text-xs"></i> : null}
              <span className="text-[11px] leading-none mt-0.5">{n}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LevelRunner({ gradeKey, levelN, onClose, onComplete }) {
  const [step, setStep] = useState(0); // 0 story, 1 quiz, 2 math, 3 done
  const [picked, setPicked] = useState(null);
  const [mathPicked, setMathPicked] = useState(null);

  if (!levelN) return null;
  const L = getLevel(gradeKey, levelN);
  const story = genStory(gradeKey, L.storyIdx);
  const math = genMath(gradeKey, L.mathIdx);
  const quiz = story.sentenceQuestions[0] || { q: 'What is this story about?', options: ['Fun', 'Sleep', 'Rain'], correct: 0 };

  const finish = () => {
    onComplete({ xp: L.xpReward, stars: 5 });
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex flex-col justify-end">
      <div className="bg-white rounded-t-3xl max-h-[88%] flex flex-col overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-theme-light">
          <div>
            <h3 className="font-display font-black text-slate-800 text-base">Level {L.n} · {gradeName(gradeKey)}</h3>
            <p className="text-xs text-slate-500 font-bold">Read → Quiz → Math · +{L.xpReward} XP</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white text-slate-500 flex items-center justify-center">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="p-5 overflow-y-auto">
          <div className="flex space-x-1.5 mb-4">
            {['Read', 'Quiz', 'Math'].map((s, i) => (
              <div key={s} className={`flex-1 h-1.5 rounded-full ${i < step ? 'bg-emerald-400' : i === step ? 'bg-theme-main' : 'bg-slate-200'}`}></div>
            ))}
          </div>

          {step === 0 && (
            <div>
              <h4 className="font-serif font-black text-lg text-slate-900 mb-2">{story.title}</h4>
              <div className="space-y-3 mb-4">
                {story.paragraphs.map((p, i) => (
                  <p key={i} className="font-serif text-sm text-slate-700 leading-relaxed">{p}</p>
                ))}
              </div>
              <button onClick={() => { setStep(1); setPicked(null); }} className="w-full py-3 bg-theme-main text-white font-display font-black text-sm rounded-2xl active:scale-95 transition">
                I read it — Quiz me!
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="font-display font-black text-slate-800 text-base mb-3">{quiz.q}</p>
              <div className="space-y-2 mb-4">
                {quiz.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setPicked(i)}
                    className={'w-full py-2.5 px-4 text-sm font-bold rounded-2xl border-2 text-left transition ' + (
                      picked === i ? 'border-theme-main bg-theme-light text-slate-900' : 'border-slate-200 bg-white text-slate-700'
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { if (picked !== null) { setStep(2); setMathPicked(null); } }}
                className={'w-full py-3 font-display font-black text-sm rounded-2xl transition ' + (picked === null ? 'bg-slate-200 text-slate-400' : 'bg-theme-main text-white active:scale-95')}
              >
                Next: Math
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">Grade math — your level only</p>
              <p className="font-display font-black text-slate-800 text-xl mb-3">{math.q}</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {math.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setMathPicked(i)}
                    className={'py-3 font-display font-black text-lg rounded-2xl border-2 transition ' + (
                      mathPicked === i ? 'border-theme-main bg-theme-light text-slate-900' : 'border-slate-200 bg-white text-slate-700'
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { if (mathPicked !== null) { setStep(3); finish(); } }}
                className={'w-full py-3 font-display font-black text-sm rounded-2xl transition ' + (mathPicked === null ? 'bg-slate-200 text-slate-400' : 'bg-emerald-500 text-white active:scale-95')}
              >
                Complete Level! 🎉
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="text-6xl mb-3">🏆</div>
              <h4 className="font-display font-black text-xl text-slate-800">Level {L.n} Complete!</h4>
              <p className="text-sm font-bold text-emerald-600">+{L.xpReward} XP · +5 ⭐</p>
              <button onClick={onClose} className="mt-4 px-8 py-3 bg-theme-main text-white font-display font-black text-sm rounded-2xl active:scale-95 transition">
                Awesome!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
