# Kidsy — Learn With Fun (KG – Grade 6)

A React app for kids in Kindergarten to Grade 6. Every grade has its own content, 50 levels,
500 stories (20 questions each, in 2 sets of 10) and 500 math problems.

## Open it right now (no install)
Double-click **`dist/kidsy-standalone.html`**. It is one file and works offline in Chrome, Edge, Safari or Firefox.
(The read-aloud voice works everywhere. Microphone answers and read-along need Chrome, Edge or Safari.)

## Run / change the source
```bash
npm install        # react, react-dom, react-icons, esbuild, pdfjs-dist
npm run build      # -> dist/index.html, dist/app.js, dist/app.css, dist/kidsy-standalone.html
npm run dev        # rebuilds on every change and serves http://localhost:5173
npm run serve      # serves the built ./dist on http://localhost:5173
npm test           # checks: 500 stories and 500 unique math questions in every grade
```
No Vite or webpack: the build is a small esbuild script in `scripts/build.mjs`.

## What is inside
| Area | Where |
|---|---|
| Story generator (500 per grade, 20 questions, 2 sets of 10) | `src/engine/stories.js`, `plots1.js`, `plots2.js`, `kit.js` |
| Math generator (500 per grade, 50 levels) | `src/engine/math.js` |
| Vocabulary, grammar, fill-in-the-blank, exams | `src/engine/quizzes.js`, `src/data/vocab.js` |
| Grade 3 ELA PDF, word for word | `src/data/g3ela.js`, `src/screens/G3Pack.jsx` |
| Upload a lesson (PDF, .docx, .txt, .csv, paste) | `src/engine/extract.js`, `src/screens/Upload.jsx` |
| Studio (make your own cards, words, questions, math, fill-ins, stories) | `src/screens/Studio.jsx` |
| Scores, levels, stickers, resets (localStorage) | `src/store/store.js` |
| Read-aloud, microphone, matching | `src/lib/speech.js`, `src/ui/QuizRunner.jsx`, `src/screens/Reader.jsx` |

## Scoring
Right answer = +1, wrong answer = −1, and the score never goes below 0. Nothing resets by itself:
use **Scores & stickers → Reset** (each reset asks first) or restore a backup file in **Me & settings**.

## Uploading lessons safely
A document is split at "Grade N" and subject headings. Every part is shown for review with its own
grade and subject, and is saved as its own lesson. Items are never merged across grades or subjects.
Photos/scans cannot be read offline: type or paste the text, or use the Studio.

## Publish on GitHub Pages
Push to the `main` branch and `.github/workflows/deploy-pages.yml` will build and
deploy `dist` automatically. In the repository settings, set **Pages -> Build and
deployment -> Source** to **GitHub Actions**.
