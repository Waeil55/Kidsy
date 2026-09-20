/**
 * Kidsy — ONE unified data source (deduped facade).
 * All screens import from here instead of the 16 scattered banks.
 * Week-5 core set, story libraries, word banks each have a SINGLE source below.
 */

// ─── Single source: Week-5 Grade-3 core words (was duplicated in 6 banks) ───
export const WEEK5_CORE_WORDS = ['oppose', 'snide', 'heap', 'diverse', 'origin'];

// ─── Vocabulary: curated base + expanded banks + practice ───
export { CURATED } from './curatedGradeWords.js';
export {
  GRADE_3_CORE_TEACHER_WORDS,
  getWordsForGrade,
  searchGradeWords,
  getGradeCoreTeacherWords,
} from './gradeWordBanks.js';
export { buildGradePracticeQuestions, getGradePracticeQuestions } from './gradePracticeBank.js';
export { generateGrade3Core500Questions, getGrade3Core500Questions } from './grade3Core500Bank.js';
export { WORD_ENCYCLOPEDIA, searchEncyclopedia } from './wordEncyclopedia.js';

// ─── Curriculum + lessons (single facade over DEFAULT + other grades) ───
export {
  grades as GRADES_LIST,
  subjects as SUBJECTS_LIST,
  staticLessons as STATIC_LESSONS,
  getCustomParentLessons,
  getLessons,
} from './curriculum.js';
export { DEFAULT_CURRICULUM } from './curriculumData.js';
export { OTHER_GRADES_LESSONS } from './otherGradesCurriculum.js';
export { MASSIVE_CHALLENGES, getChallengeBatch } from './massiveChallengeBank.js';
export { shuffleArray as shuffleChallengeArray } from './massiveChallengeBank.js';

// ─── Math (single source, 500 Qs/grade) ───
export { getGradeMathQuestions, getMathQuiz, getMathCategories } from './mathMasterBank.js';

// ─── Levels (single source, 100 levels/grade) ───
export { getStageForLevel, getGradeLevels, getLevelData, getGradeProgressStats } from './levelProgressionEngine.js';

// ─── Phonics + picture books ───
export {
  PHONICS_WORDS,
  SOUND_GROUPS,
  getWordsByGrade as getPhonicsWordsByGrade,
  getWordsBySound,
  shuffle as shufflePhonics,
} from './phonicsWords.js';
export { PICTURE_CATEGORIES, PICTURE_CARDS, getCardsByCategory, searchPictureCards } from './pictureBookCategories.js';

// ─── Stories: early (600) + upper (800) merged into ONE list ───
import { EARLY_GRADE_STORIES, TOTAL_EARLY_STORIES } from './storyLibrary_early.js';
import { UPPER_GRADE_STORIES, TOTAL_UPPER_STORIES } from './storyLibrary_upper.js';
export { EARLY_GRADE_STORIES, UPPER_GRADE_STORIES };
export const ALL_STORIES = [...EARLY_GRADE_STORIES, ...UPPER_GRADE_STORIES];
export const TOTAL_STORIES = TOTAL_EARLY_STORIES + TOTAL_UPPER_STORIES;
export function getStoriesForGrade(grade) {
  const g = String(grade).toUpperCase();
  return ALL_STORIES.filter((s) => String(s.grade).toUpperCase() === g || String(s.grade) === String(grade));
}

// ─── Story dictionary (duplicate "in" key removed at source) ───
export { STORY_WORD_DICTIONARY, lookupWord, getGradeWords as getDictionaryGradeWords } from './storyWordDictionary.js';

// ─── Global search across words + encyclopedia + stories ───
import { searchGradeWords as _searchGradeWords } from './gradeWordBanks.js';
import { searchEncyclopedia as _searchEncyclopedia } from './wordEncyclopedia.js';
import { searchPictureCards as _searchPictureCards } from './pictureBookCategories.js';
export function searchAllContent(grade, query) {
  return {
    words: _searchGradeWords(grade, query),
    encyclopedia: _searchEncyclopedia(query, grade),
    pictures: _searchPictureCards(query),
  };
}
