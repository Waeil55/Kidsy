import React, { useState } from 'react';
import { Upload, Sparkles, CheckCircle2, FileText } from 'lucide-react';
import { playPop, playCorrect } from '../../utils/audio';
import { getGeminiApiKey } from '../../utils/storage';

export default function FileUploadTab({ onAddCards }) {
  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedCards, setExtractedCards] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    } else if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          if (Array.isArray(json)) {
            const formatted = json.map((card, i) => ({
              ...card,
              id: card.id || `custom-${Date.now()}-${i}`,
              subject: card.subject || 'english'
            }));
            onAddCards(formatted);
            alert(`Imported ${formatted.length} cards from JSON!`);
          }
        } catch (err) {
          alert("Invalid card JSON file.");
        }
      };
      reader.readAsText(file);
    } else {
      // Plain text file (e.g. Word: Definition lines)
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split('\n').filter(l => l.includes(':') || l.includes('-'));
        const generated = lines.map((line, i) => {
          const [w, d] = line.split(/[:\-]/);
          const word = (w || "").trim();
          const definition = (d || "").trim();
          return {
            id: `custom-${Date.now()}-${i}`,
            subject: 'english',
            category: 'Text Notes',
            word,
            displayTitle: word,
            definition,
            sentences: [`The word ${word} means _________.`],
            image: "📝",
            hint: definition
          };
        });
        if (generated.length > 0) {
          setExtractedCards(generated);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExtractImage = async () => {
    if (!filePreview) return;
    setIsExtracting(true);
    playPop();

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      setTimeout(() => {
        const sampleCards = [
          {
            id: `custom-${Date.now()}-1`,
            subject: "english",
            category: "Uploaded Worksheet",
            word: "courageous",
            displayTitle: "Courageous",
            definition: "Being brave and showing strength in dangerous or scary situations.",
            sentences: ["The _________ knight protected the village."],
            image: "🦁",
            imageUrl: filePreview,
            hint: "Brave like a lion!"
          }
        ];
        setExtractedCards(sampleCards);
        setIsExtracting(false);
      }, 900);
      return;
    }

    try {
      const pureBase64 = filePreview.split(',')[1];
      const prompt = `Extract all Grade 3 vocabulary, math, or science questions from this image into a JSON array:
[{"word":"word","displayTitle":"Title","subject":"english","category":"Topic","definition":"Def","sentence":"sentence with _________","image":"🌟","hint":"hint"}]
Respond with valid JSON only.`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/jpeg", data: pureBase64 } }
            ]
          }]
        })
      });

      const data = await res.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      const clean = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(clean);

      const formatted = parsed.map((item, idx) => ({
        id: `custom-${Date.now()}-${idx}`,
        subject: item.subject || "english",
        category: item.category || "Uploaded Card",
        word: item.word,
        displayTitle: item.displayTitle || item.word,
        definition: item.definition,
        sentences: [item.sentence || `The answer is _________.`],
        image: item.image || "🌟",
        imageUrl: filePreview,
        hint: item.hint || item.definition
      }));

      setExtractedCards(formatted);
    } catch (e) {
      alert("Failed to parse worksheet automatically.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveAll = () => {
    playCorrect();
    onAddCards(extractedCards);
    setExtractedCards([]);
    setFilePreview(null);
    setFileName("");
    alert(`Saved ${extractedCards.length} cards to deck!`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="p-3.5 bg-rosebloom-50 rounded-2xl border border-rosebloom-200 text-rosebloom-900 text-xs">
        <p className="font-extrabold flex items-center gap-1.5">
          <Upload className="w-4 h-4 text-rosebloom-600" />
          Upload Photos or Worksheets
        </p>
        <p className="mt-0.5 text-slate-600 font-medium">
          Upload any picture of a worksheet, word list text file, or exported flashcard pack.
        </p>
      </div>

      <label className="border-2 border-dashed border-slate-300 hover:border-tealsoft-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-tealsoft-50/30">
        <Upload className="w-10 h-10 text-slate-400 mb-2" />
        <span className="text-sm font-black text-slate-800">Choose File to Upload</span>
        <span className="text-xs text-slate-500 mt-1">Photos (.jpg, .png), Text (.txt), or Card Packs (.json)</span>
        <input
          type="file"
          accept="image/*,.json,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {filePreview && (
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-3 pop">
          <div className="flex items-center gap-3">
            <img src={filePreview} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-slate-200" />
            <div>
              <p className="font-bold text-sm text-slate-900">{fileName}</p>
              <p className="text-xs text-slate-500">Image loaded • Click below to extract</p>
            </div>
          </div>

          <button
            onClick={handleExtractImage}
            disabled={isExtracting}
            className="w-full py-3 rounded-xl bg-tealsoft-600 hover:bg-tealsoft-700 text-white font-black text-xs shadow-sm flex items-center justify-center gap-2 btn-press"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isExtracting ? "Extracting..." : "Extract Flashcards with AI"}</span>
          </button>
        </div>
      )}

      {extractedCards.length > 0 && (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 pop">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-extrabold text-sm text-emerald-900">Extracted {extractedCards.length} Cards</h4>
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-sm btn-press"
            >
              Save All to Deck
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {extractedCards.map((c, i) => (
              <div key={i} className="p-2.5 bg-white rounded-xl border border-emerald-200 text-xs">
                <strong>{c.word}</strong>: {c.definition}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
