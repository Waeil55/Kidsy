import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from 'react';
import {
  BookOpen,
  Headphones,
  Library,
  Layers,
  ArrowUp,
  X,
  ChevronRight,
  Star,
  Check,
  Plus,
  Sliders,
  Volume2,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  HelpCircle,
  Lightbulb,
  Quote,
  Search,
  Filter
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { speakText, stopAudio, playCorrect, playIncorrect, playPop, fireConfetti } from '../utils/audio';
import { lookupWord } from '../data/storyWordDictionary';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cleanToken(str) {
  return str.toLowerCase().replace(/[^a-z']/g, '').replace(/^'|'$/g, '');
}

function tokenize(text) {
  return text.match(/[\w']+|[^\s\w']+|\s+/g) || [text];
}

const GENRE_COLORS = {
  adventure: '#fef3c7',
  animals:   '#d1fae5',
  family:    '#fce7f3',
  nature:    '#dcfce7',
  friendship:'#ede9fe',
  mystery:   '#e0f2fe',
  science:   '#dbeafe',
  history:   '#fef9c3',
  fantasy:   '#fae8ff',
  humor:     '#ffedd5',
  sports:    '#d1fae5',
  school:    '#e0f2fe',
  food:      '#fef3c7',
  community: '#ede9fe',
  space:     '#1e293b',
  ocean:     '#0c4a6e',
  default:   '#f7eedc'
};

const GENRE_ICONS = {
  adventure: '🗺️', animals: '🦁', family: '👨‍👩‍👧', nature: '🌿',
  friendship: '🤝', mystery: '🔍', science: '🔬', history: '📜',
  fantasy: '🧙', humor: '😄', sports: '⚽', school: '📚',
  food: '🍎', community: '🏘️', space: '🚀', ocean: '🌊',
  default: '📖'
};

// ─── Story Reader Component ────────────────────────────────────────────────────

export function StoryReader({ onBack }) {
  const { child, complete } = useApp();
  const childGrade = child?.grade || '3';

  // ── State ──────────────────────────────────────────────────────────────────
  const [stories, setStories] = useState([]);
  const [currentStory, setCurrentStory] = useState(null);
  const [loadingStories, setLoadingStories] = useState(true);

  const [mode, setMode] = useState('read'); // 'read' | 'audio'
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioWordIdx, setAudioWordIdx] = useState(0);
  const [audioSpeed, setAudioSpeed] = useState(1.0);

  const [activeWordSpan, setActiveWordSpan] = useState(null);
  const [popup, setPopup] = useState(null); // { word, data, rect }
  const [popupAnswer, setPopupAnswer] = useState(null); // null | 0 | 1 | 2

  const [savedWords, setSavedWords] = useState({}); // { word: 'learning' | 'learned' }
  const [fontSize, setFontSize] = useState(18);

  const [showLibrary, setShowLibrary] = useState(false);
  const [showVocab, setShowVocab] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSentenceDrawer, setShowSentenceDrawer] = useState(false);
  const [activeSentence, setActiveSentence] = useState(null);
  const [activeSentenceQidx, setActiveSentenceQidx] = useState(0);
  const [activeSentenceAnswer, setActiveSentenceAnswer] = useState(null);

  // Quiz (20 questions) state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // Library filters
  const [libGrade, setLibGrade] = useState(childGrade);
  const [libGenre, setLibGenre] = useState('all');
  const [libSearch, setLibSearch] = useState('');

  // Vocab tabs
  const [vocabTab, setVocabTab] = useState('flashcards');
  const [flashIdx, setFlashIdx] = useState(0);
  const [flashFlipped, setFlashFlipped] = useState(false);

  const scrollRef = useRef(null);
  const wordSpansRef = useRef([]);
  const audioTimerRef = useRef(null);
  const wordCacheRef = useRef(new Map());

  // ── Load stories dynamically ───────────────────────────────────────────────
  useEffect(() => {
    async function loadStories() {
      setLoadingStories(true);
      try {
        const early = await import('../data/storyLibrary_early.js').catch(() => ({ EARLY_GRADE_STORIES: [] }));
        const upper = await import('../data/storyLibrary_upper.js').catch(() => ({ UPPER_GRADE_STORIES: [] }));
        const all = [
          ...(early.EARLY_GRADE_STORIES || []),
          ...(upper.UPPER_GRADE_STORIES || [])
        ];
        setStories(all);
        // Auto-load first story matching child's grade
        const gradeStories = all.filter(s => String(s.grade) === String(childGrade));
        if (gradeStories.length > 0) {
          setCurrentStory(gradeStories[0]);
        } else if (all.length > 0) {
          setCurrentStory(all[0]);
        }
      } catch (e) {
        console.warn('Story library not loaded yet:', e);
        setStories([]);
      }
      setLoadingStories(false);
    }
    loadStories();
  }, [childGrade]);

  // ── Filtered library list ──────────────────────────────────────────────────
  const filteredStories = useMemo(() => {
    return stories.filter(s => {
      const gradeMatch = libGrade === 'all' || String(s.grade) === String(libGrade);
      const genreMatch = libGenre === 'all' || s.genre === libGenre;
      const searchMatch = !libSearch || s.title.toLowerCase().includes(libSearch.toLowerCase());
      return gradeMatch && genreMatch && searchMatch;
    });
  }, [stories, libGrade, libGenre, libSearch]);

  // ── Saved words list ───────────────────────────────────────────────────────
  const savedWordEntries = useMemo(() =>
    Object.entries(savedWords).map(([w, status]) => ({ word: w, status })),
    [savedWords]
  );

  // ── Audio narration engine ─────────────────────────────────────────────────
  const allWordsFlat = useMemo(() => {
    if (!currentStory) return [];
    const tokens = [];
    currentStory.paragraphs.forEach(para => {
      tokenize(para).forEach(tok => {
        if (/^[\w']+$/.test(tok)) tokens.push(cleanToken(tok));
      });
    });
    return tokens;
  }, [currentStory]);

  useEffect(() => {
    if (!isPlaying || mode !== 'audio') return;
    if (audioWordIdx >= allWordsFlat.length) {
      setIsPlaying(false);
      setAudioWordIdx(0);
      return;
    }
    const word = allWordsFlat[audioWordIdx];
    speakText(word, audioSpeed < 1 ? 0.8 : audioSpeed > 1 ? 1.1 : 0.95);
    // Estimate duration based on word length
    const delayMs = Math.max(400, word.length * 80) / audioSpeed;
    audioTimerRef.current = setTimeout(() => {
      setAudioWordIdx(i => i + 1);
    }, delayMs);
    return () => clearTimeout(audioTimerRef.current);
  }, [isPlaying, audioWordIdx, allWordsFlat, audioSpeed, mode]);

  const handlePlayPause = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
    playPop();
  };

  const handleSkipPrev = () => {
    playPop();
    setAudioWordIdx(i => Math.max(0, i - 5));
  };

  const handleSkipNext = () => {
    playPop();
    setAudioWordIdx(i => Math.min(allWordsFlat.length - 1, i + 5));
  };

  const cycleSpeed = () => {
    setAudioSpeed(s => s === 1.0 ? 0.75 : s === 0.75 ? 1.25 : 1.0);
    playPop();
  };

  // ── Word tap handler ───────────────────────────────────────────────────────
  const handleWordClick = useCallback(async (e, word, rect) => {
    e.stopPropagation();
    playPop();
    speakText(word);
    setPopupAnswer(null);

    // Check cache
    if (wordCacheRef.current.has(word)) {
      setPopup({ word, data: wordCacheRef.current.get(word), rect });
      return;
    }

    // Local dictionary lookup
    const localData = lookupWord(word);
    wordCacheRef.current.set(word, localData);
    setPopup({ word, data: localData, rect });

    // Try online fallback for unknown words
    if (!localData.meaning.includes('A word used')) return;
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.[0]?.meanings?.[0]?.definitions?.[0]) {
          const d = json[0].meanings[0].definitions[0];
          const phonetic = json[0].phonetic || json[0].phonetics?.find(p => p.text)?.text || `|${word}|`;
          const enriched = {
            ...localData,
            ipa: `|${phonetic.replace(/\//g, '')}|`,
            meaning: d.definition || localData.meaning,
            sentence: d.example ? `"${d.example}"` : localData.sentence,
          };
          wordCacheRef.current.set(word, enriched);
          setPopup(prev => prev?.word === word ? { ...prev, data: enriched } : prev);
        }
      }
    } catch (_) {}
  }, []);

  // ── Word vocabulary save ───────────────────────────────────────────────────
  const markWord = (word, status) => {
    playPop();
    setSavedWords(prev => ({ ...prev, [word]: status }));
    setPopup(null);
    if (status === 'learned') {
      complete?.('story-word-learned', 5, 1);
    }
  };

  // ── Sentence drawer ────────────────────────────────────────────────────────
  const openSentenceDrawer = () => {
    if (!currentStory) return;
    playPop();
    // Pick a random question from the story's 20 questions
    const qIdx = Math.floor(Math.random() * currentStory.questions.length);
    setActiveSentence(currentStory.paragraphs[0]);
    setActiveSentenceQidx(qIdx);
    setActiveSentenceAnswer(null);
    setShowSentenceDrawer(true);
  };

  // ── Story quiz (all 20 questions) ─────────────────────────────────────────
  const startQuiz = () => {
    playPop();
    setQuizIdx(0);
    setQuizAnswer(null);
    setQuizScore(0);
    setQuizDone(false);
    setShowQuiz(true);
    setShowSentenceDrawer(false);
  };

  const handleQuizAnswer = (idx) => {
    if (quizAnswer !== null) return;
    const q = currentStory.questions[quizIdx];
    setQuizAnswer(idx);
    if (idx === q.correct) {
      playCorrect();
      setQuizScore(s => s + 1);
    } else {
      playIncorrect();
    }
  };

  const handleQuizNext = () => {
    playPop();
    if (quizIdx + 1 >= currentStory.questions.length) {
      setQuizDone(true);
      const pct = Math.round(((quizScore + (quizAnswer === currentStory.questions[quizIdx].correct ? 1 : 0)) / currentStory.questions.length) * 100);
      if (pct >= 70) {
        fireConfetti(true);
        complete?.('story-quiz-complete', pct, 3);
      }
    } else {
      setQuizIdx(i => i + 1);
      setQuizAnswer(null);
    }
  };

  // ── Popup position calculation ─────────────────────────────────────────────
  const getPopupStyle = () => {
    if (!popup || !scrollRef.current) return {};
    const scrollRect = scrollRef.current.getBoundingClientRect();
    const { rect } = popup;
    const POPUP_W = 260;
    const POPUP_H = 320;

    let left = (rect.left - scrollRect.left) + rect.width / 2 - POPUP_W / 2;
    left = Math.max(8, Math.min(left, scrollRect.width - POPUP_W - 8));

    const spaceAbove = rect.top - scrollRect.top;
    let top;
    if (spaceAbove > POPUP_H + 20) {
      top = (rect.top - scrollRect.top) + scrollRef.current.scrollTop - POPUP_H - 12;
    } else {
      top = (rect.bottom - scrollRect.top) + scrollRef.current.scrollTop + 12;
    }

    const arrowLeft = (rect.left - scrollRect.left) + rect.width / 2 - left;
    return { left, top, POPUP_W, arrowLeft, pointsDown: spaceAbove > POPUP_H + 20 };
  };

  const popupStyle = popup ? getPopupStyle() : null;
  const wordStatus = popup ? (savedWords[popup.word] || null) : null;

  // ── Story selection ────────────────────────────────────────────────────────
  const selectStory = (story) => {
    stopAudio();
    setIsPlaying(false);
    setAudioWordIdx(0);
    setCurrentStory(story);
    setPopup(null);
    setShowLibrary(false);
    setShowQuiz(false);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    playPop();
  };

  // ── Theme color ────────────────────────────────────────────────────────────
  const themeColor = currentStory
    ? (GENRE_COLORS[currentStory.genre] || GENRE_COLORS.default)
    : GENRE_COLORS.default;

  // ── Render words for a paragraph ──────────────────────────────────────────
  const renderParagraph = (paraText, pIdx) => {
    const tokens = tokenize(paraText);
    return tokens.map((tok, tIdx) => {
      if (/^\s+$/.test(tok)) {
        return <span key={tIdx}>{tok}</span>;
      }
      if (/^[\w']+$/.test(tok)) {
        const clean = cleanToken(tok);
        const status = savedWords[clean];
        const isAudioActive = mode === 'audio' && allWordsFlat[audioWordIdx] === clean;
        return (
          <span
            key={tIdx}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              handleWordClick(e, clean, rect);
            }}
            style={{
              cursor: 'pointer',
              display: 'inline-block',
              borderRadius: '4px',
              padding: '0 2px',
              margin: '0 1px',
              transition: 'all 0.15s ease',
              backgroundColor: isAudioActive
                ? '#fde047'
                : popup?.word === clean && popup?.rect
                  ? 'rgba(45,181,255,0.18)'
                  : 'transparent',
              color: isAudioActive ? '#713f12' : 'inherit',
              fontWeight: isAudioActive ? 700 : 'inherit',
              textDecoration: status === 'learned' ? 'underline' : status === 'learning' ? 'underline' : 'none',
              textDecorationColor: status === 'learned' ? '#10b981' : '#2db5ff',
              textDecorationThickness: status ? '2.5px' : undefined,
              textUnderlineOffset: status ? '3px' : undefined,
            }}
          >
            {tok}
          </span>
        );
      }
      return <span key={tIdx}>{tok}</span>;
    });
  };

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#fcfbf7',
        overflow: 'hidden',
        userSelect: 'text',
      }}
      onClick={() => { if (popup) setPopup(null); }}
    >
      {/* ── TOP APP BAR ─────────────────────────────────────────────────────── */}
      <header style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e2e8f0',
        flexShrink: 0,
        zIndex: 20,
      }}>
        <button
          onClick={() => { playPop(); setShowLibrary(true); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '6px 10px', borderRadius: '999px',
            fontSize: '11px', fontWeight: 900, color: '#334155',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}
        >
          <Library size={14} color="#2db5ff" />
          Library
        </button>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Story Quiz button */}
          <button
            onClick={startQuiz}
            disabled={!currentStory}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              background: '#fef3c7', border: '1px solid #fde68a',
              color: '#92400e', borderRadius: '999px',
              padding: '6px 12px', fontSize: '11px', fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            <Star size={12} fill="#f59e0b" color="#f59e0b" />
            Story Quiz
          </button>

          {/* Words deck */}
          <button
            onClick={() => { playPop(); setShowVocab(true); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              background: '#e0f2fe', border: '1px solid #bae6fd',
              color: '#0369a1', borderRadius: '999px',
              padding: '6px 10px', fontSize: '11px', fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            <Layers size={12} />
            Words
            <span style={{
              background: '#2db5ff', color: '#fff',
              borderRadius: '999px', padding: '1px 6px',
              fontSize: '9px', fontWeight: 900,
            }}>
              {savedWordEntries.length}
            </span>
          </button>

          <button
            onClick={() => { playPop(); setShowSettings(true); }}
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              border: 'none', background: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#94a3b8',
            }}
          >
            <Sliders size={15} />
          </button>
        </div>
      </header>

      {/* ── SCROLLABLE MAIN AREA ─────────────────────────────────────────────── */}
      <main ref={scrollRef} style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>

        {/* Story Cover Banner */}
        {currentStory && (
          <div style={{
            background: themeColor,
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            padding: '14px 16px 8px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '11px', fontWeight: 900, color: '#78593a',
              textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '2px',
            }}>
              {GENRE_ICONS[currentStory.genre] || '📖'} {currentStory.genre} · Grade {currentStory.grade}
            </div>
            <h1 style={{
              fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 900,
              color: '#1e293b', margin: '2px 0 8px',
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              {currentStory.title}
            </h1>
            <div style={{
              display: 'inline-block', background: 'rgba(255,255,255,0.85)',
              borderRadius: '999px', padding: '3px 12px',
              fontSize: '11px', fontWeight: 700, color: '#92400e',
              border: '1px solid rgba(180,120,50,0.25)',
            }}>
              {currentStory.readingLevel} · {currentStory.wordCount} words
            </div>
          </div>
        )}

        {/* Read / Listen Toggle */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 30,
          background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
          padding: '10px 14px', borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            background: '#2db5ff', borderRadius: '12px',
            padding: '4px', gap: '4px',
          }}>
            <button
              onClick={() => { setMode('read'); playPop(); if (isPlaying) { stopAudio(); setIsPlaying(false); } }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '8px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.07em',
                transition: 'all 0.15s ease',
                background: mode === 'read' ? '#fff' : 'transparent',
                color: mode === 'read' ? '#1288c9' : '#fff',
                boxShadow: mode === 'read' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <BookOpen size={14} />
              Read Story
            </button>
            <button
              onClick={() => { setMode('audio'); playPop(); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '8px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.07em',
                transition: 'all 0.15s ease',
                background: mode === 'audio' ? '#fff' : 'transparent',
                color: mode === 'audio' ? '#1288c9' : '#fff',
                boxShadow: mode === 'audio' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <Headphones size={14} />
              Listen Along
            </button>
          </div>
        </div>

        {/* Audio Player Widget */}
        {mode === 'audio' && (
          <div style={{
            margin: '12px 12px 0',
            background: 'linear-gradient(135deg, #38bdf8, #2db5ff, #22d3ee)',
            borderRadius: '16px', padding: '14px',
            color: '#fff',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#86efac', animation: isPlaying ? 'pulse 1s infinite' : 'none' }} />
                <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.8)' }}>
                  Audio Narration
                </span>
              </div>
              <button
                onClick={cycleSpeed}
                style={{ fontSize: '11px', fontWeight: 900, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '3px 10px', borderRadius: '999px', cursor: 'pointer' }}
              >
                {audioSpeed}x
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <button onClick={handleSkipPrev} style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SkipBack size={14} />
              </button>
              <button onClick={handlePlayPause} style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#fff', border: 'none', color: '#1288c9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(0,0,0,0.15)' }}>
                {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: 2 }} />}
              </button>
              <button onClick={handleSkipNext} style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SkipForward size={14} />
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.75)' }}>
              Tap any word to read from that spot
            </div>
          </div>
        )}

        {/* Story Content */}
        <div
          style={{
            padding: '20px 20px 96px',
            fontFamily: 'Georgia, "Lora", serif',
            fontSize: `${fontSize}px`,
            lineHeight: 1.9,
            color: '#1e293b',
            letterSpacing: '0.01em',
          }}
        >
          {loadingStories && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📚</div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>Loading your stories...</div>
            </div>
          )}

          {!loadingStories && !currentStory && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '16px', color: '#334155', marginBottom: '8px' }}>
                No stories loaded yet!
              </div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#64748b' }}>
                Open the Library to pick a story for Grade {childGrade}.
              </div>
            </div>
          )}

          {currentStory && currentStory.paragraphs.map((para, pIdx) => (
            <p key={pIdx} style={{ marginBottom: '22px' }}>
              {renderParagraph(para, pIdx)}
            </p>
          ))}
        </div>
      </main>

      {/* ── FLOATING BOTTOM BAR ──────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: '12px', left: '14px', right: '14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        pointerEvents: 'none', zIndex: 20,
      }}>
        <button
          onClick={openSentenceDrawer}
          style={{
            pointerEvents: 'auto',
            background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
            border: '1px solid #e2e8f0', borderRadius: '999px',
            padding: '9px 14px', fontSize: '12px', fontWeight: 800,
            color: '#334155', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <HelpCircle size={14} color="#2db5ff" />
          Sentence & Questions
        </button>

        <button
          onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            pointerEvents: 'auto',
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
            border: '1px solid #e2e8f0', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: '#64748b',
          }}
        >
          <ArrowUp size={14} />
        </button>
      </div>

      {/* ── WORD POPUP BUBBLE ─────────────────────────────────────────────────── */}
      {popup && popupStyle && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute',
            left: `${popupStyle.left}px`,
            top: `${popupStyle.top}px`,
            width: `${popupStyle.POPUP_W}px`,
            zIndex: 60,
            background: '#fff',
            borderRadius: '18px',
            border: '1px solid #bae6fd',
            boxShadow: '0 16px 36px rgba(15,23,42,0.18)',
            overflow: 'hidden',
            animation: 'bubblePop 0.18s cubic-bezier(0.175,0.885,0.32,1.25) forwards',
          }}
        >
          {/* Arrow */}
          <div style={{
            position: 'absolute',
            [popupStyle.pointsDown ? 'bottom' : 'top']: '-9px',
            left: `${popupStyle.arrowLeft - 9}px`,
            width: 0, height: 0,
            borderLeft: '9px solid transparent',
            borderRight: '9px solid transparent',
            [popupStyle.pointsDown ? 'borderTop' : 'borderBottom']: '9px solid #2db5ff',
          }} />

          {/* Popup Content */}
          <div style={{ padding: '14px 14px 10px', position: 'relative' }}>
            {/* Speak & Close */}
            <button onClick={() => speakText(popup.word)} style={{
              position: 'absolute', top: '12px', left: '12px',
              width: '28px', height: '28px', borderRadius: '50%',
              background: '#e0f2fe', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2db5ff',
            }}>
              <Volume2 size={12} />
            </button>
            <button onClick={() => setPopup(null)} style={{
              position: 'absolute', top: '10px', right: '10px',
              background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8',
            }}>
              <X size={14} />
            </button>

            {/* Word + IPA */}
            <div style={{ textAlign: 'center', paddingTop: '2px' }}>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '20px', color: '#1e293b' }}>
                {popup.word}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace', marginTop: '2px' }}>
                {popup.data.ipa || `|${popup.word}|`}
              </div>
            </div>

            {/* Meaning */}
            <div style={{ marginTop: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '9px' }}>
              <div style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1288c9', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Lightbulb size={10} color="#f59e0b" /> Meaning:
              </div>
              <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.4 }}>
                {popup.data.meaning}
              </div>
            </div>

            {/* Sentence */}
            <div style={{ marginTop: '6px', background: '#e0f7ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '9px' }}>
              <div style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0369a1', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Quote size={9} /> In a sentence:
              </div>
              <div style={{ fontSize: '11px', color: '#374151', fontStyle: 'italic', lineHeight: 1.4 }}>
                {popup.data.sentence}
              </div>
            </div>

            {/* Mini quiz */}
            {popup.data.question && (
              <div style={{ marginTop: '6px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '9px' }}>
                <div style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#92400e', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <HelpCircle size={9} /> Quick Quiz:
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  {popup.data.question}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                  {popup.data.choices.map((choice, i) => {
                    const isCorrect = i === popup.data.correct;
                    const isSelected = popupAnswer === i;
                    const showResult = popupAnswer !== null;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (popupAnswer !== null) return;
                          setPopupAnswer(i);
                          isCorrect ? playCorrect() : playIncorrect();
                        }}
                        style={{
                          padding: '5px 8px', borderRadius: '8px', border: '1px solid',
                          fontSize: '10px', fontWeight: 700, cursor: 'pointer', textAlign: 'left',
                          borderColor: showResult && isCorrect ? '#10b981' : showResult && isSelected ? '#ef4444' : '#e5e7eb',
                          background: showResult && isCorrect ? '#d1fae5' : showResult && isSelected ? '#fee2e2' : '#fff',
                          color: showResult && isCorrect ? '#065f46' : showResult && isSelected ? '#991b1b' : '#374151',
                        }}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#2db5ff', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <button
              onClick={() => markWord(popup.word, 'learned')}
              style={{
                padding: '10px', border: 'none', borderRight: '1px solid rgba(255,255,255,0.2)',
                background: wordStatus === 'learned' ? 'rgba(0,0,0,0.1)' : 'transparent',
                color: '#fff', fontSize: '11px', fontWeight: 900, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              }}
            >
              {wordStatus === 'learned' && <Check size={11} />}
              learned
            </button>
            <button
              onClick={() => markWord(popup.word, 'learning')}
              style={{
                padding: '10px', border: 'none',
                background: wordStatus === 'learning' ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.1)',
                color: '#fff', fontSize: '11px', fontWeight: 900, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              }}
            >
              <Plus size={11} />
              learn
            </button>
          </div>
        </div>
      )}

      {/* ── SENTENCE BREAKDOWN DRAWER ─────────────────────────────────────────── */}
      {showSentenceDrawer && currentStory && (
        <>
          <div onClick={() => setShowSentenceDrawer(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 38 }} />
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0,
            background: '#fff', borderRadius: '24px 24px 0 0',
            boxShadow: '0 -8px 32px rgba(0,0,0,0.15)',
            padding: '20px', zIndex: 40,
            maxHeight: '80%', overflowY: 'auto',
          }}>
            <div style={{ width: '40px', height: '5px', background: '#e2e8f0', borderRadius: '999px', margin: '0 auto 14px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2db5ff' }}>
                📝 Story Questions
              </span>
              <button onClick={() => setShowSentenceDrawer(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            {/* Current paragraph */}
            <p style={{
              fontFamily: 'Georgia, serif', fontSize: '14px', color: '#1e293b',
              background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px',
              padding: '12px', marginBottom: '12px', lineHeight: 1.6,
            }}>
              {currentStory.paragraphs[0]}
            </p>

            {/* Show a random story question */}
            {(() => {
              const q = currentStory.questions[activeSentenceQidx];
              if (!q) return null;
              return (
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '12px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#92400e', marginBottom: '6px' }}>
                    Comprehension Question:
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '10px' }}>{q.question}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {q.options.map((opt, i) => {
                      const isCorrect = i === q.correct;
                      const isSelected = activeSentenceAnswer === i;
                      const showResult = activeSentenceAnswer !== null;
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            if (activeSentenceAnswer !== null) return;
                            setActiveSentenceAnswer(i);
                            isCorrect ? playCorrect() : playIncorrect();
                          }}
                          style={{
                            padding: '10px 14px', borderRadius: '10px', textAlign: 'left',
                            fontSize: '13px', fontWeight: 700, cursor: 'pointer', border: '2px solid',
                            borderColor: showResult && isCorrect ? '#10b981' : showResult && isSelected ? '#ef4444' : '#e5e7eb',
                            background: showResult && isCorrect ? '#d1fae5' : showResult && isSelected ? '#fee2e2' : '#fff',
                            color: showResult && isCorrect ? '#065f46' : showResult && isSelected ? '#991b1b' : '#374151',
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {activeSentenceAnswer !== null && (
                    <div style={{
                      marginTop: '10px', fontSize: '12px', fontWeight: 700, textAlign: 'center',
                      color: activeSentenceAnswer === q.correct ? '#065f46' : '#991b1b',
                    }}>
                      {activeSentenceAnswer === q.correct ? '🎉 Correct! ' : '❌ Not quite. '}{q.explanation}
                    </div>
                  )}
                </div>
              );
            })()}

            <button
              onClick={startQuiz}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                background: '#2db5ff', border: 'none', color: '#fff',
                fontSize: '14px', fontWeight: 900, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              <Star size={16} fill="#fff" />
              Take Full Story Quiz (20 Questions)
            </button>
          </div>
        </>
      )}

      {/* ── STORY QUIZ MODAL ──────────────────────────────────────────────────── */}
      {showQuiz && currentStory && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{
            background: '#fff', borderRadius: '24px 24px 0 0',
            width: '100%', maxHeight: '90%', overflowY: 'auto',
            padding: '20px', boxShadow: '0 -8px 32px rgba(0,0,0,0.2)',
          }}>
            {quizDone ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '56px', marginBottom: '12px' }}>
                  {quizScore >= 16 ? '🏆' : quizScore >= 12 ? '🌟' : '📖'}
                </div>
                <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '24px', color: '#1e293b', margin: '0 0 6px' }}>
                  Quiz Complete!
                </h2>
                <p style={{ color: '#64748b', fontWeight: 700, fontSize: '15px', margin: '0 0 20px' }}>
                  You got {quizScore + (quizAnswer === currentStory.questions[quizIdx]?.correct ? 1 : 0)} out of {currentStory.questions.length} correct
                </p>
                <div style={{
                  background: quizScore >= 14 ? '#d1fae5' : quizScore >= 10 ? '#fef9c3' : '#fee2e2',
                  borderRadius: '14px', padding: '14px', marginBottom: '20px', fontSize: '14px', fontWeight: 700,
                  color: quizScore >= 14 ? '#065f46' : quizScore >= 10 ? '#92400e' : '#991b1b',
                }}>
                  {quizScore >= 16 ? '🎉 Outstanding reader! You really understood this story!' :
                   quizScore >= 12 ? '⭐ Great job! You understood most of the story.' :
                   quizScore >= 8 ? '📚 Good effort! Try reading the story again to improve.' :
                   '🔄 Keep practicing! Reading the story again will help.'}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setShowQuiz(false)}
                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0', background: '#fff', fontWeight: 900, fontSize: '14px', cursor: 'pointer', color: '#374151' }}
                  >
                    Back to Story
                  </button>
                  <button
                    onClick={() => { setShowLibrary(true); setShowQuiz(false); }}
                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#2db5ff', fontWeight: 900, fontSize: '14px', cursor: 'pointer', color: '#fff' }}
                  >
                    New Story
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Quiz progress */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ fontWeight: 900, fontSize: '13px', color: '#2db5ff' }}>
                    Question {quizIdx + 1} of {currentStory.questions.length}
                  </div>
                  <button onClick={() => setShowQuiz(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                    <X size={20} />
                  </button>
                </div>

                {/* Progress bar */}
                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '999px', marginBottom: '20px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', background: '#2db5ff',
                    borderRadius: '999px',
                    width: `${((quizIdx) / currentStory.questions.length) * 100}%`,
                    transition: 'width 0.3s ease',
                  }} />
                </div>

                {/* Question type badge */}
                <div style={{
                  display: 'inline-block', background: '#e0f2fe', borderRadius: '999px',
                  padding: '3px 10px', fontSize: '10px', fontWeight: 900,
                  color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px',
                }}>
                  {currentStory.questions[quizIdx]?.type?.replace(/_/g, ' ') || 'comprehension'}
                </div>

                <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '16px', color: '#1e293b', marginBottom: '16px', lineHeight: 1.4 }}>
                  {currentStory.questions[quizIdx]?.question}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  {currentStory.questions[quizIdx]?.options.map((opt, i) => {
                    const isCorrect = i === currentStory.questions[quizIdx].correct;
                    const isSelected = quizAnswer === i;
                    const showResult = quizAnswer !== null;
                    return (
                      <button
                        key={i}
                        onClick={() => handleQuizAnswer(i)}
                        style={{
                          padding: '12px 16px', borderRadius: '12px', textAlign: 'left',
                          fontSize: '14px', fontWeight: 700, cursor: quizAnswer !== null ? 'default' : 'pointer',
                          border: '2px solid',
                          borderColor: showResult && isCorrect ? '#10b981' : showResult && isSelected && !isCorrect ? '#ef4444' : '#e2e8f0',
                          background: showResult && isCorrect ? '#d1fae5' : showResult && isSelected && !isCorrect ? '#fee2e2' : isSelected ? '#e0f2fe' : '#fff',
                          color: showResult && isCorrect ? '#065f46' : showResult && isSelected && !isCorrect ? '#991b1b' : '#374151',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizAnswer !== null && (
                  <>
                    <div style={{
                      padding: '10px 14px', borderRadius: '10px', marginBottom: '14px',
                      background: quizAnswer === currentStory.questions[quizIdx].correct ? '#d1fae5' : '#fef3c7',
                      color: quizAnswer === currentStory.questions[quizIdx].correct ? '#065f46' : '#92400e',
                      fontSize: '12px', fontWeight: 700,
                    }}>
                      {currentStory.questions[quizIdx].explanation}
                    </div>
                    <button
                      onClick={handleQuizNext}
                      style={{
                        width: '100%', padding: '14px', borderRadius: '12px',
                        background: '#2db5ff', border: 'none', color: '#fff',
                        fontSize: '14px', fontWeight: 900, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      }}
                    >
                      {quizIdx + 1 >= currentStory.questions.length ? '🏆 See Results' : 'Next Question →'}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── LIBRARY MODAL ─────────────────────────────────────────────────────── */}
      {showLibrary && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{
            background: '#fff', borderRadius: '24px 24px 0 0',
            maxHeight: '88%', display: 'flex', flexDirection: 'column',
            boxShadow: '0 -8px 32px rgba(0,0,0,0.2)',
          }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div>
                <h3 style={{ fontWeight: 900, fontSize: '18px', color: '#1e293b', margin: 0 }}>Stories & Books</h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 700 }}>
                  {filteredStories.length} stories available
                </p>
              </div>
              <button onClick={() => setShowLibrary(false)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <X size={16} />
              </button>
            </div>

            {/* Filters */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
              {/* Search */}
              <div style={{ position: 'relative', marginBottom: '10px' }}>
                <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  value={libSearch}
                  onChange={e => setLibSearch(e.target.value)}
                  placeholder="Search stories..."
                  style={{
                    width: '100%', padding: '8px 12px 8px 30px', borderRadius: '10px',
                    border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Grade filter */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                {['all', 'K', '1', '2', '3', '4', '5', '6'].map(g => (
                  <button
                    key={g}
                    onClick={() => setLibGrade(g)}
                    style={{
                      flexShrink: 0, padding: '4px 12px', borderRadius: '999px', border: '1px solid',
                      fontSize: '12px', fontWeight: 900, cursor: 'pointer',
                      borderColor: libGrade === g ? '#2db5ff' : '#e2e8f0',
                      background: libGrade === g ? '#2db5ff' : '#fff',
                      color: libGrade === g ? '#fff' : '#374151',
                    }}
                  >
                    {g === 'all' ? 'All' : g === 'K' ? 'Kinder' : `Gr.${g}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Story list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
              {filteredStories.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📚</div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>
                    {loadingStories ? 'Loading stories...' : 'No stories match your filters'}
                  </div>
                </div>
              ) : (
                filteredStories.map(story => (
                  <button
                    key={story.id}
                    onClick={() => selectStory(story)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '12px',
                      borderRadius: '14px', marginBottom: '8px',
                      background: currentStory?.id === story.id ? '#e0f2fe' : (GENRE_COLORS[story.genre] || '#f8fafc'),
                      border: `1px solid ${currentStory?.id === story.id ? '#2db5ff' : 'rgba(0,0,0,0.06)'}`,
                      cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'center',
                    }}
                  >
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '12px',
                      background: 'rgba(255,255,255,0.7)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0,
                    }}>
                      {GENRE_ICONS[story.genre] || '📖'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 900, fontSize: '14px', color: '#1e293b', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {story.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
                        Grade {story.grade} · {story.genre} · {story.wordCount} words
                      </div>
                    </div>
                    {currentStory?.id === story.id && <Check size={16} color="#2db5ff" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── VOCABULARY DECK MODAL ─────────────────────────────────────────────── */}
      {showVocab && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{
            background: '#fafafa', borderRadius: '24px 24px 0 0',
            height: '88%', display: 'flex', flexDirection: 'column',
            boxShadow: '0 -8px 32px rgba(0,0,0,0.2)',
          }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, borderRadius: '24px 24px 0 0' }}>
              <div>
                <h3 style={{ fontWeight: 900, fontSize: '16px', color: '#1e293b', margin: 0 }}>Vocabulary Deck</h3>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>{savedWordEntries.length} saved words</p>
              </div>
              <button onClick={() => setShowVocab(false)} style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} />
              </button>
            </div>

            {savedWordEntries.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '14px' }}>💡</div>
                <div style={{ fontWeight: 900, fontSize: '16px', color: '#1e293b', marginBottom: '8px' }}>No saved words yet</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  Tap any word in the story to see its meaning, then press "learn" to save it here.
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                {savedWordEntries.map(({ word, status }) => {
                  const data = wordCacheRef.current.get(word) || lookupWord(word);
                  return (
                    <div
                      key={word}
                      style={{
                        background: '#fff', border: `1px solid ${status === 'learned' ? '#a7f3d0' : '#bae6fd'}`,
                        borderRadius: '14px', padding: '12px', marginBottom: '10px',
                        display: 'flex', gap: '12px', alignItems: 'flex-start',
                      }}
                    >
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                        background: status === 'learned' ? '#d1fae5' : '#e0f2fe',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {status === 'learned' ? <Check size={18} color="#10b981" /> : <Plus size={18} color="#2db5ff" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                          <span style={{ fontWeight: 900, fontSize: '16px', color: '#1e293b' }}>{word}</span>
                          <button onClick={() => speakText(word)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                            <Volume2 size={14} />
                          </button>
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace', marginBottom: '4px' }}>{data.ipa}</div>
                        <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.4 }}>{data.meaning}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SETTINGS MODAL ────────────────────────────────────────────────────── */}
      {showSettings && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '320px', padding: '20px', boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontWeight: 900, fontSize: '15px', color: '#1e293b', margin: 0 }}>Reading Settings</h3>
              <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#64748b', marginBottom: '8px' }}>Text Font Size</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[['A-', 16], ['Normal', 18], ['A+', 21], ['A++', 24]].map(([label, size]) => (
                  <button
                    key={label}
                    onClick={() => { setFontSize(size); playPop(); }}
                    style={{
                      flex: 1, padding: '8px', borderRadius: '10px', border: '1px solid',
                      fontSize: '12px', fontWeight: 900, cursor: 'pointer',
                      borderColor: fontSize === size ? '#2db5ff' : '#e2e8f0',
                      background: fontSize === size ? '#e0f2fe' : '#fff',
                      color: fontSize === size ? '#0369a1' : '#374151',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: '#e0f7ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '12px' }}>
              <div style={{ fontWeight: 900, fontSize: '12px', color: '#0369a1', marginBottom: '4px' }}>💡 How it works</div>
              <div style={{ fontSize: '11px', color: '#374151', lineHeight: 1.5 }}>
                Tap any word to see its meaning, hear it pronounced, and answer a quick quiz. Save words to your Vocabulary Deck to review them later!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup animation keyframe (injected inline for portability) */}
      <style>{`
        @keyframes bubblePop {
          0% { opacity: 0; transform: translateY(8px) scale(0.94); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

export default StoryReader;
