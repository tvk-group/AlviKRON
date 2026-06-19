// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title KronTimelock
 * @notice Simple immutable timelock for KRON Family allocations.
 *         Beneficiary can release full balance after releaseTime.
 */
contract KronTimelock {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    address public immutable beneficiary;
    uint256 public immutable releaseTime;

    event Released(address indexed beneficiary, uint256 amount);

    constructor(IERC20 token_, address beneficiary_, uint256 releaseTime_) {
        require(beneficiary_ != address(0), "KronTimelock: zero beneficiary");
        require(releaseTime_ > block.timestamp, "KronTimelock: past release");
        token = token_;
        beneficiary = beneficiary_;
        releaseTime = releaseTime_;
    }

    function release() external {
        require(block.timestamp >= releaseTime, "KronTimelock: not released");
        uint256 amount = token.balanceOf(address(this));
        require(amount > 0, "KronTimelock: nothing to release");
        token.safeTransfer(beneficiary, amount);
        emit Released(beneficiary, amount);
    }
}
