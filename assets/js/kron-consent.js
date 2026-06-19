/**
 * alviKRON — legal & cookie consent gate (homepage)
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'alvikron-legal-consent-v1';

  function hasConsent() {
    try {
      return !!localStorage.getItem(STORAGE_KEY);
    } catch (_) {
      return false;
    }
  }

  function acceptConsent() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, acceptedAt: new Date().toISOString() })
      );
    } catch (_) { /* storage blocked */ }
    document.documentElement.classList.add('consent-accepted');
    document.body.classList.remove('consent-locked');
    const gate = document.getElementById('consent-gate');
    if (gate) {
      gate.setAttribute('aria-hidden', 'true');
      gate.inert = true;
    }
    window.dispatchEvent(new CustomEvent('kron:consent-accepted'));
  }

  function lockSite() {
    if (document.documentElement.classList.contains('consent-accepted')) return;
    document.body.classList.add('consent-locked');
    const gate = document.getElementById('consent-gate');
    if (gate) {
      gate.setAttribute('aria-hidden', 'false');
      gate.inert = false;
      const btn = gate.querySelector('[data-consent-accept]');
      if (btn) btn.focus();
    }
  }

  function init() {
    if (hasConsent()) {
      document.documentElement.classList.add('consent-accepted');
      document.body.classList.remove('consent-locked');
      return;
    }
    lockSite();
    const btn = document.querySelector('[data-consent-accept]');
    if (btn) btn.addEventListener('click', acceptConsent);
  }

  window.KRON_CONSENT = { hasConsent, acceptConsent, STORAGE_KEY };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
