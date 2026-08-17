import { scenes } from './scenes/catalog.js';
import { state } from './core/state.js';
import { tick, formatTimeline } from './core/clock.js';
import { createRenderer } from './render.js';

const $ = s => document.querySelector(s);
const world = $('#world');
const renderer = createRenderer(world);
const rail = $('#scale-rail');
const controls = $('#controls-shell');
const mobileToggle = $('#mobile-controls-toggle');
const mobileQuery = window.matchMedia('(max-width: 800px)');

function setMobileControls(open) {
  if (!controls || !mobileToggle) return;
  const next = Boolean(open) && mobileQuery.matches;
  controls.classList.toggle('open', next);
  mobileToggle.setAttribute('aria-expanded', String(next));
  mobileToggle.setAttribute('aria-label', next ? 'Close controls' : 'Open controls');
}

mobileToggle?.addEventListener('click', () => {
  setMobileControls(!controls.classList.contains('open'));
});

world?.addEventListener('pointerdown', () => {
  if (mobileQuery.matches) setMobileControls(false);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setMobileControls(false);
});

mobileQuery.addEventListener?.('change', event => {
  if (!event.matches) setMobileControls(false);
});

scenes.forEach((s, i) => {
  const b = document.createElement('button');
  b.className = 'scale-button';
  b.innerHTML = `${s.icon} <span>${s.name}</span><small>${s.scale}</small>`;
  b.onclick = () => {
    state.sceneIndex = i;
    sync();
    if (mobileQuery.matches) setMobileControls(false);
  };
  rail.appendChild(b);
});

document.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => {
  state.mode = b.dataset.mode;
  sync();
  if (mobileQuery.matches) setMobileControls(false);
});

$('#timeline').oninput = e => {
  state.timeline = +e.target.value;
  state.playing = false;
  $('#play').textContent = 'Play';
  syncTimeline();
};

$('#play').onclick = () => {
  state.playing = !state.playing;
  $('#play').textContent = state.playing ? 'Pause' : 'Play';
};

function sync() {
  const s = scenes[state.sceneIndex];
  $('#scene-title').textContent = s.title;
  $('#scene-subtitle').textContent = s.subtitle;
  $('#scale-label').textContent = s.scale;
  $('#truth-label').textContent = s.truth[state.mode];
  $('#scene-description').textContent = s.description;
  $('#metrics').innerHTML = s.metrics.map(([a, b]) => `<div class="metric"><b>${b}</b><span>${a}</span></div>`).join('');
  [...rail.children].forEach((b, i) => b.classList.toggle('active', i === state.sceneIndex));
  document.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('active', b.dataset.mode === state.mode));
  syncTimeline();
}

function syncTimeline() {
  $('#timeline').value = state.timeline;
  $('#time-label').textContent = formatTimeline(state.timeline);
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000);
  last = now;
  tick(state, dt);
  syncTimeline();
  renderer.draw(state, scenes[state.sceneIndex]);
  requestAnimationFrame(frame);
}

setMobileControls(false);
sync();
requestAnimationFrame(frame);
