/**
 * KRON i18n — self-hosted translations (no Google Translate)
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'alvikron-lang';
  const DEFAULT_LANG = 'en';

  const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇬🇧', rtl: false },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪', rtl: false },
    { code: 'fr', label: 'Français', flag: '🇫🇷', rtl: false },
    { code: 'it', label: 'Italiano', flag: '🇮🇹', rtl: false },
    { code: 'es', label: 'Español', flag: '🇪🇸', rtl: false },
    { code: 'pt', label: 'Português', flag: '🇵🇹', rtl: false },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷', rtl: false },
    { code: 'ru', label: 'Русский', flag: '🇷🇺', rtl: false },
    { code: 'ar', label: 'العربية', flag: '🇸🇦', rtl: true },
    { code: 'zh', label: '中文', flag: '🇨🇳', rtl: false },
    { code: 'ja', label: '日本語', flag: '🇯🇵', rtl: false },
    { code: 'nl', label: 'Nederlands', flag: '🇳🇱', rtl: false }
  ];

  let currentLang = DEFAULT_LANG;
  let strings = {};
  let ready = false;

  function getNested(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
  }

  function t(key, fallback) {
    const val = getNested(strings, key);
    if (val !== undefined && val !== '') return val;
    return fallback !== undefined ? fallback : key;
  }

  function detectLang() {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang && LANGUAGES.some((l) => l.code === urlLang)) return urlLang;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && LANGUAGES.some((l) => l.code === stored)) return stored;
    const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
    if (LANGUAGES.some((l) => l.code === browser)) return browser;
    return DEFAULT_LANG;
  }

  async function loadLocale(lang) {
    const res = await fetch('/assets/i18n/' + lang + '.json');
    if (!res.ok) throw new Error('locale ' + lang);
    return res.json();
  }

  function applyToDOM() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val !== key) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      const val = t(key);
      if (val !== key) el.innerHTML = val;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = t(key);
      if (val !== key) el.setAttribute('placeholder', val);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      const val = t(key);
      if (val !== key) el.setAttribute('aria-label', val);
    });

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      const val = t(key);
      if (val !== key) el.setAttribute('title', val);
    });

    const langMeta = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];
    document.documentElement.lang = currentLang;
    document.documentElement.dir = langMeta.rtl ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', langMeta.rtl);

    const titleKey = document.body.getAttribute('data-i18n-page-title');
    if (titleKey) {
      const title = t(titleKey);
      if (title !== titleKey) document.title = title;
    }
  }

  function buildSwitcher() {
    document.querySelectorAll('[data-lang-switcher]').forEach((slot) => {
      if (slot.dataset.langBuilt) return;
      slot.dataset.langBuilt = '1';

      const meta = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];
      const wrap = document.createElement('div');
      wrap.className = 'lang-switcher';
      wrap.innerHTML =
        '<button type="button" class="lang-toggle" aria-haspopup="listbox" aria-expanded="false" aria-label="' + t('common.selectLanguage', 'Select language') + '">' +
        '<span class="lang-flag">' + meta.flag + '</span>' +
        '<span class="lang-label">' + meta.label + '</span>' +
        '<span class="lang-chevron" aria-hidden="true">▾</span>' +
        '</button>' +
        '<ul class="lang-menu" role="listbox" hidden></ul>';

      const menu = wrap.querySelector('.lang-menu');
      LANGUAGES.forEach((lang) => {
        const li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', lang.code === currentLang ? 'true' : 'false');
        li.dataset.lang = lang.code;
        li.innerHTML = '<span class="lang-flag">' + lang.flag + '</span><span>' + lang.label + '</span>';
        if (lang.code === currentLang) li.classList.add('active');
        menu.appendChild(li);
      });

      const toggle = wrap.querySelector('.lang-toggle');
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = wrap.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
        menu.hidden = !open;
      });

      menu.addEventListener('click', (e) => {
        const li = e.target.closest('[data-lang]');
        if (!li) return;
        setLanguage(li.dataset.lang);
        wrap.classList.remove('open');
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      });

      document.addEventListener('click', () => {
        wrap.classList.remove('open');
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      });

      slot.appendChild(wrap);
    });
  }

  async function setLanguage(lang) {
    if (!LANGUAGES.some((l) => l.code === lang)) return;
    try {
      strings = await loadLocale(lang);
      currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      const url = new URL(window.location.href);
      if (lang === DEFAULT_LANG) url.searchParams.delete('lang');
      else url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url);
      applyToDOM();
      buildSwitcher();
      document.querySelectorAll('[data-lang-switcher] [data-lang]').forEach((li) => {
        li.classList.toggle('active', li.dataset.lang === lang);
        li.setAttribute('aria-selected', li.dataset.lang === lang ? 'true' : 'false');
      });
      document.querySelectorAll('.lang-toggle .lang-flag').forEach((el) => {
        const m = LANGUAGES.find((l) => l.code === lang);
        if (m) el.textContent = m.flag;
      });
      document.querySelectorAll('.lang-toggle .lang-label').forEach((el) => {
        const m = LANGUAGES.find((l) => l.code === lang);
        if (m) el.textContent = m.label;
      });
      window.dispatchEvent(new CustomEvent('kron:langchange', { detail: { lang } }));
    } catch (err) {
      if (lang !== DEFAULT_LANG) await setLanguage(DEFAULT_LANG);
    }
  }

  async function init() {
    currentLang = detectLang();
    try {
      strings = await loadLocale(currentLang);
    } catch (_) {
      currentLang = DEFAULT_LANG;
      strings = await loadLocale(DEFAULT_LANG);
    }
    ready = true;
    applyToDOM();
    buildSwitcher();
    window.dispatchEvent(new CustomEvent('kron:i18n-ready', { detail: { lang: currentLang } }));
  }

  window.KRON_I18N = {
    t,
    get lang() { return currentLang; },
    get ready() { return ready; },
    languages: LANGUAGES,
    setLanguage,
    init
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
