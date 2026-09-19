# BrightSteps Kids — React + PWA

A mobile-first learning app based closely on the supplied reference design.

## Included
- React 19 + Vite
- Mobile-first responsive UI
- Home dashboard matching the reference composition
- Activities bottom sheet with Drawing, Shapes, Fruit & Veggies, Colors, Animals, Picture Puzzle, Sports, Birds, Coloring Page and Word Puzzle
- Kids profile with badges, coins, tiers and editable child settings
- Learning paths for Kindergarten through Grade 6
- Math, Reading, Science and Social Studies content
- Lesson/question modal with rewards
- AI Chat UI
- Local persistence with localStorage
- Installable PWA manifest
- Offline service worker shell/cache
- No backend required for the included demo

## Run
```bash
npm install
npm run dev
```

Production:
```bash
npm run build
npm run preview
```

The service worker is registered from `src/main.jsx` and the production build can be installed as a PWA.

## Design
The supplied screenshot is included at `design-reference.png` for implementation reference. The primary UI is intentionally built around the same:
- soft gray page background
- white rounded mobile cards
- light blue habit hero
- pink activity sheet
- blue coin/reward pills
- three-column quick activity cards
- bottom tab bar
- Kids Profile / badges / coin purchase sections

## Content note
The curriculum is structured for KG–Grade 6 and includes hundreds of lesson entries generated from grade/subject topic maps. It is an app foundation rather than a replacement for a state-specific textbook or standards alignment document. Standards can be mapped next by state (for example Common Core + NGSS + social studies standards).
