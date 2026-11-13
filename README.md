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
App id on both stores: **`com.agapecare.kidsy`**. Icons and splash come from `npm run app:assets`.

### App Store (no Mac needed, builds on GitHub)
1. Join the **Apple Developer Program** ($99/year) at developer.apple.com with your Apple ID.
2. **developer.apple.com → Certificates, IDs & Profiles → Identifiers → +**: App ID, bundle id
   `com.agapecare.kidsy`.
3. **appstoreconnect.apple.com → Apps → +**: new iOS app named Kidsy with that bundle id.
4. **App Store Connect → Users and Access → Integrations → App Store Connect API → +**:
   make a key with the **Admin** role and download the `.p8` file (it downloads only once).
5. **GitHub → Kidsy repo → Settings → Secrets and variables → Actions → New repository secret**:
   - `APPLE_TEAM_ID`: Team ID (developer.apple.com → Membership)
   - `ASC_KEY_ID`: the key's ID
   - `ASC_ISSUER_ID`: the Issuer ID shown above the keys list
   - `ASC_KEY_P8`: open the `.p8` file in Notepad and paste all of it
6. **GitHub → Actions → "iOS build and App Store upload" → Run workflow**. About 15 minutes later
   the build appears in App Store Connect → TestFlight.
7. In App Store Connect fill in screenshots, description, privacy policy URL and age rating,
   choose the build, and press **Submit for Review**.

### Google Play
1. Create a **Google Play Console** developer account (one-time $25).
2. Make an upload key once (keep the file and passwords safe; losing them blocks updates):
   `keytool -genkeypair -v -keystore kidsy-upload.jks -alias kidsy -keyalg RSA -keysize 2048 -validity 10000`
3. Add GitHub secrets: `ANDROID_KEYSTORE_BASE64` (output of `base64 -w0 kidsy-upload.jks`),
   `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` (`kidsy`), `ANDROID_KEY_PASSWORD`.
4. **GitHub → Actions → "Android build" → Run workflow**, then download `kidsy-android-play-bundle`.
5. Play Console → Create app → upload `app-release.aab` to Internal testing, fill in the store
   listing, content rating and the *Designed for Families* forms, then roll out to Production.

The same workflow always produces `kidsy-android-test-apk`, which installs straight onto an
Android phone for testing.

### Kids apps
Kidsy is for children, so both stores apply extra rules: no ads or tracking, a privacy policy
URL, and Apple's *Kids* category / Google's *Families* policy. The app collects nothing and keeps
progress on the device only, which keeps these forms simple.
