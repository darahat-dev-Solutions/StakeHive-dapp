const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Transferring from deployer: ${deployer.address}`);

  // Your account address
  const recipientAddress = "0x75Cc159Ea3E1AFc1fe03AB6cf968A7267Fe8dD06";
  
  // New HiveToken address on Sepolia
  const hiveTokenAddress = "0x359863fB0ca4E4be77daD9dFFBB0BbdA94690cCC";
  
  // Amount to transfer: 10,000 HIVE tokens
  const transferAmount = hre.ethers.parseUnits("10000", 18);

  // Get the HiveToken contract
  const HiveToken = await hre.ethers.getContractAt("HiveToken", hiveTokenAddress);
  
  console.log(`Transferring ${hre.ethers.formatUnits(transferAmount, 18)} HIVE to ${recipientAddress}...`);
  
  const tx = await HiveToken.transfer(recipientAddress, transferAmount);
  await tx.wait();
  
  console.log(`✅ Transfer complete! Transaction hash: ${tx.hash}`);
  
  // Check new balance
  const balance = await HiveToken.balanceOf(recipientAddress);
  console.log(`New balance: ${hre.ethers.formatUnits(balance, 18)} HIVE`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
