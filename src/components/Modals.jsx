import React, { useState } from 'react';

export function LibraryModal({ open, books, currentIndex, onSelect, onClose, onOpenCustom }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex flex-col justify-end">
      <div className="bg-white rounded-t-3xl max-h-[85%] flex flex-col overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-slate-800">Stories &amp; Books</h3>
            <p className="text-xs text-slate-400 font-medium">Select a story to read and learn</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="p-4 overflow-y-auto space-y-3">
          {books.map((b, idx) => (
            <div
              key={b.id}
              onClick={() => onSelect(idx)}
              className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${idx === currentIndex ? 'border-ewa-blue bg-sky-50/70' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
            >
              <div>
                <span className="text-[10px] font-black uppercase text-ewa-blue">{b.level}</span>
                <h4 className="font-bold text-slate-800 text-sm">{b.subtitle} - {b.title}</h4>
                <p className="text-xs text-slate-400">{b.paragraphs.length} paragraphs</p>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-300 text-xs"></i>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button onClick={onOpenCustom} className="w-full py-2.5 px-4 rounded-xl border border-dashed border-ewa-blue text-ewa-darkBlue font-black text-xs flex items-center justify-center hover:bg-white transition">
            <i className="fa-solid fa-file-circle-plus mr-2 text-sm"></i>
            Paste My Own Story / Text
          </button>
        </div>
      </div>
    </div>
  );
}

export function CustomTextModal({ open, onClose, onLoad }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-4 shadow-2xl flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Read Any Custom Text</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Story Title (e.g. My Fun Day)"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-ewa-blue"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Paste or type English sentences here. Every single word will be clickable for definitions, sentences, pronunciation, and questions..."
          className="w-full p-3 border border-slate-200 rounded-lg text-xs font-serif focus:outline-none focus:border-ewa-blue resize-none"
        />
        <button
          onClick={() => {
            if (onLoad(title.trim() || 'My Custom Story', text.trim())) {
              setTitle('');
              setText('');
            }
          }}
          className="w-full py-2 bg-ewa-blue text-white rounded-lg font-bold text-xs hover:bg-ewa-darkBlue transition"
        >
          Start Reading
        </button>
      </div>
    </div>
  );
}

export function SettingsModal({ open, onClose, onSmaller, onNormal, onLarger }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xs p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-black text-slate-800 text-sm">Reading Settings</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Text Font Size</label>
          <div className="flex items-center justify-between space-x-2">
            <button onClick={onSmaller} className="flex-1 py-1.5 bg-slate-100 rounded-lg text-xs font-bold hover:bg-slate-200">A-</button>
            <button onClick={onNormal} className="flex-1 py-1.5 bg-slate-100 rounded-lg text-xs font-bold hover:bg-slate-200">Normal</button>
            <button onClick={onLarger} className="flex-1 py-1.5 bg-slate-100 rounded-lg text-xs font-bold hover:bg-slate-200">A+</button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Learning Experience</label>
          <div className="text-[11px] text-slate-600 bg-sky-50 border border-sky-100 p-2.5 rounded-lg space-y-1">
            <div className="font-bold text-ewa-darkBlue">English Meaning &amp; Sentences</div>
            <div>Tapping words shows easy definitions, sentences, and fun questions in English!</div>
          </div>
        </div>
      </div>
    </div>
  );
}
