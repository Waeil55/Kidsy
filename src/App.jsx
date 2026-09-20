import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  INITIAL_BOOKS,
  cleanWordToken,
  tokenizeParagraph,
  resolveWordData,
  speakWord,
  stripQuotes,
} from './data/ewaData.js';
import { LibraryModal, CustomTextModal, SettingsModal } from './components/Modals.jsx';
import VocabDeck from './components/VocabDeck.jsx';

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem('ewa-saved-vocab') || '[]');
  } catch (e) {
    return [];
  }
}

export default function App() {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [bookIdx, setBookIdx] = useState(() => {
    const n = parseInt(localStorage.getItem('ewa-book-idx') || '0', 10);
    return Number.isNaN(n) ? 0 : n;
  });
  const [saved, setSaved] = useState(loadSaved);
  const [activeKey, setActiveKey] = useState(null);
  const [popup, setPopup] = useState(null); // { anchorKey, loading, data, quizPicked, quizOk }
  const [pos, setPos] = useState({ left: 10, top: 100, arrowUp: false });
  const [mode, setMode] = useState('read');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(1.0);
  const [speakingKey, setSpeakingKey] = useState(null);
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('ewa-font-size') || '18', 10));
  const [toast, setToast] = useState(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [vocabOpen, setVocabOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sentence, setSentence] = useState(null); // { open, text, explanation, quiz, picked, ok }

  const scrollRef = useRef(null);
  const popupRef = useRef(null);
  const wordEls = useRef(new Map());
  const audioRef = useRef({ playing: false, idx: 0, speed: 1.0 });
  const toastTimer = useRef(null);
  const savedRef = useRef(saved);
  savedRef.current = saved;

  const book = books[bookIdx] || books[0];

  useEffect(() => {
    localStorage.setItem('ewa-saved-vocab', JSON.stringify(saved));
  }, [saved]);
  useEffect(() => {
    localStorage.setItem('ewa-book-idx', String(bookIdx));
  }, [bookIdx]);
  useEffect(() => {
    localStorage.setItem('ewa-font-size', String(fontSize));
  }, [fontSize]);
  useEffect(() => () => {
    window.speechSynthesis && window.speechSynthesis.cancel();
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  }, []);

  // Ordered word keys for the audiobook engine
  const orderedKeys = useMemo(() => {
    const keys = [];
    book.paragraphs.forEach((para, pIdx) => {
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

  const savedStatus = useCallback(
    (clean) => {
      const s = savedRef.current.find((v) => v.word.toLowerCase() === clean);
      return s ? s.status : null;
    },
    []
  );

  // Position the bubble above/below the anchor word (same math as original)
  useLayoutEffect(() => {
    if (!popup || !scrollRef.current) return;
    const anchorEl = wordEls.current.get(popup.anchorKey);
    const popupEl = popupRef.current;
    if (!anchorEl || !popupEl) return;
    const scrollArea = scrollRef.current;
    const spanRect = anchorEl.getBoundingClientRect();
    const scrollRect = scrollArea.getBoundingClientRect();
    const popupWidth = popupEl.offsetWidth || 250;
    const popupHeight = popupEl.offsetHeight || 190;

    let left = spanRect.left - scrollRect.left + spanRect.width / 2 - popupWidth / 2;
    const padding = 10;
    if (left < padding) left = padding;
    if (left + popupWidth > scrollRect.width - padding) left = scrollRect.width - popupWidth - padding;

    const arrowLeft = spanRect.left - scrollRect.left + spanRect.width / 2 - left;
    popupEl.style.setProperty('--arrow-left', `${arrowLeft}px`);

    let top = spanRect.top - scrollRect.top + scrollArea.scrollTop - popupHeight - 12;
    let arrowUp = false;
    if (top < scrollArea.scrollTop + 10) {
      top = spanRect.bottom - scrollRect.top + scrollArea.scrollTop + 12;
      arrowUp = true;
    }
    setPos({ left, top, arrowUp });
  }, [popup && popup.anchorKey, popup && popup.loading, popup && popup.data, bookIdx]);

  const closePopup = useCallback(() => {
    setPopup(null);
    setActiveKey(null);
  }, []);

  const onWordClick = useCallback(
    async (e, key, clean, raw) => {
      e.stopPropagation();
      pauseAudio();
      setActiveKey(key);
      setPopup({ anchorKey: key, loading: true, data: null, quizPicked: null, quizOk: null });
      speakWord(clean);
      const data = await resolveWordData(clean);
      setPopup((p) => (p && p.anchorKey === key ? { ...p, loading: false, data: { ...data, raw } } : p));
    },
    []
  );

  const saveWord = useCallback(
    (status) => {
      setPopup((p) => {
        if (!p || !p.data) return p;
        const word = p.data.word.toLowerCase();
        setSaved((prev) => {
          const item = {
            word: p.data.word,
            ipa: p.data.ipa,
            meaning: p.data.meaning,
            sentence: p.data.sentence,
            question: p.data.question,
            status,
            timestamp: Date.now(),
          };
          const i = prev.findIndex((v) => v.word.toLowerCase() === word);
          if (i >= 0) {
            const next = [...prev];
            next[i] = item;
            return next;
          }
          return [item, ...prev];
        });
        showToast(status === 'learned' ? `"${word}" marked as learned!` : `"${word}" added to flashcard deck!`);
        return p;
      });
      setTimeout(closePopup, 350);
    },
    [closePopup, showToast]
  );

  // ── Audiobook engine ──
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
        } catch (e) { /* ignore */ }
      }
      const clean = el ? el.dataset.clean : '';
      const utter = new SpeechSynthesisUtterance(clean);
      utter.lang = 'en-US';
      utter.rate = st.speed;
      try {
        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google')));
        if (enVoice) utter.voice = enVoice;
      } catch (e) { /* ignore */ }
      utter.onend = () => {
        if (!audioRef.current.playing) return;
        setTimeout(() => playWordAt(idx + 1), 120 / audioRef.current.speed);
      };
      utter.onerror = () => {
        if (!audioRef.current.playing) return;
        setTimeout(() => playWordAt(idx + 1), 100);
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

  const skipAudio = useCallback(
    (delta) => {
      const st = audioRef.current;
      st.idx = Math.max(0, Math.min(orderedKeys.length - 1, st.idx + delta));
      if (st.playing) {
        window.speechSynthesis.cancel();
        playWordAt(st.idx);
      }
    },
    [orderedKeys.length, playWordAt]
  );

  const cycleSpeed = useCallback(() => {
    setAudioSpeed((s) => {
      const n = s === 1.0 ? 1.25 : s === 1.25 ? 0.8 : 1.0;
      audioRef.current.speed = n;
      return n;
    });
  }, []);

  const setModeAudio = () => {
    setMode('audio');
    closePopup();
    startAudio(0);
  };
  const setModeRead = () => {
    setMode('read');
    pauseAudio();
  };

  // ── Sentence drawer ──
  const openSentence = useCallback(() => {
    let pIdx = 0;
    if (activeKey) {
      const parts = activeKey.split(':');
      pIdx = parseInt(parts[0], 10) || 0;
    }
    const sentenceText = book.paragraphs[pIdx] || book.paragraphs[0];
    const explanation = (book.sentenceExplains && book.sentenceExplains[pIdx]) || 'Describes actions in the story using clear sight words.';
    const quiz = (book.sentenceQuestions && book.sentenceQuestions[pIdx]) || { q: 'What is this sentence talking about?', options: ['The story', 'A dance', 'A clock'], correct: 0 };
    setSentence({ open: true, text: sentenceText, explanation, quiz, picked: null, ok: null });
  }, [activeKey, book]);

  // ── Library / custom text ──
  const selectBook = (idx) => {
    pauseAudio();
    closePopup();
    setBookIdx(idx);
    setLibraryOpen(false);
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0 });
  };

  const loadCustom = (title, text) => {
    if (!text) {
      showToast('Please type or paste some English sentences');
      return false;
    }
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0);
    const nb = {
      id: 'custom_' + Date.now(),
      title,
      subtitle: 'Custom Practice',
      level: 'Grade 1 Practice',
      theme: '#ffffff',
      paragraphs,
    };
    setBooks((prev) => [...prev, nb]);
    setBookIdx(books.length);
    setCustomOpen(false);
    showToast('Story loaded successfully!');
    return true;
  };

  const removeWord = (idx) => {
    setSaved((prev) => prev.filter((_, i) => i !== idx));
  };

  const markEasy = (item) => {
    const word = item.word.toLowerCase();
    setSaved((prev) => {
      const i = prev.findIndex((v) => v.word.toLowerCase() === word);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], status: 'learned' };
        return next;
      }
      return [{ ...item, status: 'learned', timestamp: Date.now() }, ...prev];
    });
  };

  // ── Render paragraphs into tappable tokens ──
  const renderParagraphs = () =>
    book.paragraphs.map((paraText, pIdx) => {
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
        <p key={pIdx} className="mb-5 text-slate-800 tracking-wide font-serif leading-loose">
          {nodes}
        </p>
      );
    });

  const popupStatus = popup && popup.data ? savedStatus(popup.data.word.toLowerCase()) : null;

  const answerPopupQuiz = (idx) => {
    setPopup((p) => {
      if (!p || !p.data) return p;
      return { ...p, quizPicked: idx, quizOk: idx === p.data.correct };
    });
  };

  const answerSentenceQuiz = (idx) => {
    setSentence((s) => {
      if (!s) return s;
      return { ...s, picked: idx, ok: idx === s.quiz.correct };
    });
  };

  return (
    <div className="bg-slate-100 text-slate-800 font-sans h-full flex justify-center items-start sm:py-5 overflow-hidden select-none" onClick={(e) => {
      if (!e.target.closest('#wordPopup') && !e.target.closest('.ewa-word')) closePopup();
    }}>
      <div className="w-full sm:max-w-md h-full sm:h-[94vh] sm:max-h-[920px] bg-[#fcfbf7] sm:rounded-[36px] shadow-2xl flex flex-col overflow-hidden relative border border-slate-200">
        {/* Top App Bar */}
        <header className="bg-white/95 backdrop-blur px-4 py-2.5 flex items-center justify-between border-b border-slate-200/80 shrink-0 z-20">
          <div className="flex items-center space-x-2">
            <button onClick={() => setLibraryOpen(true)} className="py-1.5 px-3 -ml-1 text-slate-700 hover:text-ewa-blue transition rounded-full hover:bg-slate-100 flex items-center text-xs font-black uppercase tracking-wider">
              <i className="fa-solid fa-book-bookmark mr-2 text-ewa-blue text-sm"></i>
              <span>Library</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setVocabOpen(true)} className="bg-sky-50 hover:bg-sky-100 text-ewa-darkBlue font-black text-xs px-3 py-1.5 rounded-full flex items-center transition border border-sky-100" title="Vocabulary Deck">
              <i className="fa-solid fa-layer-group mr-1.5 text-ewa-blue"></i>
              <span>Words</span>
              <span className="ml-1.5 px-1.5 py-0.2 bg-ewa-blue text-white rounded-full text-[10px] font-bold">{saved.length}</span>
            </button>
            <button onClick={() => setSettingsOpen(true)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 transition rounded-full hover:bg-slate-100" title="Reading Settings">
              <i className="fa-solid fa-sliders text-sm"></i>
            </button>
          </div>
        </header>

        <main ref={scrollRef} className="flex-1 overflow-y-auto relative bg-[#fcfbf7] select-text">
          {/* Story Banner */}
          <div className="relative w-full bg-[#f7eedc] border-b border-[#e5d9be] overflow-hidden select-none" style={book.theme && book.theme !== '#f7eedc' ? { background: book.theme } : undefined}>
            <div className="absolute inset-0 vintage-vignette pointer-events-none"></div>
            <div className="px-5 pt-4 pb-1 text-center relative z-10">
              <h2 className="font-serif tracking-widest text-[#78593a] text-[11px] uppercase font-extrabold mb-0.5">
                {book.subtitle}
              </h2>
              <h1 className="font-serif font-black text-xl sm:text-2xl tracking-wide text-[#341d11] uppercase">
                {book.title}
              </h1>
            </div>
            {book.illustration && (
              <div className="relative w-full h-48 flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full object-cover" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" dangerouslySetInnerHTML={{ __html: book.illustration }} />
                <div className="absolute bottom-2.5 right-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold text-amber-900 shadow-sm border border-amber-200/80">
                  {book.level}
                </div>
              </div>
            )}
          </div>

          {/* Dual Mode Bar */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur px-3.5 py-2.5 border-b border-slate-200/80 shadow-sm">
            <div className="grid grid-cols-2 rounded-xl bg-ewa-blue p-1 gap-1 text-white shadow-md">
              <button
                onClick={setModeRead}
                className={'flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-black text-xs uppercase tracking-wider transition ' + (mode === 'read' ? 'bg-white text-ewa-darkBlue shadow-sm' : 'text-white hover:bg-white/10')}
              >
                <i className="fa-solid fa-book-open-reader text-sm"></i>
                <span>Read Story</span>
              </button>
              <button
                onClick={setModeAudio}
                className={'flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-black text-xs uppercase tracking-wider transition ' + (mode === 'audio' ? 'bg-white text-ewa-darkBlue shadow-sm' : 'text-white hover:bg-white/10')}
              >
                <i className="fa-solid fa-headphones text-sm"></i>
                <span>Listen Along</span>
              </button>
            </div>
          </div>

          {/* Audiobook Player Widget */}
          {mode === 'audio' && (
            <div className="bg-gradient-to-r from-sky-500 via-ewa-blue to-cyan-500 text-white p-3.5 mx-3 mt-3 rounded-2xl shadow-lg transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  <span className="text-xs font-black uppercase tracking-wider text-sky-100">Audio Narration</span>
                </div>
                <button onClick={cycleSpeed} className="text-xs font-black bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-full transition">{audioSpeed}x</button>
              </div>
              <div className="flex items-center justify-center space-x-4 pt-1">
                <button onClick={() => skipAudio(-10)} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-xs transition active:scale-95">
                  <i className="fa-solid fa-backward-step"></i>
                </button>
                <button onClick={() => (audioPlaying ? pauseAudio() : startAudio(audioRef.current.idx))} className="w-11 h-11 rounded-full bg-white text-ewa-darkBlue shadow-md flex items-center justify-center text-lg transition active:scale-90 hover:scale-105">
                  <i className={'fa-solid ' + (audioPlaying ? 'fa-pause' : 'fa-play ml-0.5')}></i>
                </button>
                <button onClick={() => skipAudio(10)} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-xs transition active:scale-95">
                  <i className="fa-solid fa-forward-step"></i>
                </button>
              </div>
              <div className="mt-2 text-center text-[11px] text-sky-100 font-medium">
                Tap any word to begin audio narration from that spot
              </div>
            </div>
          )}

          <div className="p-5 sm:p-6 text-slate-800 font-serif leading-loose tracking-wide text-lg pb-24" style={{ fontSize }}>
            {renderParagraphs()}
          </div>
        </main>

        {/* Word Bubble */}
        {popup && (
          <div
            id="wordPopup"
            ref={popupRef}
            onClick={(e) => e.stopPropagation()}
            className="ewa-bubble bg-white rounded-2xl border border-sky-100 w-[240px] sm:w-[260px] select-none text-left overflow-hidden"
            style={{ left: pos.left, top: pos.top }}
          >
            <div className={'ewa-bubble-arrow' + (pos.arrowUp ? ' arrow-up' : '')}></div>
            <div className="p-3.5 pb-2.5 relative">
              <button onClick={() => popup.data && speakWord(popup.data.word)} className="absolute top-3 left-3 w-7 h-7 rounded-full bg-sky-50 text-ewa-blue hover:bg-sky-100 flex items-center justify-center transition active:scale-90" title="Listen to pronunciation">
                <i className="fa-solid fa-volume-high text-xs"></i>
              </button>
              <button onClick={closePopup} className="absolute top-2.5 right-2.5 text-slate-300 hover:text-slate-500 w-5 h-5 flex items-center justify-center text-xs">
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="text-center pt-0.5">
                <h3 className="font-sans font-black text-xl text-slate-800 tracking-tight leading-none">
                  {popup.loading ? (popup.data ? popup.data.word : '…') : popup.data.raw || popup.data.word}
                </h3>
                <div className="text-xs font-mono text-slate-400 font-semibold tracking-wider mt-1">
                  {popup.loading ? '|...|' : popup.data.ipa}
                </div>
              </div>
              <div className="mt-2.5 bg-slate-50 border border-slate-200/70 rounded-xl p-2.5 text-slate-700">
                <div className="text-[10px] uppercase font-black tracking-wider text-ewa-darkBlue mb-0.5 flex items-center">
                  <i className="fa-solid fa-lightbulb text-amber-500 mr-1.5"></i> Meaning:
                </div>
                <div className="text-[12px] leading-snug font-medium text-slate-700">
                  {popup.loading ? (<span><i className="fa-solid fa-spinner fa-spin text-ewa-blue text-xs mr-1"></i> Finding definition...</span>) : popup.data.meaning}
                </div>
              </div>
              <div className="mt-1.5 bg-sky-50/70 border border-sky-100 rounded-xl p-2.5 text-slate-700">
                <div className="text-[10px] uppercase font-black tracking-wider text-sky-700 mb-0.5 flex items-center">
                  <i className="fa-solid fa-quote-left mr-1.5"></i> In a sentence:
                </div>
                <div className="text-[11.5px] italic leading-snug text-slate-700">
                  {popup.loading ? '...' : `"${stripQuotes(popup.data.sentence)}"`}
                </div>
              </div>
              {!popup.loading && popup.data.question && popup.data.choices && (
                <div className="mt-1.5">
                  <div className="bg-amber-50/80 border border-amber-200/70 rounded-xl p-2.5">
                    <div className="text-[10px] uppercase font-black tracking-wider text-amber-800 mb-1 flex items-center">
                      <i className="fa-solid fa-circle-question mr-1.5"></i> Quick Quiz:
                    </div>
                    <p className="text-[11.5px] font-bold text-slate-800 mb-1.5">{popup.data.question}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {popup.data.choices.map((choice, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); answerPopupQuiz(idx); }}
                          className={'text-[10px] font-bold py-1 px-1.5 rounded-lg border transition active:scale-95 text-center ' + (
                            popup.quizPicked === idx
                              ? popup.quizOk
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-white hover:bg-amber-100 text-slate-700 border-amber-200'
                          )}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                    {popup.quizPicked !== null && (
                      <div className={'text-[11px] font-bold text-center mt-1 ' + (popup.quizOk ? 'text-emerald-600' : 'text-amber-700')}>
                        {popup.quizOk ? '★ Excellent! That is correct!' : 'Try again! Think about the meaning.'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 bg-ewa-blue border-t border-sky-300/40 text-xs font-bold text-white text-center">
              <button
                onClick={(e) => { e.stopPropagation(); saveWord('learned'); }}
                className={'py-2.5 transition border-r border-white/20 flex items-center justify-center tracking-tight ' + (popupStatus === 'learned' ? 'bg-emerald-600 font-extrabold text-white' : 'hover:bg-sky-600/30 active:bg-sky-700/40')}
              >
                <i className={'fa-solid fa-check text-[11px] mr-1 ' + (popupStatus === 'learned' ? '' : 'hidden')}></i>
                <span>{popupStatus === 'learned' ? 'learned ✓' : 'learned'}</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); saveWord('learning'); }}
                className={'py-2.5 transition flex items-center justify-center tracking-tight bg-ewa-darkBlue/20 ' + (popupStatus === 'learning' ? 'bg-sky-700 font-extrabold text-white' : 'hover:bg-sky-600/30 active:bg-sky-700/40 font-bold')}
              >
                <i className={'fa-solid fa-plus text-[11px] mr-1 ' + (popupStatus === 'learning' ? 'hidden' : '')}></i>
                <span>{popupStatus === 'learning' ? 'in deck ★' : 'learn'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom floating buttons */}
        <div className="absolute bottom-3 inset-x-4 pointer-events-none flex justify-between items-center z-20">
          <button onClick={openSentence} className="pointer-events-auto bg-white/95 backdrop-blur-md text-slate-700 text-xs font-extrabold px-3.5 py-2 rounded-full shadow-lg border border-slate-200 flex items-center hover:bg-slate-50 transition active:scale-95">
            <i className="fa-solid fa-circle-question text-ewa-blue text-sm mr-1.5"></i>
            <span>Sentence &amp; Questions</span>
          </button>
          <button onClick={() => scrollRef.current && scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })} className="pointer-events-auto w-9 h-9 rounded-full bg-white/95 backdrop-blur-md text-slate-600 shadow-lg border border-slate-200 flex items-center justify-center hover:text-ewa-blue transition active:scale-95">
            <i className="fa-solid fa-arrow-up text-xs"></i>
          </button>
        </div>

        {/* Sentence drawer */}
        <div className={'absolute inset-x-0 bottom-0 z-40 bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 p-5 transform transition-transform duration-300 ease-out max-h-[80%] overflow-y-auto ' + (!sentence || !sentence.open ? 'translate-y-full' : '')}>
          <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-ewa-blue flex items-center">
              <i className="fa-solid fa-puzzle-piece mr-1.5"></i> Sentence Breakdown &amp; Quiz
            </span>
            <button onClick={() => setSentence((s) => s && { ...s, open: false })} className="text-slate-400 hover:text-slate-600 text-sm p-1">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          {sentence && (
            <>
              <p className="font-serif text-sm text-slate-800 font-semibold mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">&quot;{sentence.text}&quot;</p>
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 text-slate-800 font-sans text-xs mb-3">
                <span className="font-black text-ewa-darkBlue uppercase text-[10px] block mb-1">What this sentence means:</span>
                <p>{sentence.explanation}</p>
              </div>
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3">
                <span className="font-black text-amber-800 uppercase text-[10px] block mb-1">Comprehension Question:</span>
                <p className="text-xs font-bold text-slate-800 mb-2">{sentence.quiz.q}</p>
                <div className="space-y-1.5">
                  {sentence.quiz.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => answerSentenceQuiz(idx)}
                      className={'w-full py-2 px-3 text-slate-800 text-xs font-bold rounded-lg border transition text-left flex items-center justify-between ' + (
                        sentence.picked === idx
                          ? sentence.ok
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                            : 'bg-rose-50 border-rose-300 text-rose-800'
                          : 'bg-white hover:bg-amber-100 border-amber-200'
                      )}
                    >
                      <span>{opt}</span>
                      <i className={'fa-solid fa-check text-[10px] text-amber-500 ' + (sentence.picked === idx && sentence.ok ? '' : 'opacity-0')}></i>
                    </button>
                  ))}
                </div>
                {sentence.picked !== null && (
                  <p className={'text-xs font-bold mt-2 text-center ' + (sentence.ok ? 'text-emerald-600' : 'text-rose-600')}>
                    {sentence.ok ? '★ Correct! You understood the sentence well!' : 'Try again! Read the sentence carefully.'}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <LibraryModal
          open={libraryOpen}
          books={books}
          currentIndex={bookIdx}
          onSelect={selectBook}
          onClose={() => setLibraryOpen(false)}
          onOpenCustom={() => { setLibraryOpen(false); setCustomOpen(true); }}
        />
        <CustomTextModal open={customOpen} onClose={() => setCustomOpen(false)} onLoad={loadCustom} />
        <VocabDeck open={vocabOpen} onClose={() => setVocabOpen(false)} saved={saved} onMarkEasy={markEasy} onRemove={removeWord} />
        <SettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onSmaller={() => setFontSize((f) => Math.max(14, f - 2))}
          onNormal={() => setFontSize(18)}
          onLarger={() => setFontSize((f) => Math.min(26, f + 2))}
        />

        {/* Toast */}
        <div className={'absolute top-4 inset-x-6 z-50 bg-slate-900/90 backdrop-blur text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xl text-center pointer-events-none transition-all duration-300 ' + (toast ? '' : 'opacity-0 -translate-y-2')}>
          {toast || 'Notification text'}
        </div>
      </div>
    </div>
  );
}
