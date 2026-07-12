import { createEngine } from './engine/core.js';
import { setupRenderer } from './render/renderer.js';
import { PRESETS } from './engine/presets.js';

const TICK_INTERVAL_MS = 1000; // world tick every 1s

let engine = null;
let renderer = null;
let tickTimer = null;
let running = false;
let currentRegime = 'calm';
let currentPresetKey = 'calm';

function renderWorldSnapshot(world) {
  const list = document.getElementById('worldSnapshot');
  if (!list) return;
  const entries = [];
  entries.push(['cosmic.activity', world.cosmic.activity]);
  entries.push(['cosmic.stormIndex', world.cosmic.stormIndex]);
  entries.push(['planetary.temp', world.planetary.temp]);
  entries.push(['planetary.wind', world.planetary.wind]);
  entries.push(['human.volatility', world.human.volatility]);
  entries.push(['latent.stability', world.latent.stability]);
  entries.push(['latent.entropy', world.latent.entropy]);
  entries.push(['latent.mood', world.latent.mood]);

  list.innerHTML = entries
    .map(([k, v]) => {
      const val = typeof v === 'number' ? v.toFixed(2) : String(v);
      return `<li><span class="key">${k}</span><span class="val">${val}</span></li>`;
    })
    .join('');

  const regimeEl = document.querySelector('#regimeLabel span');
  if (regimeEl) {
    regimeEl.textContent = world.regime;
  }
}

function appendEvent(text) {
  const logEl = document.getElementById('eventLog');
  if (!logEl) return;
  const div = document.createElement('div');
  div.className = 'event-log-entry';
  const ts = new Date().toLocaleTimeString();
  div.textContent = `[${ts}] ${text}`;
  logEl.prepend(div);
}

async function start() {
  if (running) return;
  if (!engine) {
    engine = createEngine({
      onRegimeChange: (prev, next, world) => {
        currentRegime = next;
        appendEvent(`Regime changed: ${prev} → ${next}`);
      },
    });
  }
  if (!renderer) {
    renderer = setupRenderer({
      audioEnabled: document.getElementById('audioToggle').checked,
      visualsEnabled: document.getElementById('visualsToggle').checked,
      onEvent: appendEvent,
    });
    const preset = PRESETS[currentPresetKey];
    if (preset) renderer.setPreset(preset.weights);
  }

  await renderer.ensureAudioContext(); // user gesture already happened via Start button

  running = true;
  const startBtn = document.getElementById('startButton');
  const stopBtn = document.getElementById('stopButton');
  if (startBtn) startBtn.disabled = true;
  if (stopBtn) stopBtn.disabled = false;

  const tick = async () => {
    if (!running) return;
    const world = await engine.tick();
    renderer.render(world);
    renderWorldSnapshot(world);
  };

  // Immediate first tick, then interval
  tick();
  tickTimer = setInterval(tick, TICK_INTERVAL_MS);
}

function stop() {
  running = false;
  if (tickTimer) {
    clearInterval(tickTimer);
    tickTimer = null;
  }
  if (renderer) {
    renderer.suspendAudio();
  }
  const startBtn = document.getElementById('startButton');
  const stopBtn = document.getElementById('stopButton');
  if (startBtn) startBtn.disabled = false;
  if (stopBtn) stopBtn.disabled = true;
}

function setupUI() {
  const startBtn = document.getElementById('startButton');
  const stopBtn = document.getElementById('stopButton');
  const audioToggle = document.getElementById('audioToggle');
  const visualsToggle = document.getElementById('visualsToggle');
  const logToggle = document.getElementById('logToggle');
  const presetSelect = document.getElementById('presetSelect');

  startBtn.addEventListener('click', start);
  stopBtn.addEventListener('click', stop);

  audioToggle.addEventListener('change', () => {
    if (renderer) renderer.setAudioEnabled(audioToggle.checked);
  });
  visualsToggle.addEventListener('change', () => {
    if (renderer) renderer.setVisualsEnabled(visualsToggle.checked);
  });
  logToggle.addEventListener('change', () => {
    const logEl = document.getElementById('eventLog');
    if (logEl) logEl.hidden = !logToggle.checked;
  });

  presetSelect.addEventListener('change', () => {
    currentPresetKey = presetSelect.value;
    const preset = PRESETS[currentPresetKey];
    if (renderer && preset) {
      renderer.setPreset(preset.weights);
      appendEvent(`Preset: ${preset.name}`);
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setupUI();
});
