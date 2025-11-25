const { expect } = require("chai");
const { ethers } = require("hardhat");

// Helper: compare BigInt (wei) amounts within tolerance
function expectClose(actual, expected, pctTolerance = 0.01) {
  const diff = actual > expected ? actual - expected : expected - actual;
  const tolerance = (expected * BigInt(Math.floor(pctTolerance * 1000))) / BigInt(1000); // approx
  expect(diff, `Difference ${diff} greater than tolerance ${tolerance}`).to.be.lte(tolerance);
}

describe("StakeHiveFarm", function () {
  let owner, user1, user2;
  let hiveToken, stakeFarm;
  const initialSupply = ethers.parseUnits("1000000", 18); // 1,000,000 HIVE

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    const HiveToken = await ethers.getContractFactory("HiveToken");
    hiveToken = await HiveToken.deploy(initialSupply);
    await hiveToken.waitForDeployment();

    // Deploy farm with token address
    const StakeHiveFarm = await ethers.getContractFactory("StakeHiveFarm");
    stakeFarm = await StakeHiveFarm.deploy(await hiveToken.getAddress());
    await stakeFarm.waitForDeployment();

    // Fund farm with reward tokens (mint to farm)
    const rewardFund = ethers.parseUnits("500000", 18);
    await hiveToken.mint(await stakeFarm.getAddress(), rewardFund);

    // Set reward rate to 0.05 HIVE / second / token
    const rewardRate = ethers.parseUnits("0.05", 18);
    await stakeFarm.setRewardRate(rewardRate);

    // Transfer staking tokens to user1
    const transferAmount = ethers.parseUnits("1000", 18);
    await hiveToken.transfer(await user1.getAddress(), transferAmount);
  });

  it("deploys token and farm correctly", async () => {
    expect(await hiveToken.symbol()).to.equal("HIVE");
    expect(await hiveToken.balanceOf(await owner.getAddress())).to.be.gt(0n);
    expect(await hiveToken.balanceOf(await stakeFarm.getAddress())).to.be.gt(0n);
  });

  it("allows staking and tracks staker state", async () => {
    const stakeAmount = ethers.parseUnits("100", 18);
    const farmAddress = await stakeFarm.getAddress();

    // user1 approves farm to spend tokens
    await hiveToken.connect(user1).approve(farmAddress, stakeAmount);
    await stakeFarm.connect(user1).stake(stakeAmount);

    const stakerInfo = await stakeFarm.stakers(await user1.getAddress());
    expect(stakerInfo.amount).to.equal(stakeAmount);
    expect(stakerInfo.rewardDebt).to.equal(0n);
    expect(stakerInfo.lastStakedTime).to.be.gt(0n);
  });

  it("accrues rewards over time and reports pending", async () => {
    const stakeAmount = ethers.parseUnits("50", 18);
    const farmAddress = await stakeFarm.getAddress();
    await hiveToken.connect(user1).approve(farmAddress, stakeAmount);
    await stakeFarm.connect(user1).stake(stakeAmount);

    // Increase time by 120 seconds
    await ethers.provider.send("evm_increaseTime", [120]);
    await ethers.provider.send("evm_mine", []);

    const pending = await stakeFarm.getPendingRewards(await user1.getAddress());
    // Expected reward = stake * rate * time / 1e18
    const rewardRate = ethers.parseUnits("0.05", 18);
    const expected = (stakeAmount * rewardRate * 120n) / ethers.parseUnits("1", 18);
    expectClose(pending, expected);
  });

  it("claims rewards and resets rewardDebt", async () => {
    const stakeAmount = ethers.parseUnits("80", 18);
    const farmAddress = await stakeFarm.getAddress();
    await hiveToken.connect(user1).approve(farmAddress, stakeAmount);
    await stakeFarm.connect(user1).stake(stakeAmount);

    await ethers.provider.send("evm_increaseTime", [60]);
    await ethers.provider.send("evm_mine", []);

    const pendingBefore = await stakeFarm.getPendingRewards(await user1.getAddress());

    const balanceBefore = await hiveToken.balanceOf(await user1.getAddress());
    await stakeFarm.connect(user1).claimRewards();
    const balanceAfter = await hiveToken.balanceOf(await user1.getAddress());

    expect(balanceAfter).to.be.gt(balanceBefore);

    const stakerInfoAfter = await stakeFarm.stakers(await user1.getAddress());
    expect(stakerInfoAfter.rewardDebt).to.equal(0n);

    // Pending now should be near zero (only a tiny amount may accrue between blocks)
    const pendingAfter = await stakeFarm.getPendingRewards(await user1.getAddress());
    expect(pendingAfter).to.be.lt(pendingBefore);
  });

  it("withdraws staked tokens and updates state", async () => {
    const stakeAmount = ethers.parseUnits("200", 18);
    const withdrawAmount = ethers.parseUnits("50", 18);
    const farmAddress = await stakeFarm.getAddress();
    await hiveToken.connect(user1).approve(farmAddress, stakeAmount);
    await stakeFarm.connect(user1).stake(stakeAmount);

    await stakeFarm.connect(user1).withdraw(withdrawAmount);
    const info = await stakeFarm.stakers(await user1.getAddress());
    expect(info.amount).to.equal(stakeAmount - withdrawAmount);
  });

  it("reverts on zero stake amount", async () => {
    const farmAddress = await stakeFarm.getAddress();
    await hiveToken.connect(user1).approve(farmAddress, ethers.parseUnits("1", 18));
    await expect(stakeFarm.connect(user1).stake(0)).to.be.revertedWith("Amount must be greater than 0");
  });

  it("reverts on excessive withdrawal", async () => {
    const farmAddress = await stakeFarm.getAddress();
    const stakeAmount = ethers.parseUnits("30", 18);
    await hiveToken.connect(user1).approve(farmAddress, stakeAmount);
    await stakeFarm.connect(user1).stake(stakeAmount);
    const tooMuch = ethers.parseUnits("100", 18);
    await expect(stakeFarm.connect(user1).withdraw(tooMuch)).to.be.revertedWith("Insufficient stake");
  });

  it("reverts claiming with no rewards", async () => {
    await expect(stakeFarm.connect(user1).claimRewards()).to.be.revertedWith("No rewards");
  });

  it("transfers HIVE tokens between accounts", async () => {
    const amount = ethers.parseUnits("25", 18);
    await hiveToken.transfer(await user2.getAddress(), amount);
    const bal = await hiveToken.balanceOf(await user2.getAddress());
    expect(bal).to.equal(amount);
  });
});
