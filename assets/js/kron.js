/**
 * KRON Family — shared site interactions (alviKRON)
 */
(function () {
  'use strict';

  const SITE = {
    url: 'https://www.alvikron.com',
    name: 'alviKRON',
    symbol: 'ALVIKRON',
    twitter: '@alvikron'
  };

  const DATA = window.KRON_DATA;

  function t(key, fallback) {
    if (window.KRON_I18N && window.KRON_I18N.t) {
      return window.KRON_I18N.t(key, fallback);
    }
    return fallback !== undefined ? fallback : key;
  }

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function isTbd(addr) {
    return !addr || addr === 'TBD' || addr.includes('PASTE_');
  }

  function addrActions(addr, basescan) {
    if (isTbd(addr) || !basescan) {
      return (
        '<div class="addr-actions">' +
        '<span class="addr-btn queued" data-i18n="registry.queued">' + esc(t('registry.queued', 'Queued')) + '</span>' +
        '</div>'
      );
    }
    return (
      '<div class="addr-actions">' +
      '<button type="button" class="addr-btn" data-copy="' + esc(addr) + '" data-i18n-copy="common.copy">' + esc(t('common.copy', 'Copy')) + '</button>' +
      '<a class="addr-btn primary" href="' + esc(basescan) + '" target="_blank" rel="noopener">' + esc(t('common.basescan', 'BaseScan ↗')) + '</a>' +
      '</div>'
    );
  }

  function renderTrustStrip() {
    document.querySelectorAll('[data-trust-strip]').forEach((el) => {
      const verified = DATA && DATA.token && DATA.token.verified;
      el.innerHTML =
        '<div class="trust-strip">' +
        (verified
          ? '<span class="trust-item verified"><span class="trust-dot"></span> ' + esc(t('trust.verified')) + '</span>'
          : '<span class="trust-item queued"><span class="trust-dot"></span> ' + esc(t('trust.queued')) + '</span>') +
        '<span class="trust-item">' + esc(t('trust.network')) + '</span>' +
        '<span class="trust-item">' + esc(t('trust.fairLaunch')) + '</span>' +
        '<span class="trust-item">' + esc(t('trust.supply')) + '</span>' +
        '<span class="trust-item">' + esc(t('trust.noMint')) + '</span>' +
        '</div>';
    });
  }

  function renderRegistry() {
    if (!DATA) return;

    document.querySelectorAll('[data-address-registry]').forEach((el) => {
      const contract = DATA.contract.official;
      const genesis = DATA.genesis;
      const symbol = DATA.token.symbol || 'AKRON';
      const isQueued = DATA.token.status === 'queued' || isTbd(contract.address);

      const rows = DATA.allocations.map((a) =>
        '<tr>' +
        '<td class="role-cell"><strong>' + esc(t(a.roleKey)) + '</strong><span>' + esc(t(a.lockKey)) + '</span></td>' +
        '<td><span class="pct-pill">' + esc(a.pct) + '</span><br><span style="font-size:.78rem;color:var(--muted)">' + esc(a.amount) + ' ' + esc(symbol) + '</span></td>' +
        '<td class="addr-cell">' + esc(a.address) + addrActions(a.address, a.basescan) + '</td>' +
        '</tr>'
      ).join('');

      const badgeClass = isQueued ? 'registry-badge queued' : 'registry-badge';
      const badgeText = isQueued ? t('registry.badgeQueued') : t('registry.badge');

      el.innerHTML =
        '<div class="registry-panel">' +
        '<div class="registry-head">' +
        '<div><h3>' + esc(t('registry.title')) + '</h3>' +
        '<p>' + esc(t('registry.desc')) + '</p></div>' +
        '<span class="' + badgeClass + '">' + esc(badgeText) + '</span>' +
        '</div>' +
        '<div class="registry-contract">' +
        '<div class="registry-contract-card official' + (isQueued ? ' queued' : '') + '">' +
        '<div class="label">' + esc(t(contract.labelKey)) + '</div>' +
        '<div class="addr">' + esc(contract.address) + '</div>' +
        addrActions(contract.address, contract.basescan) +
        '</div>' +
        '<div class="registry-contract-card' + (isTbd(genesis.address) ? ' queued' : '') + '">' +
        '<div class="label">' + esc(t(genesis.labelKey)) + '</div>' +
        '<div class="addr">' + esc(genesis.address) + '</div>' +
        addrActions(genesis.address, genesis.basescan) +
        '</div>' +
        '</div>' +
        '<div class="registry-table-wrap">' +
        '<table class="registry" aria-label="' + esc(t('registry.title')) + '">' +
        '<thead><tr><th>' + esc(t('registry.role')) + '</th><th>' + esc(t('registry.allocation')) + '</th><th>' + esc(t('registry.address')) + '</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
        '</table></div>' +
        (isQueued
          ? '<div style="padding:14px 24px;font-size:.82rem;color:var(--muted);border-top:1px solid var(--line)">' +
            esc(t('registry.queuedNote')) +
            ' <a href="https://www.ekron.network/verify/" target="_blank" rel="noopener">' + esc(t('registry.ekronVerify')) + '</a>' +
            '</div>'
          : '<div style="padding:14px 24px;font-size:.82rem;color:var(--muted);border-top:1px solid var(--line)">' +
            esc(t('registry.symbolNote')) +
            '</div>') +
        '</div>';
    });
  }

  function injectBreadcrumbSchema() {
    if (document.querySelector('script[data-kron-breadcrumb]')) return;
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    const base = SITE.url;
    const crumbs = [{ name: 'Home', item: base + '/' }];
    const map = {
      '/verify': 'Verify',
      '/family': 'Family',
      '/standard': 'Standard',
      '/program': 'Program',
      '/legal/privacy': 'Privacy',
      '/legal/cookies.html': 'Cookies',
      '/legal/terms': 'Terms',
      '/legal/risk': 'Risk Disclosure',
    };
    if (path !== '/' && map[path]) {
      crumbs.push({ name: map[path], item: base + path });
    }
    if (crumbs.length < 2) return;
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.setAttribute('data-kron-breadcrumb', '1');
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: c.item,
      })),
    });
    document.head.appendChild(el);
  }

  function renderOfficialChannels() {
    if (!DATA || !DATA.officialChannels) return;

    document.querySelectorAll('[data-official-channels]').forEach((el) => {
      const mode = el.getAttribute('data-official-channels') || 'list';
      const channels = DATA.officialChannels;

      if (mode === 'grid') {
        el.innerHTML = channels.map((c) => {
          const ext = c.external ? ' target="_blank" rel="noopener noreferrer"' : '';
          return (
            '<div class="link-card">' +
            '<span>' + esc(t(c.labelKey)) + '</span>' +
            '<a href="' + esc(c.url) + '"' + ext + '>' + esc(c.host) + '</a>' +
            '<p class="link-desc">' + esc(t(c.descKey)) + '</p>' +
            '</div>'
          );
        }).join('');
        return;
      }

      el.innerHTML =
        '<div class="channels-grid">' +
        channels.map((c) => {
          const ext = c.external ? ' target="_blank" rel="noopener noreferrer"' : '';
          return (
            '<div class="channel-row">' +
            '<a href="' + esc(c.url) + '"' + ext + '>' + esc(c.host) + '</a>' +
            '<span>' + esc(t(c.descKey)) + '</span>' +
            '</div>'
          );
        }).join('') +
        '</div>';
    });
  }

  function initUI() {
    renderTrustStrip();
    renderRegistry();
    renderOfficialChannels();
    injectBreadcrumbSchema();
  }

  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('menu-open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        document.body.classList.remove('menu-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('nav.main-nav a[href^="#"]');

  if (sections.length && navLinks.length) {
    const highlightNav = () => {
      let current = '';
      sections.forEach((section) => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) current = section.getAttribute('id');
      });
      navLinks.forEach((link) => {
        const href = link.getAttribute('href').slice(1);
        link.style.color = href === current ? '#fff' : '';
      });
    };
    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();
  }

  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const text = btn.getAttribute('data-copy');
    if (!text || isTbd(text)) return;
    try {
      await navigator.clipboard.writeText(text);
      const orig = btn.textContent;
      btn.textContent = t('common.copied', 'Copied!');
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = orig;
        btn.classList.remove('copied');
      }, 2000);
    } catch (_) { /* clipboard unavailable */ }
  });

  function boot() {
    initUI();
    window.KRON = { site: SITE, data: DATA, isTbd, t };
  }

  if (window.KRON_I18N && window.KRON_I18N.ready) {
    boot();
  } else {
    window.addEventListener('kron:i18n-ready', boot, { once: true });
  }

  window.addEventListener('kron:langchange', initUI);
})();
