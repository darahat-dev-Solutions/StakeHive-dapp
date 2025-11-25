<div align="center">
  <img src="https://raw.githubusercontent.com/Darahat/darahat/main/gitImages/stakehive-defi-dapp-netlify-app-06-05-2025_05_00_PM.png" alt="StakeHive Banner" width="800" height="400"/>
</div>

# 🚀 StakeHive — Enterprise-Grade DeFi Staking Protocol

---

## 🔥 Live Demo

Explore the app live here:
[https://stakehive-defi-dapp.netlify.app/](https://stakehive-defi-dapp.netlify.app/)

StakeHive is a decentralized finance (DeFi) app enabling users to stake custom HIVE tokens, earn rewards, claim, withdraw, and transfer tokens securely on the blockchain.

---

## 🧪 How to Use StakeHive

Want to start staking with StakeHive? Follow these simple steps:

---

### 🔹 Step 1: Enable Test Networks in MetaMask

By default, MetaMask hides test networks. To enable them:

1. Open **MetaMask**.
2. Click on your **account icon** → **Settings**.
3. Navigate to **Advanced**.
4. Scroll to **Show test networks** and **toggle it ON**.
5. Return to the main screen, and you’ll now see **Sepolia** in the network dropdown.

---

### 🔹 Step 2: Add Sepolia Testnet (If Not Visible)

If Sepolia isn’t showing:

1. Click **"Select Network"** → **"Add network"** → **"Add network manually"**.

2. Fill in the following:

   ```
   Network Name: Sepolia Test Network
   RPC URL: https://rpc.sepolia.org
   Chain ID: 11155111
   Currency Symbol: ETH
   Block Explorer URL: https://sepolia.etherscan.io
   ```

3. Click **Save**.

---

### 🔹 Step 3: Get Sepolia ETH for Gas

You’ll need Sepolia ETH to pay for gas fees. Use one of the following faucets:

- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Chainlink Sepolia Faucet](https://faucets.chain.link/sepolia)
- [Google Cloude Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)

Paste your MetaMask wallet address and request test ETH.

---

### 🔹 Step 4: Add HIVE Token to MetaMask

To see your HIVE token in MetaMask:

1. Open MetaMask → go to **Assets** → click **Import tokens**.

2. Enter your deployed token details:

   ```
   Token Contract Address: 0x359863fB0ca4E4be77daD9dFFBB0BbdA94690cCC
   Token Symbol: HIVE
   Decimals: 18
   ```

3. Click **Add Custom Token** → **Import Tokens**.

You'll now see your HIVE balance.

> ⚠️ **Note**: This is the current Sepolia deployment address. If you deploy your own contracts, use the address printed in your deploy output.

---

### 🔹 Step 5: Connect Wallet to StakeHive

1. Visit the live app: [https://stakehive-defi-dapp.netlify.app](https://stakehive-defi-dapp.netlify.app)
2. Click **Connect Wallet**.
3. Choose MetaMask or another supported wallet via **Web3Modal**.

---

## 🔁 StakeHive Features & How to Use Them

---

### ✅ Stake HIVE Tokens

- Go to the **Stake** section.
- Enter the amount of HIVE you want to stake.
- Click **Stake**, then approve the transaction in MetaMask.
- Your tokens are now staked and earning rewards.

---

### 💸 Claim Rewards

- Navigate to the **Rewards** section.
- Click **Claim** and approve the transaction.
- Your rewards are sent to your wallet instantly.

---

### 🔓 Withdraw Staked Tokens

> ⚠️ You can only withdraw after the lock duration expires.

- Go to your **Staked Balance**.
- Click **Withdraw**, confirm in MetaMask.
- Staked tokens will return to your wallet.

---

### 🔁 Transfer HIVE Tokens

- Open the **Transfer** tab.
- Enter the recipient wallet address and amount.
- Click **Send** and confirm the transaction.
- Tokens are transferred peer-to-peer via blockchain.

---

## 🎯 Pro Tips

- Make sure you have **Sepolia ETH** in your wallet for transactions.
- View all your blockchain activity on [Sepolia Etherscan](https://sepolia.etherscan.io).
- If tokens aren’t showing in MetaMask, use **"Import Tokens"** with your HIVE token contract address.
- Use this app for **educational and testing purposes only** — the tokens and network are not real/mainnet.

---

## ✨ Key Features

| Feature            | Description                                                             | Tech Used               |
| ------------------ | ----------------------------------------------------------------------- | ----------------------- |
| Custom ERC20 Token | `HIVE` token with minting and burning functionality                     | Solidity, OpenZeppelin  |
| Staking Contract   | Time-locked staking with secure rewards distribution                    | Solidity, Hardhat       |
| Token Transfer     | Transfer HIVE tokens between accounts with blockchain verification      | Ethers.js, MetaMask     |
| Real-Time Updates  | Reactive UI reflecting live balances, rewards, and transaction statuses | Vue 3, Nuxt 3, Tailwind |
| Wallet Integration | Supports MetaMask, WalletConnect, and Coinbase Wallet                   | Web3Modal               |
| Responsive UI      | Mobile and desktop friendly dashboard with staking analytics and charts | Tailwind CSS, Chart.js  |

---

## 🏗️ Architecture Overview

Here’s a simplified view of the StakeHive architecture — how components connect and communicate:

```mermaid
graph TD
A[Frontend: Nuxt3] -->|Ethers.js| B[Smart Contracts]
B --> C[Blockchain]
F[Users] --> A


```

---

## 🛠️ Technology Stack

### Smart Contracts

- **Language**: Solidity (v0.8+)
- **Frameworks**: Hardhat for development, testing, and deployment
- **Testing**: Mocha, Chai, and Slither static analysis for security checks
- **Network**: Deployed on Sepolia Testnet (Etherscan verified)

### Frontend

- **Framework**: Nuxt 3 with Composition API (Vue 3)
- **Blockchain**: Ethers.js v6 for smart contract interaction
- **Wallets**: MetaMask, WalletConnect, Coinbase Wallet through Web3Modal
- **Styling**: Tailwind CSS + DaisyUI for rapid, responsive UI development
- **Charts & Analytics**: Chart.js for staking and reward visuals
- **Deployment**: Hosted on Netlify

---

## 📦 Getting Started

Follow these steps to run the project locally and test your own deployment:

```bash
# 1. Clone the repo
git clone https://github.com/Darahat/stakehive-dapp.git
cd stakehive-dapp

# 2. Install dependencies for backend and frontend
npm install
cd frontend && npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your Sepolia RPC URL and wallet PRIVATE_KEY
```

### 🔴 **IMPORTANT: Contract Address Management**

The project uses **dynamic address mapping** based on network chain ID. Contract addresses are **hardcoded** in `frontend/utils/contract.js`:

- **Chain 31337 (Hardhat Local)**: Ephemeral addresses that change with each deployment
- **Chain 11155111 (Sepolia)**: Production testnet addresses

#### **Option A: Use Existing Deployed Contracts (Recommended for Testing)**

The frontend is pre-configured with deployed Sepolia contracts:

- HiveToken: `0x359863fB0ca4E4be77daD9dFFBB0BbdA94690cCC`
- StakeHiveFarm: `0x3531D47A28Aa87Bd5F9eaD3D2d8Fe07Ce16C8DDc`

Just run the frontend:

```bash
cd frontend
npm run dev
```

#### **Option B: Deploy Your Own Contracts**

⚠️ **WARNING**: Deploying new contracts will create **different addresses**. You **MUST** update `frontend/utils/contract.js` manually.

```bash
# For local development:
npx hardhat node  # Keep this running
# In another terminal:
npx hardhat run scripts/deploy.js --network localhost

# For Sepolia testnet:
npx hardhat run scripts/deploy.js --network sepolia
```

**After deployment, you MUST:**

1. Copy the printed contract addresses from console output
2. Update `frontend/utils/contract.js` → `ADDRESS_MAP[chainId]` with new addresses
3. Restart the frontend
4. Import the new HiveToken address to MetaMask
5. Transfer tokens to your account:
   ```bash
   # Edit scripts/transfer-tokens.js with your address and new token address
   npx hardhat run scripts/transfer-tokens.js --network sepolia
   ```

```bash
# 5. Run the frontend
cd frontend
npm run dev
```

---

## 🔍 Usage Notes

- **Wallet Connection**: MetaMask or compatible wallets are required. If MetaMask is not detected, the app prompts with a styled popup to install it.
- **Token Balances**: The HIVE token balance is shown dynamically, fetched from the blockchain.
- **Staking Limits**: The amount you can stake is limited by your current HIVE token balance.
- **Gas Fees**: The app is optimized for gas efficiency but you will still need testnet ETH for transactions.
- **Token Transfer**: Transfers are peer-to-peer and verified on-chain; tokens sent will reflect on the recipient's wallet.
- **Real-Time UI**: Vue watchers ensure balances, rewards, and staking statuses update automatically without manual refresh.

---

## 📊 Performance Highlights

| Metric               | Value                |
| -------------------- | -------------------- |
| Contract Size        | \~24.5 KB            |
| Average Gas Cost     | \~142,000 gas        |
| Transactions Per Sec | \~18.7 TPS (testnet) |
| Frontend Load Time   | \~1.2 seconds        |

---

## 🔧 Managing Contract Addresses (For Developers)

> 📖 **Full Guide**: [docs/ADDRESS_MANAGEMENT.md](docs/ADDRESS_MANAGEMENT.md)

### Automated Deployment (Recommended)

Use the enhanced deployment script that automatically updates frontend addresses:

```bash
# Deploy and auto-update addresses
npx hardhat run scripts/deploy-and-update.js --network sepolia
```

This script will:

1. Deploy both contracts
2. Automatically update `frontend/utils/contract.js`
3. Print next steps for you

### Manual Address Update

If you need to update addresses manually:

```bash
node scripts/update-addresses.js <chainId> <hiveTokenAddress> <stakeHiveFarmAddress>

# Example for Sepolia:
node scripts/update-addresses.js 11155111 0x359863fB... 0x3531D47A...
```

### Understanding Address Management

The dApp uses **dynamic address mapping** in `frontend/utils/contract.js`:

```javascript
export const ADDRESS_MAP = {
  31337: {
    /* Hardhat local addresses */
  },
  11155111: {
    /* Sepolia addresses */
  },
};
```

When you connect your wallet, the dApp automatically:

1. Detects your network's chain ID
2. Loads the correct contract addresses for that chain
3. Queries those contracts for balances and data

**Why this matters:**

- Running `deploy.js` creates NEW contracts with NEW addresses
- Old addresses become invalid
- You MUST update `ADDRESS_MAP` or use `deploy-and-update.js`

---

## ⚠️ Common Issues & Debugging Tips

- **"Unknown Token" in MetaMask**: You must manually add the HIVE token contract address in MetaMask to see the token and balance.
- **"Available Balance: 0.00 HIVE" but MetaMask shows tokens**: Contract address mismatch. Check browser console for logs. Update MetaMask with current deployed address or redeploy using the old token address.
- **Transaction Failures**: Check that you have enough test ETH for gas and the correct amount of HIVE tokens approved.
- **BigNumber Issues**: Always convert inputs and amounts properly using `ethers.parseUnits(value, 18)` for token decimals.
- **Wallet Not Detected**: The app shows a friendly prompt to install MetaMask with a helpful link.
- **Error Handling**: All blockchain transactions are wrapped in try/catch with user-friendly status messages.
- **Stale Contract Addresses**: After redeploying contracts, use `deploy-and-update.js` or manually update addresses in `frontend/utils/contract.js`.

---

## 👨‍💻 Developer Notes

- This app uses **Ethers.js v6** — syntax differs from v5 (especially `parseEther` and contract calls).
- Smart contracts include reentrancy guards and gas optimizations.
- Vue 3 Composition API provides modular and reactive state management with watchers for blockchain state.
- The frontend automatically updates staking and rewards info on wallet events.
- The backend admin panel (Laravel) manages off-chain data and analytics (not included in this repo).

---

## 📬 Contact & Collaboration

**Didarul Alam Rahat**
Senior Full Stack & Web3 Developer

- 🔗 [LinkedIn](https://linkedin.com/in/darahat)
- 📧 [darahat42@gmail.com](mailto:darahat42@gmail.com)
- 🐦 [@darahat42](https://twitter.com/darahat42)

_Open to senior Web3 roles, audits, consulting, and collaborations._

---

## 📜 License

MIT License © 2023 Didarul Alam Rahat

---

Feel free to open issues or submit pull requests to improve the project! Your feedback and contributions are welcome.

---

**Happy BUIDLing!** 🚀🐝

---
