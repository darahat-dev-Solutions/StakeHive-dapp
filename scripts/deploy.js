const hre = require("hardhat");
// Main async function that will execute the deployment
async function main() {
    // Get the list of available signers(wallets) and take the first one as deployer
    const [deployer] = await hre.ethers.getSigners();
    console.log(`Deploying contracts with account: ${deployer.address}`);
    // Prepare initial token supply (1,000,000 tokens with 18 decimals)
    // ParseUnits converts human-readable numbers to wei/bigint format
    const initialSupply = hre.ethers.parseUnits("1000000000000000000000000000", 18);
    // Get the ContractFactory for HiveToken (compiles artifact if needed)
    const HiveToken = await hre.ethers.getContractFactory("HiveToken");
    // Deploy the token contract with initial supply
    const hiveToken = await HiveToken.deploy(initialSupply);
    // Wait for contract deployment transaction to be mined
    await hiveToken.waitForDeployment(); // ✅ This is the correct usage

    console.log(`Coin deployed to:, ${hiveToken.target}`);
   // Get the ContractFactory for StakeHiveFarm
    const StakeHiveFarm = await hre.ethers.getContractFactory('StakeHiveFarm');
    // Deploy farm contract with HiveToken address as constructor argument
    const stakeHiveFarm = await StakeHiveFarm.deploy(hiveToken.target);
    // Wait for farm contract deployement
    await stakeHiveFarm.waitForDeployment();
    console.log(`StakeHiveFarm deployed to:${stakeHiveFarm.target}`);
    //Prepare transfer amount (500,000 tokens)
    const transferAmount = hre.ethers.parseUnits("50000", 18);
    // Send tokens from deployer to farm contract
    const tx = await hiveToken.transfer(stakeHiveFarm.target, transferAmount);
    // Wait for transfer transaction to complete
    await tx.wait();
    console.log(`Transferred 500,000 HIVE to farm at ${stakeHiveFarm.target}`);
// Mint more tokens to the staking contract
    const mintAmount = BigInt("100000000000000000000000000000000000000000000000000000000");
    const mintTx = await hiveToken.mint(stakeHiveFarm.target, mintAmount);
    await mintTx.wait();
    console.log(`Minted additional tokens to farm at ${stakeHiveFarm.target}`);
    // set new reward rate: .05 HIVE per second
    const rewardRate = hre.ethers.parseUnits("0.05", 18);
    const rateTx = await stakeHiveFarm.setRewardRate(rewardRate);
    await rateTx.wait();
    console.log(`Set reward rate to 0.05 HIVE per second for farm at ${stakeHiveFarm.target}`);
}
//Execute main function and handle errors
main().catch((error) => {
    console.error(error);
    process.exitCode = 1; // Exit with error code
});
