/**
 * alviKRON Community App — holder dashboard
 */
(function () {
  'use strict';

  const core = window.ALVIKRON_APP_CORE;
  const cfg = core.cfg;
  const data = window.KRON_DATA || {};

  const els = {
    connectBtn: document.getElementById('btn-connect'),
    disconnectBtn: document.getElementById('btn-disconnect'),
    walletChip: document.getElementById('wallet-chip'),
    balance: document.getElementById('balance-value'),
    network: document.getElementById('network-value'),
    contract: document.getElementById('contract-value'),
    registry: document.getElementById('registry-body'),
    gate: document.getElementById('connect-gate'),
    dashboard: document.getElementById('dashboard-main'),
    statusMsg: document.getElementById('status-msg'),
    refreshBtn: document.getElementById('btn-refresh'),
    copyContract: document.getElementById('btn-copy-contract')
  };

  function setStatus(msg, isError) {
    if (!els.statusMsg) return;
    els.statusMsg.textContent = msg || '';
    els.statusMsg.classList.toggle('hidden', !msg);
    els.statusMsg.style.color = isError ? '#fecaca' : '#d1d5db';
  }

  function showDashboard(addr) {
    const connected = !!addr;
    if (els.gate) els.gate.classList.toggle('hidden', connected);
    if (els.dashboard) els.dashboard.classList.toggle('hidden', !connected);
    if (els.walletChip) {
      els.walletChip.textContent = connected ? core.shortAddr(addr) : '—';
      els.walletChip.classList.toggle('hidden', !connected);
    }
    if (els.disconnectBtn) els.disconnectBtn.classList.toggle('hidden', !connected);
    if (els.connectBtn) els.connectBtn.classList.toggle('hidden', connected);
    return connected;
  }

  async function refreshBalance(addr) {
    if (!addr) return;
    if (els.balance) els.balance.innerHTML = '<span class="spinner"></span>';
    try {
      const chainId = await core.getChainId();
      if (els.network) {
        els.network.textContent = chainId === cfg.chainId ? 'Base ✓' : 'Wrong network — switch to Base';
        els.network.className = chainId === cfg.chainId ? 'value sm badge ok' : 'value sm badge warn';
      }
      const raw = await core.getBalance(addr);
      if (els.balance) els.balance.textContent = core.formatAkron(raw) + ' AKRON';
    } catch (err) {
      if (els.balance) els.balance.textContent = '—';
      setStatus('Could not load balance. Check network and retry.', true);
    }
  }

  function renderRegistry() {
    if (!els.registry || !data.contract) return;
    const rows = [];
    const c = data.contract.official;
    rows.push(
      '<tr><td>Contract</td><td class="mono">' + core.shortAddr(c.address) + '</td><td><a href="' + c.basescan + '" target="_blank" rel="noopener">BaseScan</a></td></tr>'
    );
    if (data.genesis) {
      rows.push(
        '<tr><td>Genesis</td><td class="mono">' + core.shortAddr(data.genesis.address) + '</td><td><a href="' + data.genesis.basescan + '" target="_blank" rel="noopener">BaseScan</a></td></tr>'
      );
    }
    (data.allocations || []).forEach(function (a) {
      rows.push(
        '<tr><td>' + a.pct + ' ' + (a.roleKey || '').replace('registry.', '') + '</td><td class="mono">' + core.shortAddr(a.address) + '</td><td><a href="' + a.basescan + '" target="_blank" rel="noopener">BaseScan</a></td></tr>'
      );
    });
    els.registry.innerHTML = rows.join('');
  }

  async function handleConnect() {
    setStatus('');
    try {
      const addr = await core.connectWallet();
      showDashboard(addr);
      await refreshBalance(addr);
    } catch (err) {
      if (err && err.message === 'no-wallet') {
        setStatus('No Web3 wallet detected.', true);
      } else if (err && err.code !== 4001) {
        setStatus((err && err.message) || 'Connection failed.', true);
      }
    }
  }

  function handleDisconnect() {
    core.disconnectWallet();
    showDashboard('');
    if (els.balance) els.balance.textContent = '—';
    setStatus('Disconnected.');
  }

  function copyContract() {
    navigator.clipboard.writeText(cfg.contract).then(function () {
      setStatus('Contract copied.');
      setTimeout(function () { setStatus(''); }, 2000);
    });
  }

  function bindEvents() {
    if (els.connectBtn) els.connectBtn.addEventListener('click', handleConnect);
    if (els.disconnectBtn) els.disconnectBtn.addEventListener('click', handleDisconnect);
    if (els.refreshBtn) {
      els.refreshBtn.addEventListener('click', function () {
        refreshBalance(core.loadSavedWallet());
      });
    }
    if (els.copyContract) els.copyContract.addEventListener('click', copyContract);
    core.onAccountsChanged(function (accounts) {
      const addr = accounts[0] || '';
      core.saveWallet(addr);
      showDashboard(addr);
      refreshBalance(addr);
    });
    core.onChainChanged(function () {
      window.location.reload();
    });
  }

  async function init() {
    core.registerServiceWorker();
    if (els.contract) els.contract.textContent = core.shortAddr(cfg.contract);
    renderRegistry();
    bindEvents();
    const saved = core.loadSavedWallet();
    if (showDashboard(saved) && saved) {
      await refreshBalance(saved);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
