import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { cleanWordToken, tokenizeParagraph, resolveWordData, speakWord, stripQuotes } from '../data/ewaData.js';
import { genStory, gradeName } from '../data/grades.js';
import { loadCustom } from '../lib/schoolParse.js';

export function gradeBooks(gradeKey) {
  const c = loadCustom();
  const custom = c.stories.filter((s) => s.grade === gradeKey);
  const out = [...custom];
  // generated library: expose as browsable chunks (500 max)
  out.push({ id: `${gradeKey}-genlib`, gradeKey, title: 'Story Library', subtitle: `${gradeName(gradeKey)} · 500 stories`, level: 'Browse all', paragraphs: [], library: true });
  return out;
}

export default function Reader({
  book, gradeKey, saved, onSaveWord, fontSize,
  onOpenLibrary, libraryOpen, setLibraryOpen, onSelectStory, storyList,
  mode, setMode,
}) {
  const [activeKey, setActiveKey] = useState(null);
  const [popup, setPopup] = useState(null);
  const [pos, setPos] = useState({ left: 10, top: 100, arrowUp: false });
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(1.0);
  const [speakingKey, setSpeakingKey] = useState(null);
  const [sentence, setSentence] = useState(null);

  const scrollRef = useRef(null);
  const popupRef = useRef(null);
  const wordEls = useRef(new Map());
  const audioRef = useRef({ playing: false, idx: 0, speed: 1.0 });
  const savedRef = useRef(saved);
  savedRef.current = saved;

  useEffect(() => () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    setActiveKey(null);
    setPopup(null);
    pauseAudio();
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book && book.id]);

  const orderedKeys = useMemo(() => {
    const keys = [];
    (book.paragraphs || []).forEach((para, pIdx) => {
      const toks = tokenizeParagraph(para);
      let w = 0;
      toks.forEach((tok) => {
        if (/^[\w']+$/.test(tok)) {
          keys.push(`${pIdx}:${w}`);
          w++;
        }
      });
    });
    return keys;
  }, [book]);

  const savedStatus = (clean) => {
    const s = savedRef.current.find((v) => v.word.toLowerCase() === clean);
    return s ? s.status : null;
  };

  useLayoutEffect(() => {
    if (!popup || !scrollRef.current) return;
    const anchorEl = wordEls.current.get(popup.anchorKey);
    const popupEl = popupRef.current;
    if (!anchorEl || !popupEl) return;
    const scrollArea = scrollRef.current;
    const spanRect = anchorEl.getBoundingClientRect();
    const scrollRect = scrollArea.getBoundingClientRect();
    const popupWidth = popupEl.offsetWidth || 265;
    const popupHeight = popupEl.offsetHeight || 220;
    let left = spanRect.left - scrollRect.left + spanRect.width / 2 - popupWidth / 2;
    if (left < 10) left = 10;
    if (left + popupWidth > scrollRect.width - 10) left = scrollRect.width - popupWidth - 10;
    const arrowLeft = spanRect.left - scrollRect.left + spanRect.width / 2 - left;
    popupEl.style.setProperty('--arrow-left', `${arrowLeft}px`);
    let top = spanRect.top - scrollRect.top + scrollArea.scrollTop - popupHeight - 12;
    let arrowUp = false;
    if (top < scrollArea.scrollTop + 10) {
      top = spanRect.bottom - scrollRect.top + scrollArea.scrollTop + 12;
      arrowUp = true;
    }
    setPos({ left, top, arrowUp });
  }, [popup && popup.anchorKey, popup && popup.loading, popup && popup.data]);

  const closePopup = useCallback(() => {
    setPopup(null);
    setActiveKey(null);
  }, []);

  const onWordClick = useCallback(async (e, key, clean, raw) => {
    e.stopPropagation();
    pauseAudio();
    setActiveKey(key);
    setPopup({ anchorKey: key, loading: true, data: null, quizPicked: null, quizOk: null });
    speakWord(clean);
    const data = await resolveWordData(clean);
    setPopup((p) => (p && p.anchorKey === key ? { ...p, loading: false, data: { ...data, raw } } : p));
  }, []);

  const playWordAt = useCallback(
    (idx) => {
      const st = audioRef.current;
      if (!st.playing || idx >= orderedKeys.length) {
        pauseAudio();
        return;
      }
      st.idx = idx;
      const key = orderedKeys[idx];
      setSpeakingKey(key);
      const el = wordEls.current.get(key);
      if (el && el.scrollIntoView) {
        try {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (err) { /* ignore */ }
      }
      const clean = el ? el.dataset.clean : '';
      const utter = new SpeechSynthesisUtterance(clean);
      utter.lang = 'en-US';
      utter.rate = st.speed;
      utter.onend = () => {
        if (!audioRef.current.playing) return;
        setTimeout(() => playWordAt(idx + 1), 110 / audioRef.current.speed);
      };
      utter.onerror = () => {
        if (!audioRef.current.playing) return;
        setTimeout(() => playWordAt(idx + 1), 90);
      };
      window.speechSynthesis.speak(utter);
    },
    [orderedKeys]
  );

  const startAudio = useCallback(
    (fromIdx = 0) => {
      if (orderedKeys.length === 0) return;
      audioRef.current.playing = true;
      setAudioPlaying(true);
      closePopup();
      playWordAt(fromIdx);
    },
    [orderedKeys, playWordAt, closePopup]
  );

  function pauseAudio() {
    audioRef.current.playing = false;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setAudioPlaying(false);
    setSpeakingKey(null);
  }

  const openSentence = useCallback(() => {
    let pIdx = 0;
    if (activeKey) pIdx = parseInt(activeKey.split(':')[0], 10) || 0;
    const sentenceText = book.paragraphs[pIdx] || book.paragraphs[0];
    const explanation = (book.sentenceExplains && book.sentenceExplains[pIdx]) || 'Describes positive moments and sight words in the story.';
    const quiz = (book.sentenceQuestions && book.sentenceQuestions[pIdx]) || { q: 'What is this about?', options: ['The story', 'A dance', 'A clock'], correct: 0 };
    setSentence({ open: true, text: sentenceText, explanation, quiz, picked: null, ok: null });
  }, [activeKey, book]);

  const renderParagraphs = () =>
    (book.paragraphs || []).map((paraText, pIdx) => {
      const toks = tokenizeParagraph(paraText);
      let w = 0;
      const nodes = [];
      toks.forEach((tok, tIdx) => {
        if (/^\s+$/.test(tok)) {
          nodes.push(<React.Fragment key={tIdx}>{tok}</React.Fragment>);
        } else if (/^[\w']+$/.test(tok)) {
          const key = `${pIdx}:${w}`;
          const clean = cleanWordToken(tok);
          const st = saved.find((v) => v.word.toLowerCase() === clean);
          w++;
          nodes.push(
            <span
              key={tIdx}
              ref={(el) => {
                if (el) {
                  el.dataset.clean = clean;
                  wordEls.current.set(key, el);
                } else {
                  wordEls.current.delete(key);
                }
              }}
              data-clean={clean}
              onClick={(e) => onWordClick(e, key, clean, tok)}
              className={
                'ewa-word' +
                (activeKey === key ? ' active-word' : '') +
                (speakingKey === key ? ' speaking-now' : '') +
                (st ? (st.status === 'learned' ? ' status-learned' : ' status-learning') : '')
              }
            >
              {tok}
            </span>
          );
        } else {
          nodes.push(<React.Fragment key={tIdx}>{tok}</React.Fragment>);
        }
      });
      return (
        <p key={pIdx} className="mb-4 font-serif leading-loose tracking-wide text-slate-800">
          {nodes}
        </p>
      );
    });

  const popupStatus = popup && popup.data ? savedStatus(popup.data.word.toLowerCase()) : null;

  return (
    <div className="flex-1 flex overflow-hidden relative" onClick={(e) => {
      if (!e.target.closest('#wordPopup') && !e.target.closest('.ewa-word')) closePopup();
    }}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative p-4 md:p-8 select-text pb-28">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl bg-[#f7eedc] border border-[#e5d9be] p-5 text-center mb-5 relative overflow-hidden select-none" style={book.theme ? { background: book.theme } : undefined}>
            <div className="text-[10px] uppercase font-black tracking-widest text-[#78593a]">{book.subtitle}</div>
            <h2 className="font-serif font-black text-2xl md:text-3xl text-[#341d11] uppercase tracking-wide my-1.5">{book.title}</h2>
            {book.illustration && (
              <div className="w-full h-44 my-2 flex items-center justify-center overflow-hidden">
                <div
                  className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={
                    book.illustration.trim().startsWith('<svg')
                      ? { __html: book.illustration }
                      : { __html: `<svg viewBox="0 0 400 220" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">${book.illustration}</svg>` }
                  }
                />
              </div>
            )}
            <div className="text-[11px] font-bold text-amber-900">{book.level}</div>
          </div>

          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur p-1 rounded-2xl border border-slate-200 shadow-sm mb-5">
            <div className="grid grid-cols-2 rounded-xl bg-theme-solid p-1 gap-1 text-white">
              <button
                onClick={() => { setMode('read'); pauseAudio(); }}
                className={'flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-display font-black text-xs uppercase tracking-wider transition ' + (mode === 'read' ? 'bg-white text-slate-900 shadow' : 'text-white hover:bg-white/10')}
              >
                <i className="fa-solid fa-book-open"></i>
                <span>Read Story</span>
              </button>
              <button
                onClick={() => { setMode('audio'); closePopup(); startAudio(0); }}
                className={'flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-display font-black text-xs uppercase tracking-wider transition ' + (mode === 'audio' ? 'bg-white text-slate-900 shadow' : 'text-white hover:bg-white/10')}
              >
                <i className="fa-solid fa-headphones"></i>
                <span>Listen Along</span>
              </button>
            </div>
          </div>

          {mode === 'audio' && (
            <div className="bg-theme-main text-white p-3 rounded-2xl shadow-lg mb-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-wider">Audio Narration</span>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => {
                  audioRef.current.idx = Math.max(0, audioRef.current.idx - 8);
                  if (audioRef.current.playing) { window.speechSynthesis.cancel(); playWordAt(audioRef.current.idx); }
                }} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs hover:bg-white/30">
                  <i className="fa-solid fa-backward-step"></i>
                </button>
                <button onClick={() => (audioPlaying ? pauseAudio() : startAudio(audioRef.current.idx))} className="w-10 h-10 rounded-full bg-white text-theme-main flex items-center justify-center text-sm shadow">
                  <i className={'fa-solid ' + (audioPlaying ? 'fa-pause' : 'fa-play ml-0.5')}></i>
                </button>
                <button onClick={() => {
                  audioRef.current.idx = Math.min(orderedKeys.length - 1, audioRef.current.idx + 8);
                  if (audioRef.current.playing) { window.speechSynthesis.cancel(); playWordAt(audioRef.current.idx); }
                }} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs hover:bg-white/30">
                  <i className="fa-solid fa-forward-step"></i>
                </button>
                <button onClick={() => {
                  setAudioSpeed((s) => {
                    const n = s === 1.0 ? 1.25 : s === 1.25 ? 0.8 : 1.0;
                    audioRef.current.speed = n;
                    return n;
                  });
                }} className="text-xs font-black bg-white/20 px-2.5 py-1 rounded-full">
                  {audioSpeed}x
                </button>
              </div>
            </div>
          )}

          <div className="text-slate-800 font-serif leading-loose text-lg md:text-xl select-text pb-6" style={{ fontSize }}>
            {renderParagraphs()}
          </div>
        </div>

        {/* Desktop companion */}
        <div className="hidden lg:flex flex-col w-80 xl:w-96 bg-white border-l border-slate-200 p-5 overflow-y-auto space-y-4 shrink-0">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-theme-main">Word &amp; Meaning Companion</span>
            <h4 className="font-display font-black text-slate-800 text-base">EWA Interactive Panel</h4>
            <p className="text-xs text-slate-400">Tap any word in the text to see details or save it.</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 space-y-3">
            {popup && popup.data && !popup.loading ? (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div>
                    <h3 className="font-display font-black text-2xl text-slate-800 leading-tight">{popup.data.word}</h3>
                    <span className="text-xs font-mono text-slate-400 font-semibold">{popup.data.ipa}</span>
                  </div>
                  <button onClick={() => speakWord(popup.data.word)} className="w-10 h-10 rounded-2xl bg-theme-light text-theme-main flex items-center justify-center hover:opacity-80 transition shadow-sm">
                    <i className="fa-solid fa-volume-high text-sm"></i>
                  </button>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-black uppercase text-theme-main block mb-1">Simple Meaning</span>
                  <p className="text-xs text-slate-700 leading-snug">{popup.data.meaning}</p>
                </div>
                <div className="bg-theme-light p-3 rounded-2xl border border-theme-light">
                  <span className="text-[10px] font-black uppercase text-theme-main block mb-1">Sentence Example</span>
                  <p className="text-xs text-slate-700 italic">&quot;{stripQuotes(popup.data.sentence)}&quot;</p>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <span className="text-4xl mb-2 block">📖</span>
                <span className="text-xs font-bold text-slate-500">Tap any word in the story to inspect its definition, listen to its sound, and solve its mini-quiz.</span>
              </div>
            )}
          </div>
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-4 space-y-2">
            <span className="text-[10px] font-black uppercase text-amber-800 block">💡 Learning Tip</span>
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              Children learn sight words 3x faster when hearing the pronunciation and seeing it used in multiple sentences!
            </p>
          </div>
        </div>
      </div>

      {/* Floating buttons */}
      <div className="absolute bottom-20 md:bottom-6 inset-x-4 md:inset-x-8 pointer-events-none flex justify-between items-center z-20 max-w-2xl mx-auto">
        <button onClick={openSentence} className="pointer-events-auto bg-white text-slate-800 text-xs font-display font-black px-4 py-3 rounded-2xl shadow-xl border border-slate-200 flex items-center space-x-2 hover:bg-slate-50 transition active:scale-95">
          <i className="fa-solid fa-lightbulb text-amber-500 text-sm"></i>
          <span>Sentence Breakdown &amp; Quiz</span>
        </button>
        <button onClick={() => scrollRef.current && scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })} className="pointer-events-auto w-11 h-11 rounded-2xl bg-white text-slate-600 shadow-xl border border-slate-200 flex items-center justify-center hover:text-theme-main transition active:scale-95">
          <i className="fa-solid fa-arrow-up text-sm"></i>
        </button>
      </div>

      {/* Sentence drawer */}
      <div className={'absolute inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 p-6 transform transition-transform duration-300 max-h-[85%] overflow-y-auto max-w-2xl mx-auto ' + (!sentence || !sentence.open ? 'translate-y-full' : '')}>
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-theme-main flex items-center">
            <i className="fa-solid fa-puzzle-piece mr-1.5"></i> Sentence Breakdown
          </span>
          <button onClick={() => setSentence((s) => s && { ...s, open: false })} className="text-slate-400 hover:text-slate-600 text-base p-1">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        {sentence && (
          <>
            <p className="font-serif text-base font-bold text-slate-800 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 mb-3">&quot;{sentence.text}&quot;</p>
            <div className="bg-theme-light border border-theme-light rounded-2xl p-3.5 mb-3">
              <span className="font-black text-theme-main uppercase text-[10px] block mb-1">What this means:</span>
              <p className="text-xs md:text-sm text-slate-700 font-medium">{sentence.explanation}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5">
              <span className="font-black text-amber-800 uppercase text-[10px] block mb-1">Mini Sentence Quiz:</span>
              <p className="text-xs md:text-sm font-bold text-slate-800 mb-2.5">{sentence.quiz.q}</p>
              <div className="space-y-2">
                {sentence.quiz.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSentence((s) => (s ? { ...s, picked: idx, ok: idx === s.quiz.correct } : s))}
                    className={'w-full py-2 px-3 text-xs font-bold rounded-xl border transition text-left flex items-center justify-between shadow-sm ' + (
                      sentence.picked === idx
                        ? sentence.ok
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                        : 'bg-white hover:bg-amber-100 text-slate-800 border-amber-200'
                    )}
                  >
                    <span>{opt}</span>
                    <i className={'fa-solid fa-check text-xs text-emerald-600 ' + (sentence.picked === idx && sentence.ok ? '' : 'opacity-0')}></i>
                  </button>
                ))}
              </div>
              {sentence.picked !== null && (
                <p className={'text-xs font-bold mt-2 text-center ' + (sentence.ok ? 'text-emerald-600' : 'text-amber-800')}>
                  {sentence.ok ? '★ Wonderful! You understood the sentence completely!' : 'Try again! Read the sentence carefully.'}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Word bubble */}
      {popup && (
        <div
          id="wordPopup"
          ref={popupRef}
          onClick={(e) => e.stopPropagation()}
          className="ewa-bubble bg-white rounded-3xl border border-slate-200 w-[265px] select-none text-left overflow-hidden"
          style={{ left: pos.left, top: pos.top }}
        >
          <div className={'ewa-bubble-arrow' + (pos.arrowUp ? ' arrow-up' : '')}></div>
          <div className="p-3.5 pb-2.5 relative">
            <button onClick={() => popup.data && speakWord(popup.data.word)} className="absolute top-3 left-3 w-8 h-8 rounded-full bg-theme-light text-theme-main hover:opacity-80 flex items-center justify-center transition active:scale-90" title="Listen">
              <i className="fa-solid fa-volume-high text-xs"></i>
            </button>
            <button onClick={closePopup} className="absolute top-2.5 right-2.5 text-slate-300 hover:text-slate-500 w-6 h-6 flex items-center justify-center text-xs">
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="text-center pt-1">
              <h3 className="font-display font-black text-2xl text-slate-800 leading-none">
                {popup.loading ? '…' : popup.data.raw || popup.data.word}
              </h3>
              <div className="text-xs font-mono text-slate-400 font-semibold tracking-wider mt-1">
                {popup.loading ? '|...|' : popup.data.ipa}
              </div>
            </div>
            <div className="mt-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 text-slate-700">
              <div className="text-[10px] uppercase font-black tracking-wider text-theme-main mb-0.5 flex items-center">
                <i className="fa-solid fa-lightbulb text-amber-500 mr-1.5"></i> Meaning:
              </div>
              <div className="text-[12px] leading-snug font-medium text-slate-700">
                {popup.loading ? (<span><i className="fa-solid fa-spinner fa-spin text-theme-main text-xs mr-1"></i> Finding definition...</span>) : popup.data.meaning}
              </div>
            </div>
            <div className="mt-1.5 bg-theme-light border border-theme-light rounded-2xl p-2.5 text-slate-700">
              <div className="text-[10px] uppercase font-black tracking-wider text-theme-main mb-0.5 flex items-center">
                <i className="fa-solid fa-quote-left mr-1.5"></i> In a sentence:
              </div>
              <div className="text-[11.5px] italic leading-snug text-slate-700">
                {popup.loading ? '...' : `"${stripQuotes(popup.data.sentence)}"`}
              </div>
            </div>
            {!popup.loading && popup.data.question && popup.data.choices && (
              <div className="mt-1.5">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5">
                  <div className="text-[10px] uppercase font-black tracking-wider text-amber-800 mb-1 flex items-center">
                    <i className="fa-solid fa-circle-question mr-1.5"></i> Quick Check:
                  </div>
                  <p className="text-[11.5px] font-bold text-slate-800 mb-1.5">{popup.data.question}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {popup.data.choices.map((choice, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPopup((p) => (p ? { ...p, quizPicked: idx, quizOk: idx === p.data.correct } : p));
                        }}
                        className={'text-[11px] font-bold py-1 px-2 rounded-xl border transition active:scale-95 text-center shadow-sm ' + (
                          popup.quizPicked === idx
                            ? popup.quizOk
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-white hover:bg-amber-100 text-slate-800 border-amber-200'
                        )}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                  {popup.quizPicked !== null && popup.quizPicked !== undefined && (
                    <div className={'text-[11px] font-bold text-center mt-1 ' + (popup.quizOk ? 'text-emerald-600' : 'text-amber-800')}>
                      {popup.quizOk ? '★ Excellent! Correct!' : 'Try again! Think about the story.'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 bg-theme-solid border-t border-white/20 text-xs font-bold text-white text-center">
            <button
              onClick={(e) => { e.stopPropagation(); onSaveWord(popup.data, 'learned'); setTimeout(closePopup, 400); }}
              className={'py-2.5 transition border-r border-white/20 flex items-center justify-center font-display tracking-wide ' + (popupStatus === 'learned' ? 'bg-emerald-600 text-white font-black' : 'hover:bg-black/10 active:bg-black/20')}
              disabled={popup.loading || !popup.data}
            >
              <i className={'fa-solid fa-check text-[11px] mr-1 ' + (popupStatus === 'learned' ? '' : 'hidden')}></i>
              <span>{popupStatus === 'learned' ? 'learned ✓' : 'learned'}</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onSaveWord(popup.data, 'learning'); setTimeout(closePopup, 400); }}
              className={'py-2.5 transition flex items-center justify-center font-display tracking-wide bg-black/15 ' + (popupStatus === 'learning' ? 'bg-black/30 font-black text-white' : 'hover:bg-black/10 active:bg-black/20 font-bold')}
              disabled={popup.loading || !popup.data}
            >
              <i className={'fa-solid fa-plus text-[11px] mr-1 ' + (popupStatus === 'learning' ? 'hidden' : '')}></i>
              <span>{popupStatus === 'learning' ? 'in deck ★' : 'learn'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Library modal (grade stories) */}

      {libraryOpen && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl max-h-[85%] flex flex-col overflow-hidden shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-display font-black text-slate-800 text-lg">{gradeName(gradeKey)} Stories &amp; Books</h3>
                <p className="text-xs text-slate-400">Choose a story for your grade</p>
              </div>
              <button onClick={() => setLibraryOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="space-y-2.5 py-3 overflow-y-auto">
              {storyList.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onSelectStory(s)}
                  className={'p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ' + (s.id === book.id ? 'border-theme-main bg-theme-light' : 'border-slate-200 hover:border-slate-300 bg-white')}
                >
                  <div>
                    <span className="text-[10px] font-black uppercase text-theme-main">{s.level}</span>
                    <h4 className="font-display font-black text-slate-800 text-sm">{s.title}</h4>
                    <p className="text-xs text-slate-400 font-medium">{s.subtitle}</p>
                  </div>
                  <i className="fa-solid fa-chevron-right text-slate-300 text-xs"></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

}
