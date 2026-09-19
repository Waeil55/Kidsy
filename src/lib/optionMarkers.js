// ============================================================================
// NEUTRAL OPTION MARKERS — kids never see A/B/C/D or 1/2/3/4 beside answers.
// In this app a LETTER or a NUMBER can be the REAL answer ("Which letter is
// "B"?", "What is 2 + 3?"), so letter/number chips next to choices make the
// child tap the LABEL instead of the answer. Every choice instead gets a
// friendly ANIMAL chip (🦁🐸🦋🐙…) that is never a letter and never a number.
// Shared by every quiz component so the whole app matches.
// ============================================================================

export const OPTION_MARKERS = [
  { emoji: '🦁', name: 'Lion',     chipBg: '#fff7ed', chipBorder: '#fdba74', accent: '#c2410c' },
  { emoji: '🐸', name: 'Frog',     chipBg: '#f0fdf4', chipBorder: '#86efac', accent: '#15803d' },
  { emoji: '🦋', name: 'Butterfly', chipBg: '#faf5ff', chipBorder: '#d8b4fe', accent: '#7e22ce' },
  { emoji: '🐙', name: 'Octopus',  chipBg: '#fef2f2', chipBorder: '#fca5a5', accent: '#b91c1c' },
  { emoji: '🦊', name: 'Fox',      chipBg: '#fffbeb', chipBorder: '#fcd34d', accent: '#b45309' },
  { emoji: '🐬', name: 'Dolphin',  chipBg: '#f0f9ff', chipBorder: '#7dd3fc', accent: '#0369a1' },
  { emoji: '🐢', name: 'Turtle',   chipBg: '#f0fdfa', chipBorder: '#5eead4', accent: '#0f766e' },
  { emoji: '🐝', name: 'Bee',      chipBg: '#fefce8', chipBorder: '#fde047', accent: '#a16207' }
];

/**
 * Style + emoji for choice index `idx`.
 * Plain (idx,false,false) => friendly animal chip; selected => blue ring;
 * correct => green. Returns a flat style object ready to spread into a span.
 */
export function optionMarkerStyle(idx, { selected = false, correct = false } = {}) {
  const m = OPTION_MARKERS[idx % OPTION_MARKERS.length];
  let bg = m.chipBg;
  let border = `2px solid ${m.chipBorder}`;
  let color = m.accent;
  if (correct) {
    bg = '#dcfce7'; border = '2px solid #22c55e'; color = '#fff';
  } else if (selected) {
    bg = '#dbeafe'; border = '2px solid #3b82f6'; color = '#fff';
  }
  return { bg, border, color };
}

/** React-free chip used inside option buttons. Returns the full chip style. */
export function optionChipStyle(idx, { selected = false, correct = false, size = 30 } = {}) {
  const m = OPTION_MARKERS[idx % OPTION_MARKERS.length];
  const s = optionMarkerStyle(idx, { selected, correct });
  return {
    ...s,
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    fontSize: size * 0.42,
    fontWeight: 900,
    flexShrink: 0
  };
}
