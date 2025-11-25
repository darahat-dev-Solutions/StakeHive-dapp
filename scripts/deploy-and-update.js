const hre = require("hardhat");
const { execSync } = require('child_process');

/**
 * Enhanced deployment script that:
 * 1. Deploys HiveToken and StakeHiveFarm
 * 2. Automatically updates frontend/utils/contract.js with new addresses
 * 3. Transfers initial tokens to farm and sets reward rate
 * 
 * Usage:
 *   npx hardhat run scripts/deploy-and-update.js --network <network>
 */

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;
  const chainId = (await hre.ethers.provider.getNetwork()).chainId;
  
  console.log(`\n🚀 Deploying contracts on ${network} (Chain ID: ${chainId})`);
  console.log(`📝 Deployer account: ${deployer.address}\n`);
  
  // Get deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Deployer balance: ${hre.ethers.formatEther(balance)} ETH\n`);
  
  // Prepare initial token supply
  const initialSupply = hre.ethers.parseUnits("1000000000000000000000000000", 18);
  
  // Deploy HiveToken
  console.log("📦 Deploying HiveToken...");
  const HiveToken = await hre.ethers.getContractFactory("HiveToken");
  const hiveToken = await HiveToken.deploy(initialSupply);
  await hiveToken.waitForDeployment();
  const hiveTokenAddress = await hiveToken.getAddress();
  console.log(`✅ HiveToken deployed to: ${hiveTokenAddress}`);
  
  // Deploy StakeHiveFarm
  console.log("\n📦 Deploying StakeHiveFarm...");
  const StakeHiveFarm = await hre.ethers.getContractFactory('StakeHiveFarm');
  const stakeHiveFarm = await StakeHiveFarm.deploy(hiveTokenAddress);
  await stakeHiveFarm.waitForDeployment();
  const farmAddress = await stakeHiveFarm.getAddress();
  console.log(`✅ StakeHiveFarm deployed to: ${farmAddress}`);
  
  // Transfer tokens to farm
  console.log("\n💸 Transferring 50,000 HIVE to farm...");
  const transferAmount = hre.ethers.parseUnits("50000", 18);
  const transferTx = await hiveToken.transfer(farmAddress, transferAmount);
  await transferTx.wait();
  console.log("✅ Transfer complete");
  
  // Mint additional tokens to farm
  console.log("\n🪙 Minting additional tokens to farm...");
  const mintAmount = BigInt("100000000000000000000000000000000000000000000000000000000");
  const mintTx = await hiveToken.mint(farmAddress, mintAmount);
  await mintTx.wait();
  console.log("✅ Mint complete");
  
  // Set reward rate
  console.log("\n⚙️  Setting reward rate...");
  const rewardRate = hre.ethers.parseUnits("0.05", 18);
  const rateTx = await stakeHiveFarm.setRewardRate(rewardRate);
  await rateTx.wait();
  console.log("✅ Reward rate set to 0.05 HIVE per second");
  
  // Update frontend contract addresses
  console.log("\n🔄 Updating frontend contract addresses...");
  try {
    const updateCmd = `node scripts/update-addresses.js ${chainId} ${hiveTokenAddress} ${farmAddress}`;
    execSync(updateCmd, { stdio: 'inherit' });
  } catch (error) {
    console.warn("\n⚠️  Could not auto-update frontend addresses. Please update manually:");
    console.log(`   Chain ID: ${chainId}`);
    console.log(`   HIVE_TOKEN: ${hiveTokenAddress}`);
    console.log(`   STAKE_HIVE: ${farmAddress}`);
  }
  
  // Summary
  console.log("\n" + "=".repeat(70));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(70));
  console.log(`Network: ${network} (Chain ID: ${chainId})`);
  console.log(`HiveToken: ${hiveTokenAddress}`);
  console.log(`StakeHiveFarm: ${farmAddress}`);
  console.log("\n📋 Next steps:");
  console.log("1. Restart your frontend if it's running");
  console.log("2. Import HiveToken to MetaMask using address above");
  console.log("3. Transfer tokens to your account:");
  console.log(`   npx hardhat run scripts/transfer-tokens.js --network ${network}`);
  console.log("=".repeat(70) + "\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
