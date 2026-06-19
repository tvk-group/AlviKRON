# alviKRON V2 — BaseScan Contract Verification

Official V2: `0xC10C8e1a6223cCBF60a8884654733D6cf9DCBA12` (Base)

## Why verification failed before

BaseScan error `err_code_2` (bytecode mismatch) was caused by uploading the **wrong contract source** — the eKRON verification bundle instead of alviKRON:

| Setting | On-chain deploy | Wrong upload (eKRON) |
|---------|-----------------|----------------------|
| Contract | `alviKRON` | `eKRON` |
| Token name | `alviKRON` (8 chars) | `eKRON` (5 chars) |
| Token symbol | `AKRON` | `EKRON` |
| Genesis wallet | `0xaD521A7668D8843305f548DE553548160d9B79FE` | `0x44aaf729...` (eKRON) |
| Compiler | `v0.8.20+commit.a1b79de6` | same |
| Optimizer | 200 runs | same |
| EVM version | **default (shanghai)** | must match |

Use **`basescan-standard-json-input.json`** — contains `alviKRON.sol` with exact OpenZeppelin dependencies (already verified on Blockscout).

## BaseScan steps (use this file)

1. Open [alviKRON V2 on BaseScan](https://basescan.org/address/0xC10C8e1a6223cCBF60a8884654733D6cf9DCBA12#code) → **Verify and Publish**
2. **Compiler Type:** `Solidity (Standard-Json-Input)`
3. **Compiler Version:** `v0.8.20+commit.a1b79de6`
4. **Open Source License:** MIT
5. Upload: **`basescan-standard-json-input.json`**
6. **Advanced settings:**
   - Optimization: **Yes**
   - Runs: **200**
   - **EVM Version: `default`** (do NOT pick `paris`)
7. **Constructor Arguments (ABI-encoded):**

   ```
   000000000000000000000000ad521a7668d8843305f548de553548160d9b79fe
   ```

8. Submit.

### If BaseScan has no "default" EVM dropdown

Pick **`shanghai`** — not `paris`, not `london`. `paris` will fail with bytecode mismatch.

## Verify locally (optional)

```bash
cd program/verify-v2
npm install solc@0.8.20 --no-save
node scripts/verify-bytecode-match.js
```

Expected output: `MATCH: creation bytecode + constructor args`

## Contract source (main file)

`contracts/alviKRON.sol` — constructor takes `genesisWallet` = `0xaD521A7668D8843305f548DE553548160d9B79FE`

## After verification

Call `renounceOwnership()` from the genesis wallet when setup is complete.
