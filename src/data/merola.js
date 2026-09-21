import { lessonData } from './merola/lessonData.js';
import { readingSentences } from './merola/readingData.js';
import { storiesData } from './merola/storiesData.js';
import { wordPartsData } from './merola/wordPartsData.js';
import { spellingWords } from './merola/writingData.js';

const quizItem = (item, id, subject) => ({
  id,
  q: item.qText || item.q,
  options: item.opts,
  answer: item.c,
  subject,
});

export const merolaLessons = lessonData.map((group, groupIndex) => ({
  ...group,
  items: group.qs.map((item, index) => quizItem(item, `lesson-${groupIndex}-${index}`, 'vocab')),
}));

export const merolaWordParts = wordPartsData.map((group, groupIndex) => ({
  ...group,
  items: group.qs.map((item, index) => quizItem(item, `parts-${groupIndex}-${index}`, 'vocab')),
}));

export const merolaStories = storiesData.map((story, storyIndex) => ({
  ...story,
  items: story.qs.map((item, index) => quizItem(item, `story-${storyIndex}-${index}`, 'reading')),
}));

export { readingSentences, spellingWords };

export const merolaCounts = {
  lessons: merolaLessons.length,
  lessonQuestions: merolaLessons.reduce((sum, group) => sum + group.items.length, 0),
  stories: merolaStories.length,
  wordParts: merolaWordParts.length,
  readingSentences: readingSentences.length,
  spellingWords: spellingWords.length,
};