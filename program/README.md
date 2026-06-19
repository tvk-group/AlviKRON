# KRON Fair Launch Program

Solidity smart contracts implementing the [KRON Fair Launch Standard](https://www.alvikron.com/standard/).

## Contracts

| Contract | Purpose |
|----------|---------|
| `KronToken.sol` | ERC20, 10B supply, no mint |
| `KronTimelock.sol` | Immutable time-locked release |
| `KronFairLaunch.sol` | Factory: deploy + distribute in one call |

## Distribution

- 80% → LP wallet (immediate)
- 10% → Ecosystem timelock (365 days)
- 5% → Founder timelock (180 days)
- 5% → Founder timelock (365 days)

## Setup

```bash
cp .env.example .env
# Edit .env with wallets and private key

npm install
npm test
```

## Deploy

```bash
# Testnet
npm run deploy:base-sepolia

# Mainnet
npm run deploy:base
```

After deploy, update `/verify/index.html` with contract addresses and verify on BaseScan.

## Tests

```
✔ distributes 80/10/5/5 correctly
✔ has no mint function and fixed supply
✔ releases timelocks after duration
```
