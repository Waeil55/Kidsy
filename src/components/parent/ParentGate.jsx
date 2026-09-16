import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { playCorrect } from '../../utils/audio';
import { getParentPin } from '../../utils/storage';

export default function ParentGate({ onUnlock }) {
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  const handleUnlock = (e) => {
    e.preventDefault();
    const correctPin = getParentPin();
    if (pinInput.trim() === correctPin || pinInput.trim() === "1234") {
      setPinError("");
      playCorrect();
      onUnlock();
    } else {
      setPinError("Incorrect PIN. (Default is 1234)");
    }
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center text-center my-auto">
      <div className="w-16 h-16 rounded-3xl bg-tealsoft-50 border border-tealsoft-200 flex items-center justify-center mb-4 text-tealsoft-600 shadow-sm">
        <Lock className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-1">Parent Security Gate</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-6 font-medium leading-relaxed">
        Please enter the 4-digit Parent PIN to open camera extraction and card controls.
      </p>

      <form onSubmit={handleUnlock} className="w-full max-w-xs flex flex-col gap-3">
        <input
          type="password"
          maxLength={8}
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value)}
          placeholder="Enter PIN (Default: 1234)"
          className="w-full text-center tracking-widest text-2xl font-black py-3 px-4 rounded-2xl border-2 border-slate-200 focus:border-tealsoft-500 focus:ring-4 focus:ring-tealsoft-100 outline-none"
          autoFocus
        />
        {pinError && <p className="text-xs font-bold text-rose-500">{pinError}</p>}
        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-tealsoft-600 hover:bg-tealsoft-700 text-white font-black text-base shadow-md btn-press transition-all"
        >
          Unlock Studio
        </button>
      </form>
    </div>
  );
}
