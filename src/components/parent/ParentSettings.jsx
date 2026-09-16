import React, { useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { getGeminiApiKey, setGeminiApiKey, setParentPin } from '../../utils/storage';
import { playCorrect } from '../../utils/audio';

export default function ParentSettings() {
  const [apiKey, setApiKey] = useState(getGeminiApiKey());
  const [newPin, setNewPin] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    setGeminiApiKey(apiKey);
    if (newPin.trim().length >= 4) {
      setParentPin(newPin.trim());
    }
    playCorrect();
    setSuccessMsg("Settings saved successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-purple-900 text-xs">
        <p className="font-extrabold flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-600" />
          Gemini Vision & Super Tutor AI Integration
        </p>
        <p className="mt-0.5 text-slate-600 leading-relaxed font-medium">
          Enter your Google Gemini API Key below to activate live AI camera OCR extraction and conversational Super Tutor chat. (If empty, MerolaApp works offline with smart built-in hints!)
        </p>
      </div>

      <div>
        <label className="block text-xs font-black text-slate-700 mb-1">Gemini API Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="AIzaSy..."
          className="w-full py-2.5 px-3 rounded-xl border-2 border-slate-200 font-mono text-xs outline-none focus:border-purple-500"
        />
        <p className="text-[11px] text-slate-400 mt-1">Get a free key from Google AI Studio (aistudio.google.com)</p>
      </div>

      <div>
        <label className="block text-xs font-black text-slate-700 mb-1">Change Parent 4-Digit PIN</label>
        <input
          type="text"
          maxLength={8}
          value={newPin}
          onChange={(e) => setNewPin(e.target.value)}
          placeholder="Enter new PIN (e.g. 5678)"
          className="w-full py-2.5 px-3 rounded-xl border-2 border-slate-200 font-mono text-sm outline-none focus:border-purple-500"
        />
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 pop">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <button
        type="submit"
        className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-md btn-press transition-all"
      >
        Save Settings
      </button>
    </form>
  );
}
