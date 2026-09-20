import React, { useMemo, useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Play,
  ArrowLeft,
  Volume2,
  Sparkles,
  Star,
  BookOpen,
  Brain,
  Layers,
  Award,
  Timer,
  Zap,
  RotateCcw,
  Check,
  Trophy,
  Compass,
  Smile,
  Bot,
  Sun,
  Map,
  Backpack,
  Calculator,
  VolumeX
} from 'lucide-react';
import { Card } from '../components/Card';
import { getLessons, grades, subjects } from '../data/curriculum';
import { WORD_ENCYCLOPEDIA, searchEncyclopedia } from '../data/wordEncyclopedia';
import {
  PICTURE_CATEGORIES,
  PICTURE_CARDS,
  getCardsByCategory,
  searchPictureCards
} from '../data/pictureBookCategories';
import { AITeacherModal } from '../components/AITeacherModal';
import { GeminiAIStudio } from '../components/GeminiAIStudio';
import { SmartStudyHabitsModal } from '../components/SmartStudyHabitsModal';
import { WordPictureMatchGame } from '../components/WordPictureMatchGame';
import { GradeLevelAdventure } from '../components/GradeLevelAdventure';
import { SchoolWordsSection } from '../components/SchoolWordsSection';
import { MathLabSection } from '../components/MathLabSection';
import { GradeWordBankSection } from '../components/GradeWordBankSection';
import { getGradeLevels } from '../data/levelProgressionEngine';
import JourneyMap from '../components/JourneyMap';
import { useApp } from '../store/AppContext';
import { playCorrect, playIncorrect, playPop, fireConfetti, speakText, stopAudio } from '../utils/audio';
import { StoryReader } from '../components/StoryReader';
import { PhonicsAdventure } from '../components/PhonicsAdventure';
import { KidsReels } from './KidsReels';

