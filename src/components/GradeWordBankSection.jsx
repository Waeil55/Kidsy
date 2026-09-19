import React, { useState, useMemo } from 'react';
import { Search, Volume2, VolumeX, Sparkles, BookOpen, Star, Filter } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { getWordsForGrade, searchGradeWords } from '../data/gradeWordBanks';
import { aiSpeak, stopAudio, playPop } from '../utils/audio';
import { Grade3CorePracticeModal } from './Grade3CorePracticeModal';
import { GradePracticeModal } from './GradePracticeModal';

export function GradeWordBankSection() {
  const { child } = useApp();
  const gradeKey = String(child.grade || '3').toUpperCase();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'core' | 'pos'
  const [isCorePracticeOpen, setIsCorePracticeOpen] = useState(false);
  const [isGradePracticeOpen, setIsGradePracticeOpen] = useState(false);

  const allWords = useMemo(() => {
    return getWordsForGrade(gradeKey);
  }, [gradeKey]);

  const filteredWords = useMemo(() => {
    let list = allWords;
    if (searchQuery.trim()) {
      list = searchGradeWords(gradeKey, searchQuery);
    }
    if (filterType === 'core') {
      list = list.filter(w => w.isCoreTeacherWord);
    }
    return list;
  }, [allWords, gradeKey, searchQuery, filterType]);

  const isGrade3 = gradeKey === '3';

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '24px',
      padding: '20px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: '#e0f2fe',
            color: '#0369a1',
            display: 'grid',
            placeItems: 'center',
            fontSize: '22px'
          }}>
            📚
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
                Grade {gradeKey} Word Catalog
              </h2>
              <span style={{
                background: '#0284c7',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '99px'
              }}>
                {allWords.length} WORDS
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
              {isGrade3
                ? '5 Core Teacher Guide Words + 500 Grade 3 Academic Vocabulary Words'
                : `500+ curated curriculum vocabulary words strictly for Grade ${gradeKey}`}
            </p>
          </div>
        </div>

        {/* Global Stop Voice & Core Practice Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              stopAudio();
              playPop();
            }}
            title="Stop AI Voice Speech"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fca5a5',
              borderRadius: '99px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <VolumeX size={14} /> Stop Voice ⏹️
          </button>

          <button
            onClick={() => {
              playPop();
              setIsGradePracticeOpen(true);
            }}
            title={`Start the Grade ${gradeKey} Practice Quest`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '99px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(139, 92, 246, 0.35)'
            }}
          >
            <Sparkles size={14} /> 500 Practice Qs 🎯
          </button>

          {isGrade3 && (
            <button
              onClick={() => {
                playPop();
                setIsCorePracticeOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '99px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(234, 179, 8, 0.3)'
              }}
            >
              <Sparkles size={14} /> 500 Core Practice Qs 🎯
            </button>
          )}
        </div>
      </div>

      {/* Grade 3 Core Words Highlight Banner */}
      {isGrade3 && (
        <div style={{
          background: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)',
          borderRadius: '16px',
          padding: '14px 16px',
          marginBottom: '16px',
          border: '2px solid #facc15',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 900, color: '#854d0e' }}>
              <Star size={15} fill="#eab308" color="#eab308" />
              <span>GRADE 3 CORE TEACHER GUIDE WORDS (WEEK 5)</span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#713f12', marginTop: '2px' }}>
              oppose · snide · heap · diverse · origin
            </div>
            <div style={{ fontSize: '12px', color: '#a16207', fontWeight: 600, marginTop: '2px' }}>
              500 comprehensive practice questions dedicated exclusively to these 5 words!
            </div>
          </div>

          <button
            onClick={() => {
              playPop();
              setIsCorePracticeOpen(true);
            }}
            style={{
              background: '#854d0e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Start Core Practice →
          </button>
        </div>
      )}

      {/* Search Bar & Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{
          flex: 1,
          minWidth: '220px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px' }} />
          <input
            type="text"
            placeholder={`Search all ${allWords.length} Grade ${gradeKey} words...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              padding: '10px 12px 10px 36px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#0f172a',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {isGrade3 && (
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => { playPop(); setFilterType('all'); }}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                border: filterType === 'all' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                background: filterType === 'all' ? '#e0f2fe' : '#ffffff',
                color: filterType === 'all' ? '#0369a1' : '#475569',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              All 505 Words
            </button>
            <button
              onClick={() => { playPop(); setFilterType('core'); }}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                border: filterType === 'core' ? '2px solid #eab308' : '1px solid #cbd5e1',
                background: filterType === 'core' ? '#fef9c3' : '#ffffff',
                color: filterType === 'core' ? '#854d0e' : '#475569',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ⭐ Core 5 Words
            </button>
          </div>
        )}
      </div>

      {/* Words Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '12px',
        maxHeight: '600px',
        overflowY: 'auto',
        paddingRight: '4px'
      }}>
        {filteredWords.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: item.isCoreTeacherWord ? '#fefce8' : '#f8fafc',
              border: item.isCoreTeacherWord ? '2px solid #facc15' : '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '14px',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
                    {item.displayTitle || item.word}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    background: item.isCoreTeacherWord ? '#fde047' : '#e2e8f0',
                    color: item.isCoreTeacherWord ? '#713f12' : '#475569',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    fontWeight: 800,
                    textTransform: 'uppercase'
                  }}>
                    {item.isCoreTeacherWord ? '⭐ CORE' : item.partOfSpeech}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#334155', fontWeight: 600, marginTop: '4px' }}>
                  {item.definition}
                </div>
              </div>

              <button
                onClick={() => aiSpeak(item.word)}
                title="Pronounce Word"
                style={{
                  background: '#e0f2fe',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px',
                  cursor: 'pointer',
                  color: '#0284c7',
                  flexShrink: 0
                }}
              >
                <Volume2 size={16} />
              </button>
            </div>

            {item.sentence && (
              <div style={{
                marginTop: '8px',
                padding: '8px 10px',
                background: '#ffffff',
                borderRadius: '10px',
                fontSize: '12px',
                color: '#475569',
                border: '1px solid #e2e8f0',
                fontStyle: 'italic'
              }}>
                "{item.sentence}"
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Core Practice Modal */}
      {isCorePracticeOpen && (
        <Grade3CorePracticeModal onClose={() => setIsCorePracticeOpen(false)} />
      )}

      {/* Grade Practice Modal */}
      {isGradePracticeOpen && (
        <GradePracticeModal onClose={() => setIsGradePracticeOpen(false)} />
      )}
    </div>
  );
}
