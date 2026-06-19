// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract eKRON is ERC20, Ownable {

    uint256 public constant TOTAL_SUPPLY =
        10_000_000_000 * 10**18;

    constructor(address genesisWallet)
        ERC20("eKRON", "EKRON")
        Ownable(genesisWallet)
    {
        require(genesisWallet != address(0), "Genesis is zero");
        _mint(genesisWallet, TOTAL_SUPPLY);
    }
}
