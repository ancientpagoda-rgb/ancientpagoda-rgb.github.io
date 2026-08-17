export function tick(state, dt) {
  if (!state.playing) return;
  state.phase += dt;
  state.timeline = (state.timeline + dt * 4) % 1000;
}

export function formatTimeline(v) {
  if (v < 180) return `${Math.round(13.8 - v / 18)} billion years ago`;
  if (v < 560) return `${Math.round((560-v)*2.2 + 10)} million years ago`;
  if (v < 760) return `${Math.round((760-v)*4 + 1)} thousand years ago`;
  if (v < 995) return `${Math.round(2026 - (995-v)*8)} CE`;
  return 'Present · 2026';
}
