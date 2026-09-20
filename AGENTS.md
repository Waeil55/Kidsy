# 🤖 AI Agent Notes — Kidsy Project

> **READ THIS BEFORE MAKING ANY CHANGES OR DEPLOYMENTS**

---

## 📁 Repository
**GitHub:** https://github.com/Waeil55/Kidsy.git  
**Local path:** `c:\Users\waeil\Desktop\Agape Care\Kidsy`

---

## 🌿 Branch Strategy

| Branch | Purpose | Notes |
|--------|---------|-------|
| `main` | Source code (development) | Push all code changes here |
| `gh-pages` | **LIVE DEPLOYED SITE** ← | Auto-generated from `dist/` — DO NOT manually edit |

> [!IMPORTANT]
> The **live website** is served from the `gh-pages` branch, NOT `main`.
> Simply pushing to `main` will NOT update the live site.

---

## 🚀 Correct Deployment Workflow

Every time you make code changes, follow these steps **in order**:

### Step 1 — Build
```bash
cmd /c "cd /d "c:\Users\waeil\Desktop\Agape Care\Kidsy" && npm run build"
```
✅ Must succeed with zero errors before proceeding.

### Step 2 — Commit source to `main`
```bash
cmd /c "cd /d "c:\Users\waeil\Desktop\Agape Care\Kidsy" && git add -A && git commit -m "feat: your message here" && git push origin main"
```

### Step 3 — Deploy `dist/` to `gh-pages` (this updates the LIVE site)
```bash
cmd /c "cd /d "c:\Users\waeil\Desktop\Agape Care\Kidsy" && node_modules\.bin\gh-pages -d dist -b gh-pages -m "deploy: your message here""
```
✅ When it prints `Published` — the live site is updated (allow 1–2 min for GitHub to propagate).

---

## ⚠️ Common Mistakes to Avoid

- ❌ **DO NOT** push only to `main` and think the site updated — it won't.
- ❌ **DO NOT** run `npm run build` with PowerShell directly — use `cmd /c` wrapper instead (execution policy issues).
- ❌ **DO NOT** manually edit the `gh-pages` branch — it is always overwritten by the deploy command.
- ❌ **DO NOT** skip the build step before deploying.

---

## 🏗️ Tech Stack
- **Framework:** React 18 + Vite 6
- **Styling:** Tailwind CSS 3
- **Icons:** Lucide React
- **Audio:** Tone.js + canvas-confetti + Web Speech API
- **State:** `useApp` context (`src/store/AppContext.jsx`)

## 📂 Key Files
| File | Role |
|------|------|
| `src/pages/Learn.jsx` | Main learning hub — all tabs (Phonics, Reels, Stories, etc.) |
| `src/components/PhonicsAdventure.jsx` | Phonics tab — TTS + mic + stars |
| `src/pages/KidsReels.jsx` | Reels tab — swipe feed Spell/Pick/Say |
| `src/components/StoryReader.jsx` | Stories tab — 1,400 graded stories |
| `src/data/phonicsWords.js` | 200 phonics words, `shuffle()`, `getWordsByGrade()` |
| `src/data/levelProgressionEngine.js` | Quiz questions for the Adventure mode |
| `src/utils/audio.js` | `speakText`, `playCorrect`, `playIncorrect`, `fireConfetti`, `stopAudio` |
| `src/store/AppContext.jsx` | Global state: `child`, `complete(eventId, xp, stars)` |
| `scripts/postbuild.cjs` | Post-build script — copies dist, generates 404.html for SPA routing |
