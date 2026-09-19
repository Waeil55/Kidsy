// ============================================================================
// MarkerChip — the friendly black-animal circle shown to the LEFT of every quiz
// choice. It is NEVER a letter and NEVER a number (kids confuse "choice B"
// beside the answer "B"; see optionMarkers.js for the full reason). All markers
// come from the shared lib so the whole app matches and stays safe.
// ============================================================================
import React from 'react';
import { OPTION_MARKERS, optionMarkerStyle, optionChipStyle } from '../lib/optionMarkers';

export default function MarkerChip({ idx, selected = false, correct = false, size = 30, ...rest }) {
  return (
    <span
      aria-hidden="true"
      style={optionChipStyle(idx, { selected, correct, size })}
      {...rest}
    >
      {OPTION_MARKERS[idx % OPTION_MARKERS.length]?.emoji}
    </span>
  );
}
