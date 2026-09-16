import React from 'react';
import { Download, Trash2, Sparkles } from 'lucide-react';
import { playPop, playCorrect } from '../../utils/audio';

export default function CardManager({ customCards, onDeleteCard, onAddSamplePack }) {
  const handleExport = () => {
    playPop();
    const jsonStr = JSON.stringify(customCards, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merola-cards-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="text-xs font-bold text-slate-500">
          Saved custom cards: <strong className="text-slate-900">{customCards.length}</strong>
        </p>

        <div className="flex gap-2">
          {customCards.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs btn-press"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          )}

          <button
            onClick={() => { playCorrect(); onAddSamplePack(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-tealsoft-50 hover:bg-tealsoft-100 text-tealsoft-700 font-bold text-xs border border-tealsoft-200 btn-press"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Grade 3 Bonus</span>
          </button>
        </div>
      </div>

      {customCards.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300">
          <p className="text-sm font-bold text-slate-600">No custom cards created yet.</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Use "Snap Camera" to photograph worksheets, upload files, or click "Load Grade 3 Bonus" above!
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
          {customCards.map((card) => (
            <div
              key={card.id}
              className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2 hover:border-tealsoft-300 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{card.image || "🌟"}</span>
                <div>
                  <h5 className="font-extrabold text-sm text-slate-900 capitalize leading-tight">
                    {card.displayTitle || card.word}
                  </h5>
                  <span className="text-[10px] uppercase font-bold text-tealsoft-700 bg-tealsoft-50 px-2 py-0.2 rounded-full">
                    {card.subject} • {card.category}
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{card.definition}</p>
                </div>
              </div>

              <button
                onClick={() => { playPop(); onDeleteCard(card.id); }}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                title="Delete Card"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
