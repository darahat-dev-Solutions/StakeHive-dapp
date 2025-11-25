const fs = require('fs');
const path = require('path');

/**
 * Updates contract addresses in frontend/utils/contract.js
 * Run this after deploying contracts to update the address map
 * 
 * Usage:
 *   node scripts/update-addresses.js <chainId> <hiveTokenAddress> <stakeHiveFarmAddress>
 * 
 * Example:
 *   node scripts/update-addresses.js 11155111 0x359863fB... 0x3531D47A...
 */

function updateAddresses(chainId, hiveToken, stakeFarm) {
  const contractFilePath = path.join(__dirname, '../frontend/utils/contract.js');
  
  if (!fs.existsSync(contractFilePath)) {
    console.error('❌ Error: contract.js not found at', contractFilePath);
    process.exit(1);
  }

  let content = fs.readFileSync(contractFilePath, 'utf8');
  
  // Build the regex pattern to match the specific chain's address block
  const chainPattern = new RegExp(
    `(${chainId}:\\s*\\{\\s*HIVE_TOKEN:\\s*)'[^']*'(,\\s*STAKE_HIVE:\\s*)'[^']*'`,
    'g'
  );
  
  // Replace with new addresses
  const updatedContent = content.replace(
    chainPattern,
    `$1'${hiveToken}'$2'${stakeFarm}'`
  );
  
  if (content === updatedContent) {
    console.log(`⚠️  No changes made. Chain ${chainId} might not exist in ADDRESS_MAP.`);
    console.log('   You may need to add it manually to contract.js');
    return;
  }
  
  fs.writeFileSync(contractFilePath, updatedContent, 'utf8');
  
  console.log('✅ Successfully updated contract addresses!');
  console.log(`   Chain ID: ${chainId}`);
  console.log(`   HIVE_TOKEN: ${hiveToken}`);
  console.log(`   STAKE_HIVE: ${stakeFarm}`);
  console.log('\n📍 Updated file: frontend/utils/contract.js');
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length !== 3) {
  console.error('Usage: node scripts/update-addresses.js <chainId> <hiveTokenAddress> <stakeHiveFarmAddress>');
  console.error('\nExample:');
  console.error('  node scripts/update-addresses.js 11155111 0x359863fB0ca4E4be77daD9dFFBB0BbdA94690cCC 0x3531D47A28Aa87Bd5F9eaD3D2d8Fe07Ce16C8DDc');
  process.exit(1);
}

const [chainId, hiveToken, stakeFarm] = args;

// Validate addresses
if (!hiveToken.startsWith('0x') || hiveToken.length !== 42) {
  console.error('❌ Invalid HiveToken address format');
  process.exit(1);
}

if (!stakeFarm.startsWith('0x') || stakeFarm.length !== 42) {
  console.error('❌ Invalid StakeHiveFarm address format');
  process.exit(1);
}

updateAddresses(chainId, hiveToken, stakeFarm);
