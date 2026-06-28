/**
 * alviKRON — official on-chain registry (single source of truth)
 * Sourced from Base / BaseScan — contract 0xC10C8e1a6223cCBF60a8884654733D6cf9DCBA12
 */
window.KRON_DATA = {
  token: {
    name: 'alviKRON',
    symbol: 'AKRON',
    displaySymbol: 'ALVIKRON',
    network: 'Base',
    chainId: 8453,
    decimals: 18,
    totalSupply: '10,000,000,000',
    deployed: '2025-12-15',
    verified: true,
    status: 'live'
  },
  contract: {
    official: {
      labelKey: 'registry.contractOfficial',
      address: '0xC10C8e1a6223cCBF60a8884654733D6cf9DCBA12',
      status: 'live',
      basescan: 'https://basescan.org/token/0xC10C8e1a6223cCBF60a8884654733D6cf9DCBA12',
      blockscout: 'https://base.blockscout.com/token/0xC10C8e1a6223cCBF60a8884654733D6cf9DCBA12'
    }
  },
  genesis: {
    labelKey: 'registry.genesis',
    address: '0xaD521A7668D8843305f548DE553548160d9B79FE',
    basescan: 'https://basescan.org/address/0xaD521A7668D8843305f548DE553548160d9B79FE',
    status: 'live'
  },
  allocations: [
    {
      roleKey: 'registry.roleLp',
      lockKey: 'registry.roleLpLock',
      pct: '80%',
      amount: '8,000,000,000',
      address: '0x53F05e8c9fFb41646bBAD214802BC76a9447bbDc',
      basescan: 'https://basescan.org/address/0x53F05e8c9fFb41646bBAD214802BC76a9447bbDc',
      status: 'live'
    },
    {
      roleKey: 'registry.roleEco',
      lockKey: 'registry.roleEcoLock',
      pct: '10%',
      amount: '1,000,000,000',
      address: '0x86c8b54c14d8C3E1e6f7A0525Ce80AFaF5F90AFF',
      basescan: 'https://basescan.org/address/0x86c8b54c14d8C3E1e6f7A0525Ce80AFaF5F90AFF',
      status: 'live'
    },
    {
      roleKey: 'registry.roleFounder6',
      lockKey: 'registry.roleFounder6Lock',
      pct: '5%',
      amount: '500,000,000',
      address: '0x9305b794a55422A2f87b585C0c601c37F399489a',
      basescan: 'https://basescan.org/address/0x9305b794a55422A2f87b585C0c601c37F399489a',
      status: 'live'
    },
    {
      roleKey: 'registry.roleFounder12',
      lockKey: 'registry.roleFounder12Lock',
      pct: '5%',
      amount: '500,000,000',
      address: '0x763A407E094ce35223dA2C58A567bBCc1C9677b7',
      basescan: 'https://basescan.org/address/0x763A407E094ce35223dA2C58A567bBCc1C9677b7',
      status: 'live'
    }
  ],
  familyTokens: [
    {
      labelKey: 'channels.ekron',
      host: 'www.ekron.network',
      url: 'https://www.ekron.network/',
      descKey: 'channels.ekronDesc',
      external: true
    },
    {
      labelKey: 'channels.sovikron',
      host: 'www.sovikron.com',
      url: 'https://www.sovikron.com/',
      descKey: 'channels.sovikronDesc',
      external: true
    },
    {
      labelKey: 'channels.minekron',
      host: 'www.minekron.com',
      url: 'https://www.minekron.com/',
      descKey: 'channels.minekronDesc',
      external: true
    },
    {
      labelKey: 'channels.alvikron',
      host: 'www.alvikron.com',
      url: 'https://www.alvikron.com/',
      descKey: 'channels.alvikronDesc'
    },
    {
      labelKey: 'channels.purikron',
      host: 'www.purikron.com',
      url: 'https://www.purikron.com/',
      descKey: 'channels.purikronDesc',
      external: true
    },
    {
      labelKey: 'channels.puppykron',
      host: 'www.puppykron.com',
      url: 'https://www.puppykron.com/',
      descKey: 'channels.puppykronDesc',
      external: true
    },
    {
      labelKey: 'channels.warpkron',
      host: 'www.warpkron.com',
      url: 'https://www.warpkron.com/',
      descKey: 'channels.warpkronDesc',
      external: true
    }
  ],
  officialChannels: [
    {
      labelKey: 'channels.alvikron',
      host: 'www.alvikron.com',
      url: 'https://www.alvikron.com/',
      descKey: 'channels.alvikronDesc'
    },
    {
      labelKey: 'channels.app',
      host: 'app.alvikron.com',
      url: 'https://app.alvikron.com/',
      descKey: 'channels.appDesc'
    },
    {
      labelKey: 'channels.verify',
      host: 'www.alvikron.com/verify',
      url: 'https://www.alvikron.com/verify/',
      descKey: 'channels.verifyDesc'
    },
    {
      labelKey: 'channels.standard',
      host: 'www.alvikron.com/standard',
      url: 'https://www.alvikron.com/standard/',
      descKey: 'channels.standardDesc'
    },
    {
      labelKey: 'channels.family',
      host: 'www.alvikron.com/family',
      url: 'https://www.alvikron.com/family/',
      descKey: 'channels.familyDesc'
    },
    {
      labelKey: 'channels.program',
      host: 'www.alvikron.com/program',
      url: 'https://www.alvikron.com/program/',
      descKey: 'channels.programDesc'
    },
    {
      labelKey: 'channels.ekron',
      host: 'www.ekron.network',
      url: 'https://www.ekron.network/',
      descKey: 'channels.ekronDesc',
      external: true
    },
    {
      labelKey: 'channels.tvkGroup',
      host: 'www.tvk.group',
      url: 'https://www.tvk.group/',
      descKey: 'channels.tvkGroupDesc',
      external: true
    },
    {
      labelKey: 'channels.tvkCorp',
      host: 'www.t-v-k.com',
      url: 'https://www.t-v-k.com/',
      descKey: 'channels.tvkCorpDesc',
      external: true
    },
    {
      labelKey: 'channels.tvkLabs',
      host: 'www.tvklabs.com',
      url: 'https://www.tvklabs.com/',
      descKey: 'channels.tvkLabsDesc',
      external: true
    },
    {
      labelKey: 'channels.entelekronOrg',
      host: 'www.entelekron.org',
      url: 'https://www.entelekron.org/',
      descKey: 'channels.entelekronOrgDesc',
      external: true
    },
    {
      labelKey: 'channels.entelekronIo',
      host: 'www.entelekron.io',
      url: 'https://www.entelekron.io/',
      descKey: 'channels.entelekronIoDesc',
      external: true
    },
    {
      labelKey: 'channels.sovraNetwork',
      host: 'www.sovra.network',
      url: 'https://www.sovra.network/',
      descKey: 'channels.sovraNetworkDesc',
      external: true
    },
    {
      labelKey: 'channels.sovraProtocol',
      host: 'www.sovraprotocol.com',
      url: 'https://www.sovraprotocol.com/',
      descKey: 'channels.sovraProtocolDesc',
      external: true
    }
  ]
};
