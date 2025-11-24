// StakeHiveFarm deployed to 
// Localhost: StakeHiveFarm deployed to (local Hardhat node)
export const STAKE_HIVE_ADDRESS = '0x0165878A594ca255338adfa4d48449f69242Eb8F';
// Localhost: HiveToken deployed to (local Hardhat node)
export const HIVE_TOKEN_ADDRESS = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707';

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

