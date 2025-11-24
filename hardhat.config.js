require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@openzeppelin/hardhat-upgrades");
require("solidity-coverage");

/** @type import('hardhat/config').HardhatUserConfig */
const { PRIVATE_KEY, SEPOLIA_RPC_URL } = process.env;
// Force Ethers v6 resolution
// config.resolver = {
//   ethers: require.resolve("ethers")
// };

module.exports = {
  solidity: "0.8.28",
  settings: { optimizer: { enabled: true, runs: 200 } },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    localhost: {
      url: "http://127.0.0.1:8545", // Fixed typo (replaced . with :)
    }
  },
    gasReporter: {
    enabled: true,
    currency: "USD",
  },
  paths: { // Moved outside of networks
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  }
};