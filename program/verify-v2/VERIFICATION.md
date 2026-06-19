# alviKRON V2 — BaseScan Contract Verification

Official V2: `TBD` (Base)

## Why verification failed before

BaseScan error `err_code_2` (bytecode mismatch) was caused by **wrong EVM version**:

| Setting | On-chain deploy | Previous package |
|---------|-----------------|------------------|
| Compiler | `v0.8.20+commit.a1b79de6` | same |
| Optimizer | 200 runs | same |
| EVM version | **default (shanghai, uses PUSH0 `0x5f`)** | **paris (uses PUSH1 `0x60`)** |
| OpenZeppelin | exact files at deploy time | npm 5.6.1 (different bytecode) |

Use **`basescan-standard-json-input.json`** — exact multi-file source pulled from Blockscout (already verified there).

## BaseScan steps (use this file)

1. Open [alviKRON V2 on BaseScan](https://basescan.org/address/TBD#code) → **Verify and Publish**
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
   00000000000000000000000044aaf729c4cde67dfab7276ed9a1fad5c788fc43
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

`alviKRON.sol` — constructor takes `genesisWallet` = `0x44aaf729c4CDe67DFaB7276ED9A1fAd5C788FC43`

## After verification

Call `renounceOwnership()` from the genesis wallet when setup is complete.
