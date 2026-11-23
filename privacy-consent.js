(() => {
  const config = window.ANCIENT_PAGODA_ADSENSE_CONFIG || {};
  const key = 'ancient-pagoda-privacy-consent-v1';

  function readChoice() {
    try { return window.localStorage.getItem(key); } catch { return null; }
  }

  function openSettings() {
    if (typeof window.googlefc?.showRevocationMessage === 'function') {
      window.googlefc.showRevocationMessage();
      return;
    }
    const note = document.querySelector('[data-privacy-note]');
    if (note) note.hidden = false;
  }

  document.addEventListener('click', event => {
    if (event.target.closest('[data-open-consent]')) openSettings();
  });

  window.ancientPagodaPrivacy = Object.freeze({
    adsEnabled: Boolean(config.enabled && config.clientId),
    certifiedCmpConfigured: Boolean(config.certifiedCmpConfigured),
    getChoice: readChoice,
    showSettings: openSettings,
  });
})();
