require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      // Must match deploy: solc 0.8.20 default (shanghai / PUSH0). Paris breaks BaseScan verify.
      evmVersion: "shanghai"
    }
  }
};
