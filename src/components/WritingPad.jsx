import React, { useRef, useState, useEffect } from 'react';
import { 
  RotateCcw, 
  Check, 
  Volume2, 
  Sparkles, 
  Edit3,
  Lightbulb
} from 'lucide-react';
import { 
  playPop, 
  playCorrect, 
  playIncorrect, 
  speakText, 
  fireConfetti 
} from '../utils/audio';

export default function WritingPad({
  items = [],
  onScoreUpdate,
  onOpenChat
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [inkColor, setInkColor] = useState('#4F46E5');
  const [hasDrawn, setHasDrawn] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentItem = items.length > 0 ? items[currentIndex % items.length] : {
    word: "oppose",
    displayTitle: "Oppose",
    definition: "To be against something"
  };

  const targetGlyph = (currentItem.displayTitle || currentItem.word || "A").toUpperCase();

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Scale for high-DPI displays
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 6;
    ctx.strokeStyle = inkColor;
  }, [currentIndex]);

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX = e.clientX;
    let clientY = e.clientY;
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasCoords(e);
    ctx.strokeStyle = inkColor;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    playPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSubmit = () => {
    if (!hasDrawn) {
      alert("Please trace the word on the canvas first!");
      return;
    }
    playCorrect();
    fireConfetti(false);
    onScoreUpdate(10, 'Handwriting Stroke Approved! +10 Points');
    speakText(`Wonderful handwriting for ${currentItem.word}!`, 1.1, 1.25);
    setTimeout(() => {
      clearCanvas();
      setCurrentIndex((currentIndex + 1) % items.length);
    }, 900);
  };

  const handleMiss = () => {
    playIncorrect();
    onScoreUpdate(-1, 'Stroke Out of Bounds! Penalty deducted 1 point (-1)');
  };

  return (
    <section className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden py-1 w-full max-w-lg mx-auto">
      
      {/* Header Info */}
      <div className="flex justify-between items-center px-1 shrink-0 mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-fredoka font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center gap-1">
            <Edit3 className="w-3 h-3" />
            <span>Vector Stylus Tracing Lab</span>
          </span>
          <span className="text-[10px] font-fredoka text-slate-400">
            {currentIndex + 1} / {items.length}
          </span>
        </div>

        <button
          onClick={() => { playPop(); speakText(currentItem.word); }}
          className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 btn-press"
          title="Pronounce word"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Workspace Card */}
      <div className="flex-1 min-h-[320px] bg-white dark:bg-kid-nightCard rounded-3xl p-3 sm:p-4 shadow-squish-card border-2 border-slate-100 dark:border-kid-nightBorder flex flex-col justify-between my-1">
        
        {/* Word Info Banner */}
        <div className="flex items-center justify-between pb-1 shrink-0">
          <div>
            <span className="text-[10px] font-fredoka uppercase tracking-wider text-slate-400 font-bold block">
              Trace Target Word:
            </span>
            <h2 className="font-fredoka font-bold text-xl sm:text-2xl text-slate-900 dark:text-white capitalize">
              {currentItem.displayTitle || currentItem.word}
            </h2>
          </div>
          <span className="text-3xl">{currentItem.image || "✍️"}</span>
        </div>

        {/* Canvas Pad with Stylus/Touch Support */}
        <div className="relative w-full h-44 sm:h-52 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-800 overflow-hidden my-auto shadow-inner select-none">
          
          {/* Background Watermark Guideline Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-20 dark:opacity-15 font-fredoka text-4xl sm:text-6xl font-black text-slate-500 tracking-wider">
            {targetGlyph}
          </div>
          
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="relative z-10 w-full h-full cursor-crosshair touch-none"
          />
        </div>

        {/* Palette Controls: Color & Clear */}
        <div className="flex items-center justify-between pt-2 px-1 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-fredoka font-bold uppercase text-slate-400">Ink:</span>
            {[
              { color: '#4F46E5', name: 'Indigo' },
              { color: '#10B981', name: 'Emerald' },
              { color: '#F43F5E', name: 'Rose' },
              { color: '#F59E0B', name: 'Amber' },
            ].map(c => (
              <button
                key={c.color}
                onClick={() => { playPop(); setInkColor(c.color); }}
                style={{ backgroundColor: c.color }}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  inkColor === c.color ? 'border-white shadow-md scale-110' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
                title={c.name}
              />
            ))}
          </div>

          <button
            onClick={clearCanvas}
            className="text-xs font-fredoka font-bold text-slate-500 hover:text-slate-800 dark:text-slate-300 flex items-center gap-1 btn-press"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Ink</span>
          </button>
        </div>

      </div>

      {/* Submission & Penalty Check Buttons (3D Squish) */}
      <div className="grid grid-cols-2 gap-2 shrink-0 mt-1">
        <button
          onClick={handleSubmit}
          className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-fredoka text-xs font-bold squish-btn shadow-squish-indigo flex items-center justify-center gap-1"
        >
          <Check className="w-4 h-4" />
          <span>Submit Tracing (+10)</span>
        </button>

        <button
          onClick={handleMiss}
          className="py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 font-fredoka text-xs font-bold squish-btn"
        >
          <span>Stroke Miss (-1)</span>
        </button>
      </div>

    </section>
  );
}
