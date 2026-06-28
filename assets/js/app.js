/**
 * alviKRON Community App — portal entry (wallet connect)
 */
(function () {
  'use strict';

  const core = window.ALVIKRON_APP_CORE;

  const els = {
    connectBtn: document.getElementById('btn-connect'),
    disconnectBtn: document.getElementById('btn-disconnect'),
    dashboardBtn: document.getElementById('btn-dashboard'),
    addTokenBtn: document.getElementById('btn-add-token'),
    walletChip: document.getElementById('wallet-chip'),
    noWallet: document.getElementById('no-wallet-note'),
    statusMsg: document.getElementById('status-msg'),
    installBtn: document.getElementById('btn-install'),
    installCardBtn: document.getElementById('btn-install-card'),

  function setStatus(msg, isError) {
    if (!els.statusMsg) return;
    els.statusMsg.textContent = msg || '';
    els.statusMsg.classList.toggle('hidden', !msg);
    els.statusMsg.style.color = isError ? '#fecaca' : '#d1d5db';
  }

  function setJourney(step) {
    els.journey.forEach(function (el, i) {
      el.classList.remove('active', 'done');
      if (i < step) el.classList.add('done');
      else if (i === step) el.classList.add('active');
    });
  }

  function updateWalletUI(addr) {
    const connected = !!addr;
    if (els.walletChip) {
      els.walletChip.textContent = connected ? core.shortAddr(addr) : '—';
      els.walletChip.classList.toggle('hidden', !connected);
    }
    if (els.connectBtn) els.connectBtn.classList.toggle('hidden', connected);
    if (els.disconnectBtn) els.disconnectBtn.classList.toggle('hidden', !connected);
    if (els.dashboardBtn) els.dashboardBtn.classList.toggle('hidden', !connected);
    if (els.noWallet) els.noWallet.classList.toggle('hidden', core.hasWallet());
    const installDone = core.isStandalone();
    setJourney(connected ? 3 : core.hasWallet() ? 2 : installDone ? 1 : 0);
  }

  async function handleConnect() {
    setStatus('');
    if (els.connectBtn) {
      els.connectBtn.disabled = true;
      els.connectBtn.innerHTML = '<span class="spinner"></span> Connecting…';
    }
    try {
      const addr = await core.connectWallet();
      updateWalletUI(addr);
      setStatus('Wallet connected on Base. Opening dashboard…');
      window.location.href = '/app/dashboard.html';
    } catch (err) {
      const code = err && err.message;
      if (code === 'no-wallet') {
        setStatus('No Web3 wallet detected. Install MetaMask, Coinbase Wallet, or Rainbow, then reload.', true);
      } else if (err && err.code === 4001) {
        setStatus('Connection cancelled.', true);
      } else {
        setStatus((err && err.message) || 'Could not connect wallet.', true);
      }
      updateWalletUI(core.loadSavedWallet());
    } finally {
      if (els.connectBtn) {
        els.connectBtn.disabled = false;
        els.connectBtn.textContent = 'Connect Wallet';
      }
    }
  }

  function handleDisconnect() {
    core.disconnectWallet();
    updateWalletUI('');
    setStatus('Wallet disconnected.');
  }

  function bindEvents() {
    if (els.connectBtn) els.connectBtn.addEventListener('click', handleConnect);
    if (els.disconnectBtn) els.disconnectBtn.addEventListener('click', handleDisconnect);
    if (els.addTokenBtn) {
      els.addTokenBtn.addEventListener('click', function () {
        core.addTokenToWallet().catch(function () {
          setStatus('Could not add token — use the official contract in your wallet.', true);
        });
      });
    }
    core.onAccountsChanged(function (accounts) {
      const addr = accounts[0] || '';
      core.saveWallet(addr);
      updateWalletUI(addr);
    });
    core.onChainChanged(function () {
      window.location.reload();
    });
  }

  function init() {
    const pwa = core.setupPwaInstall({ autoPrompt: true, autoDelay: 1000 });
    if (els.installCardBtn && pwa) {
      els.installCardBtn.addEventListener('click', function () {
        pwa.triggerInstall();
      });
    }
    bindEvents();
    const saved = core.loadSavedWallet();
    updateWalletUI(saved);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
