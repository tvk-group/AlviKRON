/**
 * alviKRON Community App — wallet + RPC helpers (no backend)
 */
(function () {
  'use strict';

  const cfg = window.ALVIKRON_APP || {};
  const BALANCE_OF = '0x70a08231';
  const SYMBOL = '0x95d89b41';
  const DECIMALS = '0x313ce567';

  function shortAddr(addr) {
    if (!addr || addr.length < 10) return addr || '—';
    return addr.slice(0, 6) + '…' + addr.slice(-4);
  }

  function padAddress(addr) {
    return addr.slice(2).toLowerCase().padStart(64, '0');
  }

  async function rpcCall(method, params) {
    const res = await fetch(cfg.rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
    });
    if (!res.ok) throw new Error('RPC request failed');
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || 'RPC error');
    return data.result;
  }

  async function ethCall(to, data) {
    return rpcCall('eth_call', [{ to, data }, 'latest']);
  }

  async function getChainId() {
    if (window.ethereum) {
      const hex = await window.ethereum.request({ method: 'eth_chainId' });
      return parseInt(hex, 16);
    }
    const hex = await rpcCall('eth_chainId', []);
    return parseInt(hex, 16);
  }

  async function getBalance(address) {
    const raw = await ethCall(cfg.contract, BALANCE_OF + padAddress(address));
    return BigInt(raw || '0x0');
  }

  function formatUnits(value, decimals) {
    const dec = Number(decimals);
    const negative = value < 0n;
    if (negative) value = -value;
    const base = 10n ** BigInt(dec);
    const whole = value / base;
    const frac = value % base;
    let fracStr = frac.toString().padStart(dec, '0').replace(/0+$/, '');
    const wholeStr = whole.toLocaleString('en-US');
    const out = fracStr ? wholeStr + '.' + fracStr : wholeStr;
    return negative ? '-' + out : out;
  }

  function formatAkron(raw) {
    const n = Number(raw) / 1e18;
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
    return formatUnits(raw, cfg.decimals || 18);
  }

  function hasWallet() {
    return typeof window.ethereum !== 'undefined';
  }

  function loadSavedWallet() {
    try {
      return localStorage.getItem(cfg.storageKey) || '';
    } catch (_) {
      return '';
    }
  }

  function saveWallet(addr) {
    try {
      if (addr) localStorage.setItem(cfg.storageKey, addr);
      else localStorage.removeItem(cfg.storageKey);
    } catch (_) { /* private mode */ }
  }

  async function ensureBaseNetwork() {
    if (!window.ethereum) return;
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (parseInt(chainId, 16) === cfg.chainId) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: cfg.chainIdHex }]
      });
    } catch (err) {
      if (err && err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: cfg.chainIdHex,
            chainName: 'Base',
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            rpcUrls: [cfg.rpcUrl],
            blockExplorerUrls: ['https://basescan.org']
          }]
        });
      } else {
        throw err;
      }
    }
  }

  async function connectWallet() {
    if (!hasWallet()) {
      throw new Error('no-wallet');
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    await ensureBaseNetwork();
    const addr = accounts[0];
    saveWallet(addr);
    return addr;
  }

  function disconnectWallet() {
    saveWallet('');
  }

  function onAccountsChanged(handler) {
    if (!window.ethereum) return;
    window.ethereum.on('accountsChanged', handler);
  }

  function onChainChanged(handler) {
    if (!window.ethereum) return;
    window.ethereum.on('chainChanged', handler);
  }

  async function addTokenToWallet() {
    if (!window.ethereum) throw new Error('no-wallet');
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: cfg.contract,
          symbol: cfg.symbol,
          decimals: cfg.decimals
        }
      }
    });
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return Promise.resolve();
    return navigator.serviceWorker.register('/app/sw.js', { scope: '/app/' }).catch(function () {});
  }

  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;
  }

  function isIosSafari() {
    const ua = window.navigator.userAgent;
    return /iPhone|iPad|iPod/i.test(ua) && /Safari/i.test(ua) && !/CriOS|FxiOS/i.test(ua);
  }

  /**
   * Browser-native PWA install — captures beforeinstallprompt and surfaces UI.
   */
  function setupPwaInstall(options) {
    options = options || {};
    const banner = document.getElementById('install-banner');
    const installBtn = document.getElementById('btn-install');
    const dismissBtn = document.getElementById('btn-install-dismiss');
    const fallback = document.getElementById('install-fallback');
    let deferred = null;
    let prompted = false;

    function hideBanner() {
      if (banner) banner.classList.add('hidden');
      document.body.classList.remove('has-install-banner');
    }

    function showBanner() {
      if (!banner || isStandalone()) return;
      banner.classList.remove('hidden');
      document.body.classList.add('has-install-banner');
    }

    async function triggerInstall() {
      if (!deferred || isStandalone()) return false;
      try {
        await deferred.prompt();
        const choice = await deferred.userChoice;
        deferred = null;
        prompted = true;
        if (choice.outcome === 'accepted') {
          hideBanner();
          if (fallback) fallback.classList.add('hidden');
          return true;
        }
      } catch (_) { /* browser blocked or unavailable */ }
      return false;
    }

    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferred = e;
      showBanner();
      if (fallback) fallback.classList.add('hidden');
      if (options.autoPrompt !== false && !prompted) {
        window.setTimeout(function () {
          triggerInstall();
        }, options.autoDelay || 1200);
      }
    });

    if (installBtn) {
      installBtn.addEventListener('click', function () {
        triggerInstall();
      });
    }

    if (dismissBtn) {
      dismissBtn.addEventListener('click', hideBanner);
    }

    window.addEventListener('appinstalled', function () {
      hideBanner();
      if (fallback) fallback.classList.add('hidden');
      deferred = null;
    });

    registerServiceWorker().then(function () {
      if (isStandalone()) {
        hideBanner();
        if (fallback) fallback.classList.add('hidden');
        return;
      }
      window.setTimeout(function () {
        if (!deferred && isIosSafari() && fallback) {
          fallback.classList.remove('hidden');
        }
      }, options.fallbackDelay || 2500);
    });

    return { triggerInstall: triggerInstall, showBanner: showBanner };
  }

  window.ALVIKRON_APP_CORE = {
    cfg,
    shortAddr,
    rpcCall,
    getChainId,
    getBalance,
    formatAkron,
    formatUnits,
    hasWallet,
    loadSavedWallet,
    saveWallet,
    connectWallet,
    disconnectWallet,
    ensureBaseNetwork,
    onAccountsChanged,
    onChainChanged,
    addTokenToWallet,
    registerServiceWorker,
    isStandalone,
    setupPwaInstall
  };
})();
