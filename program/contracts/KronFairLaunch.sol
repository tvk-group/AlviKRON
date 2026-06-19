// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {KronToken} from "./KronToken.sol";
import {KronTimelock} from "./KronTimelock.sol";

/**
 * @title KronFairLaunch
 * @notice Deploys a KRON Family token with standard fair-launch distribution:
 *         80% LP wallet · 10% ecosystem (12M lock) · 5% founder (6M) · 5% founder (12M)
 * @dev No presale. No private sale. All non-LP allocations go to on-chain timelocks.
 */
contract KronFairLaunch {
  uint256 public constant BPS = 10_000;
  uint256 public constant LP_BPS = 8_000;        // 80%
  uint256 public constant ECOSYSTEM_BPS = 1_000; // 10%
  uint256 public constant FOUNDER_SHORT_BPS = 500; // 5%
  uint256 public constant FOUNDER_LONG_BPS = 500;  // 5%

  uint256 public constant SIX_MONTHS = 180 days;
  uint256 public constant TWELVE_MONTHS = 365 days;

  struct LaunchResult {
    KronToken token;
    KronTimelock ecosystemLock;
    KronTimelock founderShortLock;
    KronTimelock founderLongLock;
    uint256 lpAmount;
    uint256 ecosystemAmount;
    uint256 founderShortAmount;
    uint256 founderLongAmount;
  }

  event FairLaunchDeployed(
    address indexed token,
    address indexed lpWallet,
    address indexed ecosystemLock,
    address founderShortLock,
    address founderLongLock,
    uint256 lpAmount,
    uint256 ecosystemAmount,
    uint256 founderShortAmount,
    uint256 founderLongAmount
  );

  /**
   * @param name_ Token name (e.g. "eKRON")
   * @param symbol_ Token symbol (e.g. "EKRON")
   * @param lpWallet Receives 80% for fair-launch liquidity
   * @param ecosystemBeneficiary Beneficiary of 10% after 12-month lock
   * @param founderBeneficiary Beneficiary of both founder tranches
   */
  function launch(
    string calldata name_,
    string calldata symbol_,
    address lpWallet,
    address ecosystemBeneficiary,
    address founderBeneficiary
  ) external returns (LaunchResult memory result) {
    require(lpWallet != address(0), "KronFairLaunch: zero lp");
    require(ecosystemBeneficiary != address(0), "KronFairLaunch: zero eco");
    require(founderBeneficiary != address(0), "KronFairLaunch: zero founder");

    result.token = new KronToken(name_, symbol_, address(this));
    uint256 total = result.token.totalSupply();

    result.lpAmount = (total * LP_BPS) / BPS;
    result.ecosystemAmount = (total * ECOSYSTEM_BPS) / BPS;
    result.founderShortAmount = (total * FOUNDER_SHORT_BPS) / BPS;
    result.founderLongAmount = (total * FOUNDER_LONG_BPS) / BPS;

    uint256 distributed = result.lpAmount + result.ecosystemAmount
      + result.founderShortAmount + result.founderLongAmount;
    require(distributed == total, "KronFairLaunch: distribution mismatch");

    result.token.transfer(lpWallet, result.lpAmount);

    result.ecosystemLock = new KronTimelock(
      result.token,
      ecosystemBeneficiary,
      block.timestamp + TWELVE_MONTHS
    );
    result.token.transfer(address(result.ecosystemLock), result.ecosystemAmount);

    result.founderShortLock = new KronTimelock(
      result.token,
      founderBeneficiary,
      block.timestamp + SIX_MONTHS
    );
    result.token.transfer(address(result.founderShortLock), result.founderShortAmount);

    result.founderLongLock = new KronTimelock(
      result.token,
      founderBeneficiary,
      block.timestamp + TWELVE_MONTHS
    );
    result.token.transfer(address(result.founderLongLock), result.founderLongAmount);

    emit FairLaunchDeployed(
      address(result.token),
      lpWallet,
      address(result.ecosystemLock),
      address(result.founderShortLock),
      address(result.founderLongLock),
      result.lpAmount,
      result.ecosystemAmount,
      result.founderShortAmount,
      result.founderLongAmount
    );
  }
}
