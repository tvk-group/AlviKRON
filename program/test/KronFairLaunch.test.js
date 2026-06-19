const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("KronFairLaunch", function () {
  const TOTAL = ethers.parseEther("10000000000"); // 10B

  async function launch() {
    const [owner, lp, eco, founder] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("KronFairLaunch");
    const factory = await Factory.deploy();
    const tx = await factory.launch("alviKRON", "ALVIKRON", lp.address, eco.address, founder.address);
    const receipt = await tx.wait();
    const event = receipt.logs
      .map((log) => { try { return factory.interface.parseLog(log); } catch { return null; } })
      .find((e) => e && e.name === "FairLaunchDeployed");
    const token = await ethers.getContractAt("KronToken", event.args.token);
    return { factory, token, lp, eco, founder, event };
  }

  it("distributes 80/10/5/5 correctly", async function () {
    const { token, lp, event } = await launch();
    expect(await token.totalSupply()).to.equal(TOTAL);
    expect(await token.balanceOf(lp.address)).to.equal((TOTAL * 8000n) / 10000n);
    expect(event.args.lpAmount).to.equal((TOTAL * 8000n) / 10000n);
    expect(event.args.ecosystemAmount).to.equal((TOTAL * 1000n) / 10000n);
    expect(event.args.founderShortAmount).to.equal((TOTAL * 500n) / 10000n);
    expect(event.args.founderLongAmount).to.equal((TOTAL * 500n) / 10000n);
  });

  it("has no mint function and fixed supply", async function () {
    const { token } = await launch();
    expect(await token.TOTAL_SUPPLY()).to.equal(TOTAL);
    expect(await token.totalSupply()).to.equal(TOTAL);
  });

  it("releases timelocks after duration", async function () {
    const { token, eco, founder, event } = await launch();
    const ecoLock = await ethers.getContractAt("KronTimelock", event.args.ecosystemLock);
    const shortLock = await ethers.getContractAt("KronTimelock", event.args.founderShortLock);

    await expect(ecoLock.release()).to.be.revertedWith("KronTimelock: not released");
    await time.increase(180 * 24 * 60 * 60 + 1);
    await shortLock.release();
    expect(await token.balanceOf(founder.address)).to.equal((TOTAL * 500n) / 10000n);

    await time.increase(185 * 24 * 60 * 60);
    await ecoLock.release();
    expect(await token.balanceOf(eco.address)).to.equal((TOTAL * 1000n) / 10000n);
  });
});
