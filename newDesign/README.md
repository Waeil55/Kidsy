# KidVenture Enterprise — K–6 React PWA

A substantial, runnable React + TypeScript + Vite PWA built from the supplied mobile design direction.

## Product capabilities
- K–6 learner onboarding and grade switching
- 126 seeded curriculum lessons across Math, Reading & Language, Science, Social Studies, Arts & Creativity and Life Skills
- Interactive lesson player with 3-question assessments, instant feedback and XP rewards
- Multiple child profiles and parent/family management
- Progress, mastery, streak, XP and learning-time dashboards
- Search and subject filters
- Parent / Teacher / Admin prototype role console
- IndexedDB persistence
- Offline-first service worker and installable PWA manifest
- Accessibility controls including larger text
- Responsive mobile, tablet and desktop layouts
- Enterprise architecture documentation for production backend, content, analytics, identity and security

## Run
```bash
npm install
npm run dev
```

## Verify
```bash
npm run typecheck
npm run build
```

## Important
This ZIP is a complete frontend application foundation with a local persistence layer. A real enterprise deployment still requires a production backend, identity provider, database, CMS, secure media pipeline, analytics infrastructure and legal/privacy review for child-data regulations.
