const hre = require("hardhat");

/**
 * Deploy KronFairLaunch factory and launch alviKRON (or any KRON Family token).
 *
 * Required env:
 *   DEPLOYER_PRIVATE_KEY
 *   LP_WALLET
 *   ECOSYSTEM_BENEFICIARY
 *   FOUNDER_BENEFICIARY
 *
 * Optional:
 *   TOKEN_NAME (default: alviKRON)
 *   TOKEN_SYMBOL (default: ALVIKRON)
 */
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const lpWallet = process.env.LP_WALLET || deployer.address;
  const ecosystemBeneficiary = process.env.ECOSYSTEM_BENEFICIARY || deployer.address;
  const founderBeneficiary = process.env.FOUNDER_BENEFICIARY || deployer.address;
  const tokenName = process.env.TOKEN_NAME || "alviKRON";
  const tokenSymbol = process.env.TOKEN_SYMBOL || "ALVIKRON";

  console.log("Deployer:", deployer.address);
  console.log("LP Wallet:", lpWallet);
  console.log("Ecosystem Beneficiary:", ecosystemBeneficiary);
  console.log("Founder Beneficiary:", founderBeneficiary);
  console.log("Token:", tokenName, `(${tokenSymbol})`);

  const Factory = await hre.ethers.getContractFactory("KronFairLaunch");
  const factory = await Factory.deploy();
  await factory.waitForDeployment();
  const factoryAddr = await factory.getAddress();
  console.log("KronFairLaunch factory:", factoryAddr);

  const tx = await factory.launch(
    tokenName,
    tokenSymbol,
    lpWallet,
    ecosystemBeneficiary,
    founderBeneficiary
  );
  const receipt = await tx.wait();

  const event = receipt.logs
    .map((log) => {
      try {
        return factory.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find((e) => e && e.name === "FairLaunchDeployed");

  if (event) {
    console.log("\n=== Fair Launch Complete ===");
    console.log("Token:", event.args.token);
    console.log("LP Wallet:", event.args.lpWallet, "| Amount:", hre.ethers.formatEther(event.args.lpAmount));
    console.log("Ecosystem Lock:", event.args.ecosystemLock, "| Amount:", hre.ethers.formatEther(event.args.ecosystemAmount));
    console.log("Founder 6M Lock:", event.args.founderShortLock, "| Amount:", hre.ethers.formatEther(event.args.founderShortAmount));
    console.log("Founder 12M Lock:", event.args.founderLongLock, "| Amount:", hre.ethers.formatEther(event.args.founderLongAmount));
    console.log("\nUpdate verify/index.html with these addresses.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
