/**
 * alviKRON Community App — portal entry (wallet connect)
 */
(function () {
  'use strict';

  const core = window.ALVIKRON_APP_CORE;
  const cfg = core.cfg;

  const els = {
    connectBtn: document.getElementById('btn-connect'),
    disconnectBtn: document.getElementById('btn-disconnect'),
    dashboardBtn: document.getElementById('btn-dashboard'),
    addTokenBtn: document.getElementById('btn-add-token'),
    walletChip: document.getElementById('wallet-chip'),
    walletPanel: document.getElementById('wallet-panel'),
    noWallet: document.getElementById('no-wallet-note'),
    statusMsg: document.getElementById('status-msg'),
    journey: document.querySelectorAll('.journey-step'),
    installBtn: document.getElementById('btn-install')
  };

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
    if (els.walletPanel) els.walletPanel.classList.toggle('hidden', !connected);
    if (els.connectBtn) els.connectBtn.classList.toggle('hidden', connected);
    if (els.disconnectBtn) els.disconnectBtn.classList.toggle('hidden', !connected);
    if (els.dashboardBtn) els.dashboardBtn.classList.toggle('hidden', !connected);
    if (els.noWallet) els.noWallet.classList.toggle('hidden', core.hasWallet());
    setJourney(connected ? 2 : core.hasWallet() ? 1 : 0);
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
      setStatus('Wallet connected on Base. Open your dashboard to view AKRON balance.');
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

  function setupInstallPrompt() {
    let deferred;
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferred = e;
      if (els.installBtn) els.installBtn.classList.remove('hidden');
    });
    if (els.installBtn) {
      els.installBtn.addEventListener('click', async function () {
        if (!deferred) return;
        deferred.prompt();
        await deferred.userChoice;
        deferred = null;
        els.installBtn.classList.add('hidden');
      });
    }
  }

  function bindEvents() {
    if (els.connectBtn) els.connectBtn.addEventListener('click', handleConnect);
    if (els.disconnectBtn) els.disconnectBtn.addEventListener('click', handleDisconnect);
    if (els.addTokenBtn) {
      els.addTokenBtn.addEventListener('click', function () {
        core.addTokenToWallet().catch(function () {
          setStatus('Could not add token — open your wallet manually with the official contract.', true);
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
    core.registerServiceWorker();
    setupInstallPrompt();
    bindEvents();
    const saved = core.loadSavedWallet();
    updateWalletUI(saved);
    if (saved) setJourney(2);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
