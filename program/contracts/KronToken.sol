// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title KronToken
 * @notice Fixed-supply ERC20 for KRON Family memecoins.
 *         10 billion tokens, no minting, no pausing — fair launch standard.
 * @dev Deploy via KronFairLaunch factory for automatic timelock distribution.
 */
contract KronToken is ERC20 {
    uint256 public constant TOTAL_SUPPLY = 10_000_000_000 * 10 ** 18;

    constructor(
        string memory name_,
        string memory symbol_,
        address initialHolder
    ) ERC20(name_, symbol_) {
        require(initialHolder != address(0), "KronToken: zero holder");
        _mint(initialHolder, TOTAL_SUPPLY);
    }
}
