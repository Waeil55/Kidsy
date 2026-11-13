# Kidsy — Learn With Fun (KG – Grade 6)

A React app for kids in Kindergarten to Grade 6. Every grade has its own content, 50 levels,
500 stories (20 questions each, in 2 sets of 10) and 500 math problems.

## Open it right now (no install)
Double-click **`dist/kidsy-standalone.html`**. It is one file and works offline in Chrome, Edge, Safari or Firefox.
(The read-aloud voice works everywhere. Microphone answers and read-along need Chrome, Edge or Safari.)

## Run / change the source
```bash
npm install        # react, react-dom, react-icons, esbuild, capacitor
npm run build      # -> dist/index.html, dist/app.js, dist/app.css, dist/kidsy-standalone.html
npm run dev        # rebuilds on every change and serves http://localhost:5173
npm run serve      # serves the built ./dist on http://localhost:5173
npm test           # checks stories, math, custom practice and the exam builder
```
No Vite or webpack: the build is a small esbuild script in `scripts/build.mjs`.

## How the app is organised
Six sections, each with a small tab bar at the top:

| Section | Tabs |
|---|---|
| Home | Four big buttons, continue level, daily box |
| Learn | Adventure map · Study guides · Words |
| Practice | Games · Flashcards · Custom (one operation, number range, times table) |
| Exams | Build my exam (tick the material you want) · Ready-made |
| Merola (Grade 3 only) | Weekly words (week picker, word list, flashcards, review, quiz, workbook) · Library · Talk buddy |
| Me | Profile · Progress · Rewards |

## What is inside
| Area | Where |
|---|---|
| Story generator (500 per grade, 20 questions, 2 sets of 10) | `src/engine/stories.js`, `plots1.js`, `plots2.js`, `kit.js` |
| Math generator (500 per grade, 50 levels) | `src/engine/math.js` |
| Exam builder: questions come only from the ticked material | `src/engine/examBuilder.js`, `src/screens/Exam.jsx` |
| Custom practice (operations, number ranges, tables, hints) | `src/engine/specBuilder.js`, `src/screens/CustomLab.jsx`, `src/ui/StudyLabRunner.jsx` |
| Merola Grade 3 weekly words (add a week in `WEEK_WORDS`) | `src/data/g3ela.js`, `src/screens/G3Pack.jsx` |
| Merola library | `src/data/merola/`, `src/screens/MerolaPack.jsx` |
| Scores, levels, stickers, resets (localStorage) | `src/store/store.js` |
| Read-aloud, microphone, matching | `src/lib/speech.js`, `src/ui/QuizRunner.jsx`, `src/screens/Reader.jsx` |

## Scoring
Right answer = +1, wrong answer = −1, and the score never goes below 0. Nothing resets by itself:
use **Scores & stickers → Reset** (each reset asks first) or restore a backup file in **Me & settings**.

## Publish on GitHub Pages
Push to the `main` branch and `.github/workflows/deploy-pages.yml` will build and
deploy `dist` automatically. In the repository settings, set **Pages -> Build and
deployment -> Source** to **GitHub Actions**.

## iPhone and Android apps (Capacitor)
The `ios/` and `android/` folders are native projects that wrap the same app.
```bash
npm run app:sync      # build the web app and copy it into ios/ and android/
npm run app:android   # sync, then open Android Studio
npm run app:ios       # sync, then open Xcode (needs a Mac)
```
Store release (done by the account owner):
- **Google Play**: in Android Studio, *Build → Generate Signed App Bundle*, then upload the `.aab`
  in the Play Console (developer account, one-time $25).
- **App Store**: on a Mac with Xcode, set your Team under *Signing & Capabilities*, then
  *Product → Archive → Distribute App* to App Store Connect (Apple Developer Program, $99/year).
  Without a Mac, a cloud build service such as Codemagic can build and upload the iOS app.
