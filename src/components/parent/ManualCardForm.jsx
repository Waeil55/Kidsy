import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { playCorrect } from '../../utils/audio';

export default function ManualCardForm({ onAddCard }) {
  const [formSubject, setFormSubject] = useState("english");
  const [formCategory, setFormCategory] = useState("Homework");
  const [formWord, setFormWord] = useState("");
  const [formEmoji, setFormEmoji] = useState("🌟");
  const [formDef, setFormDef] = useState("");
  const [formSentence, setFormSentence] = useState("");
  const [formImgUrl, setFormImgUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formWord.trim() || !formDef.trim()) return;
    playCorrect();

    const newCard = {
      id: `custom-${Date.now()}`,
      subject: formSubject,
      category: formCategory.trim() || "Parent Cards",
      word: formWord.trim().toLowerCase(),
      displayTitle: formWord.trim(),
      definition: formDef.trim(),
      sentences: [formSentence.trim() || `The word is _________.`],
      quizOptions: [formWord.trim().toLowerCase(), "option 2", "option 3", "option 4"],
      image: formEmoji.trim() || "🌟",
      imageUrl: formImgUrl.trim() || null,
      hint: `Hint: ${formDef.trim()}`
    };

    onAddCard(newCard);
    setFormWord("");
    setFormDef("");
    setFormSentence("");
    alert("Card added successfully to deck!");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">Subject</label>
          <select
            value={formSubject}
            onChange={(e) => setFormSubject(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl border-2 border-slate-200 font-bold text-sm outline-none focus:border-tealsoft-500"
          >
            <option value="english">English / Vocab</option>
            <option value="math">Grade 3 Math</option>
            <option value="science">Grade 3 Science</option>
            <option value="custom">General / Custom</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">Topic / Category</label>
          <input
            type="text"
            value={formCategory}
            onChange={(e) => setFormCategory(e.target.value)}
            placeholder="e.g. Chapter 4, Spelling List"
            className="w-full py-2.5 px-3 rounded-xl border-2 border-slate-200 font-bold text-sm outline-none focus:border-tealsoft-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-black text-slate-700 mb-1">Target Word or Answer *</label>
          <input
            type="text"
            required
            value={formWord}
            onChange={(e) => setFormWord(e.target.value)}
            placeholder="e.g. perimeter or 36"
            className="w-full py-2.5 px-3 rounded-xl border-2 border-slate-200 font-bold text-sm outline-none focus:border-tealsoft-500"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">Emoji Icon</label>
          <input
            type="text"
            value={formEmoji}
            onChange={(e) => setFormEmoji(e.target.value)}
            placeholder="⭐"
            className="w-full py-2.5 px-3 rounded-xl border-2 border-slate-200 font-bold text-sm text-center outline-none focus:border-tealsoft-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-black text-slate-700 mb-1">Definition or Explanation *</label>
        <textarea
          required
          rows={2}
          value={formDef}
          onChange={(e) => setFormDef(e.target.value)}
          placeholder="Explain in simple words for a 3rd grader..."
          className="w-full py-2 px-3 rounded-xl border-2 border-slate-200 font-medium text-sm outline-none focus:border-tealsoft-500"
        />
      </div>

      <div>
        <label className="block text-xs font-black text-slate-700 mb-1">
          Example Fill-in Sentence (Use <code className="text-rosebloom-600 font-black">_________</code> for blank)
        </label>
        <input
          type="text"
          value={formSentence}
          onChange={(e) => setFormSentence(e.target.value)}
          placeholder="She felt very _________ to explore the island."
          className="w-full py-2.5 px-3 rounded-xl border-2 border-slate-200 font-medium text-sm outline-none focus:border-tealsoft-500"
        />
      </div>

      <div>
        <label className="block text-xs font-black text-slate-700 mb-1">Optional Image URL</label>
        <input
          type="url"
          value={formImgUrl}
          onChange={(e) => setFormImgUrl(e.target.value)}
          placeholder="https://..."
          className="w-full py-2.5 px-3 rounded-xl border-2 border-slate-200 text-xs outline-none focus:border-tealsoft-500"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-tealsoft-600 to-emerald-600 hover:from-tealsoft-700 text-white font-black text-base shadow-md btn-press transition-all flex items-center justify-center gap-2"
      >
        <PlusCircle className="w-5 h-5" />
        <span>Add Card to Child's Deck</span>
      </button>
    </form>
  );
}
