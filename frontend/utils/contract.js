/**
 * ⚠️ CRITICAL: CONTRACT ADDRESS MAPPING ⚠️
 * 
 * These addresses are HARDCODED and network-specific.
 * The dApp automatically selects the correct addresses based on your connected network's Chain ID.
 * 
 * 🔴 IMPORTANT FOR DEVELOPERS:
 * - If you run `npx hardhat run scripts/deploy.js --network <network>`, 
 *   NEW contracts will be deployed with DIFFERENT addresses.
 * - You MUST update this ADDRESS_MAP after deploying new contracts.
 * 
 * 🟢 RECOMMENDED APPROACH:
 * - Use: `npx hardhat run scripts/deploy-and-update.js --network <network>`
 * - This will automatically update these addresses after deployment.
 * 
 * 📍 Current Deployments:
 * - Chain 31337 (Hardhat Local): Ephemeral addresses, reset on each run
 * - Chain 11155111 (Sepolia Testnet): Production testnet deployment
 * 
 * To manually update addresses:
 *   node scripts/update-addresses.js <chainId> <hiveToken> <stakeFarm>
 */
export const ADDRESS_MAP = {
  31337: {
    HIVE_TOKEN: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    STAKE_HIVE: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  },
  11155111: {
    HIVE_TOKEN: '0x359863fB0ca4E4be77daD9dFFBB0BbdA94690cCC',
    STAKE_HIVE: '0x3531D47A28Aa87Bd5F9eaD3D2d8Fe07Ce16C8DDc'
  }
};

// Default export (fallback to Hardhat addresses if chainId not yet known)
export const STAKE_HIVE_ADDRESS = ADDRESS_MAP[31337].STAKE_HIVE;
export const HIVE_TOKEN_ADDRESS = ADDRESS_MAP[31337].HIVE_TOKEN;

export const STAKE_HIVE_ABI = [
    // Only relevant functions for frontend
    'function stake(uint256 _amount) external',
    'function withdraw(uint256 _amount) external',
    'function claimRewards() external',
    'function getPendingRewards(address user) view returns (uint256)',
    'function stakers(address user) view returns (uint256 amount, uint256 rewardDebt, uint256 lastStakedTime)',
    
  
  // Add these events
  'event Staked(address indexed user, uint256 amount)',
  'event Unstaked(address indexed user, uint256 amount)',
  'event RewardPaid(address indexed user, uint256 reward)'
]
// Minimal ERC-20 ABI for HIVE token
export const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
   'function symbol() view returns (string)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function transfer(address to, uint256 amount) external returns (bool)',
   'function totalSupply() view returns (uint256)',
  'function queryFilter(address from, address to, uint256 amount) view returns (uint256[] memory)',
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function decimals() view returns (uint8)",
];
const HIVE_TOKEN_ABI = [ // Minimum ABI for transfer
  "function transfer(address to, uint amount) external returns (bool)",
  "function decimals() public view returns (uint8)"
];

export function getAddressesForChain(chainId) {
  return ADDRESS_MAP[chainId] || ADDRESS_MAP[31337];
}