export function Learn({ initialSubject = 'all' }) {
  const { child, complete } = useApp();

  // Mode: 'mathlab' | 'gradewords' | 'adventure' | 'school' | 'arena' | 'picturebook' | 'curriculum' | 'encyclopedia'
  const [activeTab, setActiveTab] = useState('mathlab');

  // Interactive AI & Habits Modal State
  const [isGeminiStudioOpen, setIsGeminiStudioOpen] = useState(false);
  const [isSmartHabitsOpen, setIsSmartHabitsOpen] = useState(false);

  // Picture Book State
  const [pictureCategory, setPictureCategory] = useState('all');
  const [pictureQuery, setPictureQuery] = useState('');
  const [selectedPictureCard, setSelectedPictureCard] = useState(null);
  const [pictureQuizAnswer, setPictureQuizAnswer] = useState(null);

  // Curriculum State
  const [grade, setGrade] = useState(child.grade || '3');
  const [subject, setSubject] = useState(initialSubject);
  const [query, setQuery] = useState('');
  const [showJourneyRoadmap, setShowJourneyRoadmap] = useState(true);

  // Encyclopedia State
  const [dictQuery, setDictQuery] = useState('');
  const [selectedWordEntry, setSelectedWordEntry] = useState(null);

  // Arena Flashcard State (Matching Screenshots 2, 3, 4, 5)
  // 'deck' | 'match' | 'scavenger' | 'speed' | 'quiz'
  const [arenaPlayMode, setArenaPlayMode] = useState('deck');
  const [cardIndex, setCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  // Scavenger & Speed Challenge State
  const [scavengerTargetIdx, setScavengerTargetIdx] = useState(0);
  const [scavengerSelected, setScavengerSelected] = useState(null);
  const [speedTimer, setSpeedTimer] = useState(15);
  const [isSpeedRunning, setIsSpeedRunning] = useState(false);
  const [speedScore, setSpeedScore] = useState(0);

  // Lesson Player State
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    if (initialSubject && initialSubject !== 'all') {
      if (['mathlab', 'gradewords', 'adventure', 'school', 'arena', 'picturebook', 'curriculum', 'encyclopedia', 'stories', 'phonics', 'reels'].includes(initialSubject)) {
        setActiveTab(initialSubject);
      } else {
        setSubject(initialSubject);
        setActiveTab('curriculum');
      }
    }
  }, [initialSubject]);

  // Timer for Speed Sprint mode
  useEffect(() => {
    let interval = null;
    if (isSpeedRunning && speedTimer > 0) {
      interval = setInterval(() => {
        setSpeedTimer((t) => t - 1);
      }, 1000);
    } else if (speedTimer === 0 && isSpeedRunning) {
      setIsSpeedRunning(false);
      fireConfetti(true);
      complete('speed-sprint-win', speedScore * 5, 2);
    }
    return () => clearInterval(interval);
  }, [isSpeedRunning, speedTimer, speedScore]);

  // Filtered Picture Book cards
  const pictureCardsList = useMemo(() => {
    if (pictureQuery) {
      return searchPictureCards(pictureQuery);
    }
    return getCardsByCategory(pictureCategory);
  }, [pictureCategory, pictureQuery]);

  // Filtered curriculum lessons
  const lessonList = useMemo(() => {
    return getLessons(grade, subject === 'all' ? undefined : subject).filter((l) => {
      const text = `${l.title} ${l.description} ${l.word || ''} ${(l.synonyms || []).join(' ')}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [grade, subject, query]);

  // Filtered encyclopedia words
  const encyclopediaResults = useMemo(() => {
    return searchEncyclopedia(dictQuery);
  }, [dictQuery]);

  // Grade-isolated Flashcard Catalog (Strictly isolated by child.grade + School Words!)
  const gradeFlashcards = useMemo(() => {
    const schoolCards = (child.schoolWords || []).map(sw => ({
      word: sw.word,
      displayTitle: sw.word.charAt(0).toUpperCase() + sw.word.slice(1),
      definition: sw.definition,
      phonetic: `/${sw.word}/`,
      sentence: sw.sentence,
      mnemonic: sw.mnemonic || 'School study word',
      synonyms: sw.synonyms || [],
      antonyms: sw.antonyms || [],
      imageUrl: sw.imageUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
      category: 'School Bag'
    }));

    if (String(grade) === '3') {
      const g3Words = WORD_ENCYCLOPEDIA.filter(w => ['oppose', 'snide', 'heap', 'diverse', 'origin'].includes(w.word.toLowerCase()));
      return [...schoolCards, ...g3Words];
    } else {
      const lvlCards = getGradeLevels(grade).slice(0, 25).map(lvl => ({
        word: lvl.targetWord || lvl.title,
        displayTitle: lvl.title,
        definition: lvl.description,
        phonetic: `/${lvl.targetWord || lvl.title}/`,
        sentence: (lvl.questions[0] && lvl.questions[0].prompt) || '',
        mnemonic: `${lvl.stage} concept for Grade ${grade}`,
        synonyms: [],
        antonyms: [],
        imageUrl: lvl.imageUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
        category: `Grade ${grade}`
      }));
      return [...schoolCards, ...lvlCards];
    }
  }, [grade, child.schoolWords]);

  const currentFlashcard = gradeFlashcards[cardIndex % Math.max(1, gradeFlashcards.length)] || gradeFlashcards[0] || WORD_ENCYCLOPEDIA[0];

  const handleOpenWordEntry = (entry) => {
    playPop();
    setSelectedWordEntry(entry);
  };

  const handleSpeak = (text) => {
    playPop();
    speakText(text);
  };

  const handleStartSpeedSprint = () => {
    playPop();
    setSpeedTimer(15);
    setSpeedScore(0);
    setIsSpeedRunning(true);
    setCardIndex(Math.floor(Math.random() * Math.max(1, gradeFlashcards.length)));
  };

  return (
    <div className="page" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Page Header with Quick Launchers for Gemini AI Studio & 10 Smart Habits */}
      <div className="pageHead" style={{ marginBottom: '14px' }}>
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#e0f2fe',
              color: '#0369a1',
              padding: '3px 10px',
              borderRadius: '99px',
              fontSize: '11px',
              fontWeight: 900,
              marginBottom: '6px'
            }}
          >
            <Sparkles size={13} />
            <span>AI MASTER LEARNING STUDIO</span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, margin: '2px 0 4px', color: '#0f172a', letterSpacing: '-0.5px' }}>
            Interactive Learning Studio
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
            Picture book categories, grade-specific journeys, 3D stacked deck, and Gemini AI teaching assistant.
          </p>
        </div>

        {/* Action Pills: Stop Voice, Gemini AI Assistant & 10 Smart Vacation Habits */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
          <button
            onClick={() => {
              stopAudio();
            }}
            style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '999px',
              color: '#b91c1c',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 850,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
            }}
            title="Stop all currently playing voice and sounds immediately"
          >
            <VolumeX size={15} />
            <span>⏹️ Stop Voice</span>
          </button>

          <button
            onClick={() => {
              playCorrect();
              setIsGeminiStudioOpen(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: 0,
              borderRadius: '999px',
              color: '#ffffff',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 850,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35)'
            }}
          >
            <Bot size={15} />
            <span>🤖 Gemini AI Studio</span>
          </button>

          <button
            onClick={() => {
              playPop();
              setIsSmartHabitsOpen(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              border: 0,
              borderRadius: '999px',
              color: '#ffffff',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 850,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)'
            }}
          >
            <Sun size={15} />
            <span>☀️ 10 Smart Habits</span>
          </button>
        </div>
      </div>

      {/* Main Mode Navigation Bar — horizontal scroll so all tabs always visible */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          background: '#e2e8f0',
          padding: '4px',
          borderRadius: '16px',
          gap: '4px',
          marginBottom: '16px',
          width: '100%',
          boxSizing: 'border-box',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <button
          onClick={() => {
            playPop();
            setActiveTab('mathlab');
          }}
          style={{
            padding: '9px 8px',
            flexShrink: 0,
            borderRadius: '12px',
            border: 0,
            background: activeTab === 'mathlab' ? '#ffffff' : 'transparent',
            color: activeTab === 'mathlab' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'mathlab' ? '0 3px 8px rgba(0,0,0,0.06)' : 'none',
            fontSize: '11.5px',
            fontWeight: 850,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <Calculator size={16} color={activeTab === 'mathlab' ? '#7c3aed' : '#64748b'} />
          <span>Math Lab</span>
        </button>

        <button
          onClick={() => {
            playPop();
            setActiveTab('gradewords');
          }}
          style={{
            padding: '9px 8px',
            flexShrink: 0,
            borderRadius: '12px',
            border: 0,
            background: activeTab === 'gradewords' ? '#ffffff' : 'transparent',
            color: activeTab === 'gradewords' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'gradewords' ? '0 3px 8px rgba(0,0,0,0.06)' : 'none',
            fontSize: '11.5px',
            fontWeight: 850,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <BookOpen size={16} color={activeTab === 'gradewords' ? '#059669' : '#64748b'} />
          <span>500 Words</span>
        </button>

        <button
          onClick={() => {
            playPop();
            setActiveTab('adventure');
          }}
          style={{
            padding: '9px 8px',
            flexShrink: 0,
            borderRadius: '12px',
            border: 0,
            background: activeTab === 'adventure' ? '#ffffff' : 'transparent',
            color: activeTab === 'adventure' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'adventure' ? '0 3px 8px rgba(0,0,0,0.06)' : 'none',
            fontSize: '11.5px',
            fontWeight: 850,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <Map size={16} color={activeTab === 'adventure' ? '#3b82f6' : '#64748b'} />
          <span>100 Levels</span>
        </button>

        <button
          onClick={() => {
            playPop();
            setActiveTab('school');
          }}
          style={{
            padding: '9px 8px',
            flexShrink: 0,
            borderRadius: '12px',
            border: 0,
            background: activeTab === 'school' ? '#ffffff' : 'transparent',
            color: activeTab === 'school' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'school' ? '0 3px 8px rgba(0,0,0,0.06)' : 'none',
            fontSize: '11.5px',
            fontWeight: 850,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <Backpack size={16} color={activeTab === 'school' ? '#4f46e5' : '#64748b'} />
          <span>School Bag</span>
        </button>

        <button
          onClick={() => {
            playPop();
            setActiveTab('arena');
          }}
          style={{
            padding: '9px 8px',
            flexShrink: 0,
            borderRadius: '12px',
            border: 0,
            background: activeTab === 'arena' ? '#ffffff' : 'transparent',
            color: activeTab === 'arena' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'arena' ? '0 3px 8px rgba(0,0,0,0.06)' : 'none',
            fontSize: '11.5px',
            fontWeight: 850,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <Brain size={16} color={activeTab === 'arena' ? '#0284c7' : '#64748b'} />
          <span>Flashcards</span>
        </button>

        <button
          onClick={() => {
            playPop();
            setActiveTab('picturebook');
          }}
          style={{
            padding: '9px 8px',
            flexShrink: 0,
            borderRadius: '12px',
            border: 0,
            background: activeTab === 'picturebook' ? '#ffffff' : 'transparent',
            color: activeTab === 'picturebook' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'picturebook' ? '0 3px 8px rgba(0,0,0,0.06)' : 'none',
            fontSize: '11.5px',
            fontWeight: 850,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <BookOpen size={16} color={activeTab === 'picturebook' ? '#0284c7' : '#64748b'} />
          <span>Picture Book</span>
        </button>

        <button
          onClick={() => {
            playPop();
            setActiveTab('curriculum');
          }}
          style={{
            padding: '9px 8px',
            flexShrink: 0,
            borderRadius: '12px',
            border: 0,
            background: activeTab === 'curriculum' ? '#ffffff' : 'transparent',
            color: activeTab === 'curriculum' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'curriculum' ? '0 3px 8px rgba(0,0,0,0.06)' : 'none',
            fontSize: '11.5px',
            fontWeight: 850,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <Layers size={16} color={activeTab === 'curriculum' ? '#0284c7' : '#64748b'} />
          <span>Curriculum</span>
        </button>

        <button
          onClick={() => {
            playPop();
            setActiveTab('encyclopedia');
          }}
          style={{
            padding: '9px 8px',
            flexShrink: 0,
            borderRadius: '12px',
            border: 0,
            background: activeTab === 'encyclopedia' ? '#ffffff' : 'transparent',
            color: activeTab === 'encyclopedia' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'encyclopedia' ? '0 3px 8px rgba(0,0,0,0.06)' : 'none',
            fontSize: '11.5px',
            fontWeight: 850,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <Sparkles size={16} color={activeTab === 'encyclopedia' ? '#0284c7' : '#64748b'} />
          <span>Word Index</span>
        </button>

        {/* Stories Tab — EWA-style reader with 1,400 grade-calibrated stories */}
        <button
          onClick={() => {
            playPop();
            setActiveTab('stories');
          }}
          style={{
            padding: '9px 8px',
            flexShrink: 0,
            borderRadius: '12px',
            border: 0,
            background: activeTab === 'stories' ? '#ffffff' : 'transparent',
            color: activeTab === 'stories' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'stories' ? '0 3px 8px rgba(0,0,0,0.06)' : 'none',
            fontSize: '11.5px',
            fontWeight: 850,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <BookOpen size={16} color={activeTab === 'stories' ? '#db2777' : '#64748b'} />
          <span>Stories</span>
        </button>

        {/* Phonics Tab */}
        <button
          onClick={() => { playPop(); setActiveTab('phonics'); }}
          style={{
            padding: '9px 4px', borderRadius: '12px', border: 0,
            background: activeTab === 'phonics' ? '#ffffff' : 'transparent',
            color: activeTab === 'phonics' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'phonics' ? '0 3px 8px rgba(0,0,0,0.06)' : 'none',
            fontSize: '11.5px', fontWeight: 850, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px'
          }}
        >
          <span style={{ fontSize: '16px', lineHeight: 1 }}>🔤</span>
          <span>Phonics</span>
        </button>

        {/* Reels Tab */}
        <button
          onClick={() => { playPop(); setActiveTab('reels'); }}
          style={{
            padding: '9px 4px', borderRadius: '12px', border: 0,
            background: activeTab === 'reels' ? '#ffffff' : 'transparent',
            color: activeTab === 'reels' ? '#0f172a' : '#64748b',
            boxShadow: activeTab === 'reels' ? '0 3px 8px rgba(0,0,0,0.06)' : 'none',
            fontSize: '11.5px', fontWeight: 850, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px'
          }}
        >
          <span style={{ fontSize: '16px', lineHeight: 1 }}>🎬</span>
          <span>Reels</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* MODE -1: 500 MATH LAB (STRICTLY FOR ACTIVE GRADE)                    */}
      {/* ==================================================================== */}
      {activeTab === 'mathlab' && (
        <MathLabSection />
      )}

      {/* ==================================================================== */}
      {/* MODE -2: 500+ WORDS CATALOG + GRADE 3 CORE PRACTICE (500 QUESTIONS)  */}
      {/* ==================================================================== */}
      {activeTab === 'gradewords' && (
        <GradeWordBankSection />
      )}

      {/* ==================================================================== */}
      {/* MODE 0: 100-LEVEL PROGRESSION MAP (STRICTLY FOR ACTIVE GRADE)        */}
      {/* ==================================================================== */}
      {activeTab === 'adventure' && (
        <GradeLevelAdventure />
      )}

      {/* ==================================================================== */}
      {/* MODE 0B: MY SCHOOL BAG (HOMEWORK WORDS WITH FREE AI EXTRACTION)      */}
      {/* ==================================================================== */}
      {activeTab === 'school' && (
        <SchoolWordsSection />
      )}

      {/* ==================================================================== */}
      {/* MODE 1: PICTURE BOOK & CATEGORIES (MATCHING SCREENSHOTS 1 & 5)       */}
      {/* ==================================================================== */}
      {activeTab === 'picturebook' && (
        <div>
          {/* Smart Search Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#ffffff',
              border: '2px solid #cbd5e1',
              borderRadius: '16px',
              padding: '9px 14px',
              marginBottom: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
          >
            <Search size={18} color="#0284c7" />
            <input
              type="text"
              value={pictureQuery}
              onChange={(e) => setPictureQuery(e.target.value)}
              placeholder="Search animals, vehicles, school items, words..."
              style={{
                border: 0,
                outline: 'none',
                width: '100%',
                fontSize: '13.5px',
                fontWeight: 650,
                background: 'transparent'
              }}
            />
            {pictureQuery && (
              <button
                onClick={() => setPictureQuery('')}
                style={{ border: 0, background: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '12px', fontWeight: 800 }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Selector Pills Row */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '8px',
              marginBottom: '14px',
              minWidth: 0,
              scrollbarWidth: 'none'
            }}
          >
            {PICTURE_CATEGORIES.map((cat) => {
              const isSelected = pictureCategory === cat.id && !pictureQuery;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playPop();
                    setPictureCategory(cat.id);
                    setPictureQuery('');
                  }}
                  style={{
                    padding: '7px 13px',
                    borderRadius: '99px',
                    border: isSelected ? '2px solid #0284c7' : '1.5px solid #e2e8f0',
                    background: isSelected ? '#e0f2fe' : '#ffffff',
                    color: isSelected ? '#0369a1' : '#475569',
                    fontSize: '12px',
                    fontWeight: 850,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Picture Cards Grid (50+ Items) */}
          <div className="pictureGrid">
            {pictureCardsList.map((item) => (
              <div
                key={item.id}
                className="pictureCard"
                onClick={() => {
                  playPop();
                  setSelectedPictureCard(item);
                  setPictureQuizAnswer(null);
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.word}
                  className="pictureCardPhoto"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div style={{ marginTop: '8px', width: '100%' }}>
                  <span className="pictureCardCategory">
                    {item.emoji} {item.categoryName}
                  </span>
                  <div className="pictureCardTitle">{item.word}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
                    {item.phonetic}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(item.audioText || item.word);
                  }}
                  style={{
                    marginTop: '8px',
                    width: '100%',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '10px',
                    padding: '6px',
                    color: '#1d4ed8',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <Volume2 size={13} /> Listen
                </button>
              </div>
            ))}
          </div>

          {/* Detail & Mini-Quiz Modal for Picture Card (Matching Screenshot 5) */}
          {selectedPictureCard && (
            <div className="modal" style={{ zIndex: 100 }}>
              <div className="modalPanel compact">
                <button
                  onClick={() => setSelectedPictureCard(null)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    border: '1.5px solid #bfdbfe',
                    borderRadius: '12px',
                    padding: '6px 14px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    marginBottom: '10px'
                  }}
                >
                  <ArrowLeft size={15} /> Close
                </button>

                <img
                  src={selectedPictureCard.imageUrl}
                  alt={selectedPictureCard.word}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '18px' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>
                      {selectedPictureCard.emoji} {selectedPictureCard.word}
                    </h2>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>
                      {selectedPictureCard.phonetic} · {selectedPictureCard.categoryName}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSpeak(selectedPictureCard.audioText || `${selectedPictureCard.word}. ${selectedPictureCard.kidDefinition}`)}
                    style={{
                      background: '#e0f2fe',
                      border: '1.5px solid #bae6fd',
                      color: '#0284c7',
                      borderRadius: '50%',
                      width: '38px',
                      height: '38px',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer'
                    }}
                    title="Listen"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>

                <p style={{ fontSize: '14px', color: '#334155', fontWeight: 650, margin: '10px 0 8px' }}>
                  &ldquo;{selectedPictureCard.kidDefinition}&rdquo;
                </p>

                <div
                  style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    borderLeft: '4px solid #0284c7',
                    fontSize: '12.5px',
                    color: '#475569',
                    marginBottom: '14px'
                  }}
                >
                  <strong>Fun Fact:</strong> {selectedPictureCard.funFact}
                </div>

                {/* Mini Quiz */}
                {selectedPictureCard.quiz && (
                  <div style={{ background: '#eff6ff', borderRadius: '16px', padding: '14px', border: '1.5px solid #bfdbfe' }}>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: '#1d4ed8', textTransform: 'uppercase', marginBottom: '4px' }}>
                      🌟 Quick Check Challenge
                    </div>
                    <div style={{ fontSize: '13.5px', fontWeight: 750, color: '#0f172a', marginBottom: '10px' }}>
                      {selectedPictureCard.quiz.prompt}
                    </div>

                    <div style={{ display: 'grid', gap: '6px' }}>
                      {selectedPictureCard.quiz.choices.map((choice, cIdx) => {
                        const isChosen = pictureQuizAnswer === cIdx;
                        const isCorrect = cIdx === selectedPictureCard.quiz.answer;
                        let btnBg = '#ffffff';
                        let btnBorder = '#cbd5e1';
                        let btnColor = '#0f172a';

                        if (pictureQuizAnswer !== null) {
                          if (isCorrect) {
                            btnBg = '#ecfdf5';
                            btnBorder = '#10b981';
                            btnColor = '#047857';
                          } else if (isChosen) {
                            btnBg = '#fef2f2';
                            btnBorder = '#ef4444';
                            btnColor = '#b91c1c';
                          }
                        }

                        return (
                          <button
                            key={choice}
                            onClick={() => {
                              if (pictureQuizAnswer !== null) return;
                              setPictureQuizAnswer(cIdx);
                              if (isCorrect) {
                                playCorrect();
                                fireConfetti(true);
                                complete(`pic-${selectedPictureCard.id}`, 10, 1);
                              } else {
                                playIncorrect();
                              }
                            }}
                            style={{
                              padding: '10px 12px',
                              borderRadius: '12px',
                              border: `1.5px solid ${btnBorder}`,
                              background: btnBg,
                              color: btnColor,
                              fontSize: '12.5px',
                              fontWeight: 750,
                              textAlign: 'left',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span>{choice}</span>
                            {pictureQuizAnswer !== null && isCorrect && <Check size={16} color="#10b981" />}
                          </button>
                        );
                      })}
                    </div>

                    {pictureQuizAnswer !== null && (
                      <div style={{ marginTop: '10px', fontSize: '12px', color: '#1e293b', fontWeight: 650 }}>
                        {selectedPictureCard.quiz.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODE 2: FLASHCARD ARENA (SCREENSHOTS 2, 3, 4, 5)                     */}
      {/* ==================================================================== */}
      {activeTab === 'arena' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {/* Mode Selector Chips */}
          <div className="playModeBar">
            <button
              className={`playModeChip ${arenaPlayMode === 'deck' ? 'active' : ''}`}
              onClick={() => {
                playPop();
                setArenaPlayMode('deck');
              }}
            >
              <span>🃏 3D Stacked Deck</span>
            </button>
            <button
              className={`playModeChip ${arenaPlayMode === 'match' ? 'active' : ''}`}
              onClick={() => {
                playPop();
                setArenaPlayMode('match');
              }}
            >
              <span>🧩 Word-to-Pic Match</span>
            </button>
            <button
              className={`playModeChip ${arenaPlayMode === 'scavenger' ? 'active' : ''}`}
              onClick={() => {
                playPop();
                setArenaPlayMode('scavenger');
                setScavengerSelected(null);
                setScavengerTargetIdx(Math.floor(Math.random() * WORD_ENCYCLOPEDIA.length));
              }}
            >
              <span>🕵️ Scavenger Match</span>
            </button>
            <button
              className={`playModeChip ${arenaPlayMode === 'speed' ? 'active' : ''}`}
              onClick={() => {
                playPop();
                setArenaPlayMode('speed');
                handleStartSpeedSprint();
              }}
            >
              <span>🏃 Speed Sprint</span>
            </button>
            <button
              className="playModeChip"
              onClick={() => {
                playPop();
                handleOpenWordEntry(currentFlashcard);
              }}
            >
              <span>🤖 Ask AI Teacher</span>
            </button>
          </div>

          {/* 1. 3D STACKED PHYSICAL FLASHCARD DECK (SCREENSHOTS 3 & 5) */}
          {arenaPlayMode === 'deck' && (
            <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', marginBottom: '6px' }}>
                Tap the card to flip between Front & Back
              </div>

              {/* Physical Stacked Deck Card */}
              <div
                className="physicalCardDeck"
                onClick={() => {
                  playPop();
                  setCardFlipped(!cardFlipped);
                }}
              >
                {/* Header info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#0284c7', background: '#e0f2fe', padding: '3px 10px', borderRadius: '99px' }}>
                    CARD {((cardIndex % WORD_ENCYCLOPEDIA.length) + 1)} / {WORD_ENCYCLOPEDIA.length}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: cardFlipped ? '#0284c7' : '#64748b' }}>
                    {cardFlipped ? '🧠 MEMORY BACK' : '🔍 TAP TO FLIP'}
                  </span>
                </div>

                {!cardFlipped ? (
                  <div style={{ width: '100%', textAlign: 'center', margin: 'auto 0' }}>
                    {/* Letter + Photo (Matching Screenshot 3) */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', margin: '12px 0' }}>
                      <div className="bigLetterBadge" style={{ color: '#ef4444' }}>
                        {currentFlashcard.word.charAt(0).toUpperCase()}
                      </div>
                      {currentFlashcard.imageUrl && (
                        <img
                          src={currentFlashcard.imageUrl}
                          alt={currentFlashcard.word}
                          style={{
                            width: '135px',
                            height: '135px',
                            objectFit: 'cover',
                            borderRadius: '20px',
                            boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
                          }}
                        />
                      )}
                    </div>

                    <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', margin: '6px 0 2px' }}>
                      {currentFlashcard.word.charAt(0).toUpperCase()} For {currentFlashcard.word}
                    </h2>
                    <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 700 }}>
                      {currentFlashcard.phonetic} · Gr {currentFlashcard.grade}
                    </div>
                  </div>
                ) : (
                  <div style={{ width: '100%', textAlign: 'left', margin: 'auto 0', padding: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px' }}>
                      Kid-Friendly Definition
                    </div>
                    <p style={{ fontSize: '15px', fontWeight: 750, color: '#0f172a', margin: '0 0 10px', lineHeight: 1.4 }}>
                      &ldquo;{currentFlashcard.kidDefinition}&rdquo;
                    </p>
                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '10px 12px', borderLeft: '4px solid #0284c7', marginBottom: '10px', fontSize: '12px', color: '#334155' }}>
                      💡 <strong>Mnemonic Superpower:</strong> {currentFlashcard.mnemonicTrick}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', fontStyle: 'italic' }}>
                      &ldquo;{currentFlashcard.teacherSentence}&rdquo;
                    </div>
                  </div>
                )}

                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>
                  Tap card to reveal definition & mnemonic
                </div>
              </div>

              {/* Tactile Audio Control Pod (Matching Screenshot 3 & 5) */}
              <div className="audioControlPod">
                <button
                  className="audioPodBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    playPop();
                    setCardFlipped(false);
                    setCardIndex((i) => (i - 1 + WORD_ENCYCLOPEDIA.length) % WORD_ENCYCLOPEDIA.length);
                  }}
                  title="Previous Card"
                >
                  ◀
                </button>

                <button
                  className="audioPodBtn main"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(`${currentFlashcard.word.charAt(0).toUpperCase()} for ${currentFlashcard.word}. ${currentFlashcard.kidDefinition}`);
                  }}
                  title="Play Audio Sound"
                >
                  🔊
                </button>

                <button
                  className="audioPodBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    playPop();
                    setCardFlipped(false);
                    setCardIndex((i) => (i + 1) % WORD_ENCYCLOPEDIA.length);
                  }}
                  title="Next Card"
                >
                  ▶
                </button>
              </div>
            </div>
          )}

          {/* 2. WORD-TO-PICTURE MATCH ARENA (SCREENSHOT 4) */}
          {arenaPlayMode === 'match' && (
            <WordPictureMatchGame
              onRoundComplete={(xp) => {
                complete('word-pic-match-round', xp, 2);
              }}
            />
          )}

          {/* 3. SCAVENGER MATCH MODE */}
          {arenaPlayMode === 'scavenger' && (
            <div style={{ width: '100%', maxWidth: '440px' }}>
              {(() => {
                const target = WORD_ENCYCLOPEDIA[scavengerTargetIdx % WORD_ENCYCLOPEDIA.length];
                const otherWords = WORD_ENCYCLOPEDIA.filter((w) => w.id !== target.id);
                const choices = [target, otherWords[0], otherWords[1], otherWords[2]].sort(() => 0.5 - Math.random());

                return (
                  <div>
                    <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '18px', padding: '14px', marginBottom: '14px', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', fontWeight: 900, color: '#0284c7', textTransform: 'uppercase' }}>
                        🕵️ Scavenger Clue
                      </div>
                      <h3 style={{ margin: '6px 0 2px', fontSize: '16px', color: '#0f172a' }}>
                        &ldquo;{target.kidDefinition}&rdquo;
                      </h3>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                        Which word card matches this meaning?
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      {choices.map((c) => {
                        const isChosen = scavengerSelected === c.id;
                        const isTarget = c.id === target.id;
                        let cardBg = '#ffffff';
                        let cardBorder = '#cbd5e1';

                        if (scavengerSelected) {
                          if (isTarget) {
                            cardBg = '#ecfdf5';
                            cardBorder = '#10b981';
                          } else if (isChosen) {
                            cardBg = '#fef2f2';
                            cardBorder = '#ef4444';
                          }
                        }

                        return (
                          <div
                            key={c.id}
                            onClick={() => {
                              if (scavengerSelected) return;
                              setScavengerSelected(c.id);
                              if (isTarget) {
                                playCorrect();
                                fireConfetti(true);
                                complete('scavenger-win', 15, 1);
                              } else {
                                playIncorrect();
                              }
                            }}
                            style={{
                              background: cardBg,
                              border: `2px solid ${cardBorder}`,
                              borderRadius: '18px',
                              padding: '10px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              boxShadow: '0 3px 10px rgba(0,0,0,0.04)'
                            }}
                          >
                            <img
                              src={c.imageUrl}
                              alt={c.word}
                              style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '12px' }}
                            />
                            <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
                              {c.word}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {scavengerSelected && (
                      <button
                        onClick={() => {
                          playPop();
                          setScavengerSelected(null);
                          setScavengerTargetIdx((i) => (i + 1) % WORD_ENCYCLOPEDIA.length);
                        }}
                        className="glossyPillBtn"
                        style={{ width: '100%', marginTop: '14px', padding: '12px' }}
                      >
                        Next Scavenger Clue →
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* 4. SPEED SPRINT MODE */}
          {arenaPlayMode === 'speed' && (
            <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontWeight: 900, color: speedTimer <= 5 ? '#ef4444' : '#0284c7' }}>
                  <Timer size={18} />
                  <span>{speedTimer}s Left</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#10b981' }}>
                  ⭐ Score: {speedScore}
                </div>
              </div>

              {isSpeedRunning ? (
                <div>
                  <div style={{ background: '#ffffff', borderRadius: '20px', border: '2px solid #bae6fd', padding: '16px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 900, color: '#64748b' }}>
                      QUICK! Tap the card matching:
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0284c7', margin: '6px 0' }}>
                      &ldquo;{currentFlashcard.word}&rdquo;
                    </h2>
                    <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>
                      {currentFlashcard.kidDefinition}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {[currentFlashcard, WORD_ENCYCLOPEDIA[(cardIndex + 1) % WORD_ENCYCLOPEDIA.length]].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.id === currentFlashcard.id) {
                            playCorrect();
                            setSpeedScore((s) => s + 1);
                            setCardIndex((i) => (i + 1) % WORD_ENCYCLOPEDIA.length);
                          } else {
                            playIncorrect();
                          }
                        }}
                        style={{
                          background: '#ffffff',
                          border: '2px solid #cbd5e1',
                          borderRadius: '16px',
                          padding: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.word}
                          style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '12px' }}
                        />
                        <div style={{ fontSize: '14px', fontWeight: 900, marginTop: '6px' }}>
                          {item.word}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '2px solid #e2e8f0' }}>
                  <Trophy size={48} color="#f59e0b" style={{ margin: '0 auto 10px' }} />
                  <h2 style={{ margin: '0 0 6px', fontSize: '22px' }}>Speed Sprint Finished!</h2>
                  <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 16px' }}>
                    You scored {speedScore} correct matches in 15 seconds!
                  </p>
                  <button
                    onClick={handleStartSpeedSprint}
                    className="glossyPillBtn"
                    style={{ padding: '12px 24px', margin: '0 auto' }}
                  >
                    Play Again ⚡
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODE 3: CURRICULUM JOURNEY (GRADES K-6 & ADVENTURE MAP)              */}
      {/* ==================================================================== */}
      {activeTab === 'curriculum' && (
        <div>
          {/* Grade Selector Rail */}
          <div className="gradeRail" style={{ maxWidth: '100%', minWidth: 0, marginBottom: '8px' }}>
            {grades.map((x) => (
              <button
                key={x}
                className={grade === x ? 'selected' : ''}
                onClick={() => {
                  playPop();
                  setGrade(x);
                }}
              >
                Grade {x}
              </button>
            ))}
          </div>

          {/* Subject Tabs */}
          <div className="subjectTabs" style={{ maxWidth: '100%', minWidth: 0, margin: '8px 0 14px' }}>
            <button
              className={subject === 'all' ? 'selected' : ''}
              onClick={() => {
                playPop();
                setSubject('all');
              }}
            >
              All subjects
            </button>
            {subjects
              .filter((x) => (grade === '3' ? true : x.id !== 'week5'))
              .map((x) => (
                <button
                  key={x.id}
                  className={subject === x.id ? 'selected' : ''}
                  onClick={() => {
                    playPop();
                    setSubject(x.id);
                  }}
                >
                  {x.icon} {x.name}
                </button>
              ))}
          </div>

          {/* Duolingo / Golingo Level Adventure Map */}
          <div style={{ marginBottom: '14px', background: '#ffffff', borderRadius: '22px', border: '1.5px solid #e2e8f0', padding: '14px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Compass size={18} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>
                  Adventure Trail · Grade {grade}
                </h3>
              </div>
              <button
                onClick={() => setShowJourneyRoadmap(!showJourneyRoadmap)}
                style={{
                  border: 0,
                  background: '#f1f5f9',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                {showJourneyRoadmap ? 'Hide Map' : 'Show Map 🗺️'}
              </button>
            </div>

            {showJourneyRoadmap && (
              <JourneyMap
                activeSubject={subject === 'all' ? 'Curriculum' : subject}
                items={lessonList.slice(0, 5)}
                activeStageIndex={0}
                onSelectStage={(idx) => {
                  if (lessonList[idx]) setActiveLesson(lessonList[idx]);
                }}
                onLaunchExam={() => {
                  if (lessonList[0]) setActiveLesson(lessonList[0]);
                }}
              />
            )}
          </div>

          {/* Lessons Grid with Verified Photos */}
          <div className="lessonGrid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {lessonList.map((l) => {
              const isDone = child.completed.includes(l.id);
              const matchedWord = WORD_ENCYCLOPEDIA.find((w) => w.word.toLowerCase() === (l.word || l.title).toLowerCase());

              return (
                <Card key={l.id}>
                  <div className="cardTop">
                    <span>
                      {subjects.find((x) => x.id === l.subject)?.icon}{' '}
                      {subjects.find((x) => x.id === l.subject)?.name || l.subject}
                    </span>
                    <span>{l.duration} min</span>
                  </div>

                  {l.imageUrl ? (
                    <img src={l.imageUrl} alt={l.title} className="lessonImg" loading="lazy" />
                  ) : (
                    <div className="bigEmoji">{l.emoji}</div>
                  )}

                  <h3 style={{ fontSize: '18px', fontWeight: 850 }}>{l.title}</h3>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>{l.description}</p>

                  <div className="cardFoot">
                    <span className="pill">+{l.xp} XP</span>
                    <button
                      className="primary small"
                      onClick={() => {
                        playPop();
                        if (matchedWord) {
                          setSelectedWordEntry(matchedWord);
                        } else {
                          setActiveLesson(l);
                        }
                      }}
                    >
                      {isDone ? <CheckCircle2 size={14} /> : <Play size={14} />}
                      {matchedWord ? 'AI Teach' : isDone ? 'Review' : 'Open'}
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODE 4: AI WORD INDEX (WITH REAL HIGH-RES PHOTOGRAPHY)                */}
      {/* ==================================================================== */}
      {activeTab === 'encyclopedia' && (
        <div>
          {/* Smart Search Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#ffffff',
              border: '2px solid #cbd5e1',
              borderRadius: '16px',
              padding: '10px 14px',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
          >
            <Search size={18} color="#0284c7" />
            <input
              type="text"
              value={dictQuery}
              onChange={(e) => setDictQuery(e.target.value)}
              placeholder="Search vocabulary words (oppose, snide, heap, diverse, origin)..."
              style={{
                border: 0,
                outline: 'none',
                width: '100%',
                fontSize: '14px',
                fontWeight: 650,
                background: 'transparent'
              }}
            />
            {dictQuery && (
              <button
                onClick={() => setDictQuery('')}
                style={{ border: 0, background: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '13px', fontWeight: 800 }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Word Pills Filter */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px', minWidth: 0 }}>
            {['All Words', 'oppose', 'snide', 'heap', 'diverse', 'origin', 'curious', 'analyze'].map((w) => {
              const isSelected = (w === 'All Words' && !dictQuery) || dictQuery.toLowerCase() === w.toLowerCase();
              return (
                <button
                  key={w}
                  onClick={() => {
                    playPop();
                    setDictQuery(w === 'All Words' ? '' : w);
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '99px',
                    border: isSelected ? '2px solid #0284c7' : '1.5px solid #e2e8f0',
                    background: isSelected ? '#e0f2fe' : '#ffffff',
                    color: isSelected ? '#0369a1' : '#475569',
                    fontSize: '12px',
                    fontWeight: 850,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {w}
                </button>
              );
            })}
          </div>

          {/* Results Grid with Photos on Every Card */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '12px' }}>
            {encyclopediaResults.map((entry) => (
              <div
                key={entry.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '14px',
                  border: '1.5px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div>
                  {entry.imageUrl && (
                    <img
                      src={entry.imageUrl}
                      alt={entry.word}
                      style={{
                        width: '100%',
                        height: '130px',
                        objectFit: 'cover',
                        borderRadius: '14px',
                        marginBottom: '10px'
                      }}
                      loading="lazy"
                    />
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
                          {entry.word}
                        </h3>
                        <button
                          onClick={() => handleSpeak(entry.word)}
                          style={{
                            background: '#e0f2fe',
                            border: 0,
                            color: '#0284c7',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            display: 'grid',
                            placeItems: 'center',
                            cursor: 'pointer'
                          }}
                          title="Listen"
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginTop: '2px' }}>
                        {entry.phonetic} · {entry.partOfSpeech}
                      </div>
                    </div>

                    <span style={{ fontSize: '10px', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontWeight: 900 }}>
                      Gr {entry.grade}
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: '#334155', margin: '8px 0', lineHeight: 1.35, fontWeight: 650 }}>
                    {entry.kidDefinition}
                  </p>

                  {entry.mnemonicTrick && (
                    <div
                      style={{
                        background: '#f8fafc',
                        borderRadius: '10px',
                        padding: '8px 10px',
                        fontSize: '11.5px',
                        color: '#475569',
                        lineHeight: 1.35,
                        borderLeft: '3px solid #0284c7',
                        marginBottom: '8px'
                      }}
                    >
                      <strong>Mnemonic:</strong> {entry.mnemonicTrick}
                    </div>
                  )}
                </div>

                <button
                  className="primary full"
                  onClick={() => handleOpenWordEntry(entry)}
                  style={{
                    padding: '9px 12px',
                    fontSize: '12.5px',
                    fontWeight: 850,
                    borderRadius: '12px',
                    marginTop: '8px'
                  }}
                >
                  <Sparkles size={15} /> Learn with AI Master Teacher
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* STORIES TAB — EWA-style interactive story reader (1,400 stories K–6) */}
      {/* ==================================================================== */}
      {activeTab === 'stories' && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 200,
          background: '#fcfbf7',
        }}>
          <StoryReader onBack={() => setActiveTab('gradewords')} />
        </div>
      )}

      {/* Phonics Adventure Tab */}
      {activeTab === 'phonics' && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 200,
          background: '#f8f7ff',
        }}>
          <PhonicsAdventure onBack={() => setActiveTab('gradewords')} />
        </div>
      )}

      {/* Reels Tab */}
      {activeTab === 'reels' && (
        <KidsReels onBack={() => setActiveTab('gradewords')} />
      )}

      {/* Gemini AI Studio Modal */}
      {isGeminiStudioOpen && (
        <GeminiAIStudio onClose={() => setIsGeminiStudioOpen(false)} />
      )}

      {/* 10 Smart Vacation Study Habits Modal */}
      {isSmartHabitsOpen && (
        <SmartStudyHabitsModal
          onClose={() => setIsSmartHabitsOpen(false)}
          onRewardEarned={(bonusXp) => {
            complete('smart-habits-streak', bonusXp, 5);
          }}
        />
      )}

      {/* AI Master Teacher Modal */}
      {selectedWordEntry && (
        <AITeacherModal
          entry={selectedWordEntry}
          onClose={() => setSelectedWordEntry(null)}
          onMasteryComplete={(entryId) => {
            complete(`word-${entryId}`, 25, 4);
          }}
        />
      )}

      {/* Standard Lesson Player */}
      {activeLesson && (
        <LessonPlayer
          lesson={activeLesson}
          close={() => {
            playPop();
            setActiveLesson(null);
          }}
          done={(xp, min) => {
            complete(activeLesson.id, xp, min);
            setActiveLesson(null);
          }}
        />
      )}
    </div>
  );
}

function LessonPlayer({ lesson, close, done }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredIndex, setAnsweredIndex] = useState(null);
  const [finished, setFinished] = useState(false);

  const question = lesson.questions[index] || {
    prompt: `What did you learn about ${lesson.title}?`,
    choices: [lesson.description, 'None of the above', 'Skip', 'Try later'],
    answer: 0,
    explanation: lesson.description
  };

  const handleReadAloud = () => {
    const textToRead = `${question.prompt}. Choices are: ${question.choices.join(', ')}`;
    speakText(textToRead);
  };

  const choose = (choiceIdx) => {
    if (answeredIndex !== null) return;
    setAnsweredIndex(choiceIdx);
    if (choiceIdx === question.answer) {
      playCorrect();
      setScore((v) => v + 1);
    } else {
      playIncorrect();
    }
  };

  const next = () => {
    playPop();
    if (index < lesson.questions.length - 1) {
      setIndex((v) => v + 1);
      setAnsweredIndex(null);
    } else {
      fireConfetti(true);
      setFinished(true);
    }
  };

  return (
    <div className="modal" style={{ zIndex: 90 }}>
      <div className="modalPanel">
        <button
          onClick={close}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#eff6ff',
            color: '#1d4ed8',
            border: '1.5px solid #bfdbfe',
            borderRadius: '12px',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          <span>← Back to Lessons</span>
        </button>

        {!finished ? (
          <>
            <div className="playerTop">
              <span className="pill">
                Question {index + 1} of {lesson.questions.length}
              </span>
              <button
                className="iconBtn"
                onClick={handleReadAloud}
                title="Read question aloud"
              >
                <Volume2 size={18} />
              </button>
            </div>

            {lesson.imageUrl ? (
              <img src={lesson.imageUrl} alt={lesson.title} className="playerImg" />
            ) : (
              <div className="bigEmoji">{lesson.emoji}</div>
            )}

            {/* Question Board (Dark High-Contrast Card) */}
            <div
              style={{
                background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
                borderRadius: '18px',
                padding: '14px 16px',
                border: '2px solid #334155',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)',
                margin: '12px 0 16px',
                color: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '99px',
                    fontSize: '9.5px',
                    fontWeight: 900,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase'
                  }}
                >
                  QUESTION BOARD
                </span>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700 }}>
                  {lesson.title}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '15px',
                  fontWeight: 750,
                  lineHeight: 1.45,
                  color: '#f8fafc',
                  whiteSpace: 'pre-line'
                }}
              >
                {question.prompt}
              </p>
            </div>

            {/* Answer Choices (Tactile 3D Buttons with Badges) */}
            <div style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              Choose your answer:
            </div>
            <div className="choices" style={{ display: 'grid', gap: '8px' }}>
              {question.choices.map((choiceText, cIdx) => {
                const letters = ['🦁', '🐸', '🦋', '🐙'];
                const letterStyles = [
                  { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
                  { bg: '#faf5ff', text: '#7e22ce', border: '#e9d5ff' },
                  { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
                  { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' }
                ];
                const lStyle = letterStyles[cIdx % letterStyles.length];

                let cardBg = '#ffffff';
                let cardBorder = '#e2e8f0';
                let cardBottom = '#cbd5e1';
                let textColor = '#1e293b';

                if (answeredIndex !== null) {
                  if (cIdx === question.answer) {
                    cardBg = '#f0fdf4';
                    cardBorder = '#22c55e';
                    cardBottom = '#16a34a';
                    textColor = '#14532d';
                  } else if (cIdx === answeredIndex) {
                    cardBg = '#fef2f2';
                    cardBorder = '#ef4444';
                    cardBottom = '#dc2626';
                    textColor = '#7f1d1d';
                  }
                }

                return (
                  <button
                    key={cIdx}
                    onClick={() => choose(cIdx)}
                    disabled={answeredIndex !== null}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      background: cardBg,
                      border: `2px solid ${cardBorder}`,
                      borderBottom: `4px solid ${cardBottom}`,
                      borderRadius: '16px',
                      cursor: answeredIndex !== null ? 'default' : 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                    }}
                  >
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: lStyle.bg,
                        color: lStyle.text,
                        border: `1.5px solid ${lStyle.border}`,
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '12.5px',
                        fontWeight: 900,
                        flexShrink: 0
                      }}
                    >
                      {letters[cIdx]}
                    </span>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: textColor, flex: 1, lineHeight: 1.35 }}>
                      {choiceText}
                    </span>
                  </button>
                );
              })}
            </div>

            {answeredIndex !== null && (
              <div
                style={{
                  marginTop: '14px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: answeredIndex === question.answer ? '#f0fdf4' : '#fff7ed',
                  border: `1.5px solid ${answeredIndex === question.answer ? '#86efac' : '#fdba74'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 900, fontSize: '13.5px', color: answeredIndex === question.answer ? '#166534' : '#9a3412' }}>
                  {answeredIndex === question.answer ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Terrific job! That's correct!</span>
                    </>
                  ) : (
                    <>
                      <span>Keep going! Here's the key:</span>
                    </>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#334155', lineHeight: 1.4 }}>
                  {question.explanation}
                </p>
                <button
                  className="primary full"
                  onClick={next}
                  style={{ marginTop: '8px', padding: '10px 16px', fontSize: '13px' }}
                >
                  {index < lesson.questions.length - 1 ? 'Next Question →' : 'Finish Lesson 🎉'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="finish" style={{ padding: '24px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: '50px', marginBottom: '8px' }}>🏆</div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 6px', color: '#0f172a' }}>
              Lesson Mastered!
            </h2>
            <p style={{ color: '#64748b', fontSize: '13.5px', margin: '0 0 16px' }}>
              You answered {score} out of {lesson.questions.length} questions correctly and earned +{lesson.xp} XP!
            </p>
            <button
              className="primary"
              onClick={() => done(lesson.xp, lesson.duration)}
              style={{ padding: '12px 28px', fontSize: '14px' }}
            >
              Collect Rewards & Return
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
