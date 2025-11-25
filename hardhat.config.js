require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@openzeppelin/hardhat-upgrades");
require("solidity-coverage");

/** @type import('hardhat/config').HardhatUserConfig */
const { PRIVATE_KEY, SEPOLIA_RPC_URL } = process.env;

// Build networks object conditionally to avoid HH8 config errors
const networks = {
  localhost: {
    url: "http://127.0.0.1:8545",
  },
  localalt: {
    url: "http://127.0.0.1:8555",
  }
};

// Only add sepolia if both env vars are present (prevents HH8 when undefined)
if (SEPOLIA_RPC_URL && PRIVATE_KEY) {
  networks.sepolia = {
    url: SEPOLIA_RPC_URL.trim(),
    accounts: [PRIVATE_KEY.trim()],
  };
}
// Force Ethers v6 resolution
// config.resolver = {
//   ethers: require.resolve("ethers")
// };

module.exports = {
  solidity: "0.8.28",
  settings: { optimizer: { enabled: true, runs: 200 } },
  networks,
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};