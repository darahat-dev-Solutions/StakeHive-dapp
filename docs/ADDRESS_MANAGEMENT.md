# 🎯 Quick Reference: Contract Address Management

## TL;DR

**Just want to test the dApp?**

```bash
cd frontend
npm run dev
```

Use the pre-deployed Sepolia contracts. No deployment needed!

---

## For Developers: Deploying New Contracts

### ⚠️ Critical Understanding

When you deploy contracts, you get **NEW addresses**. The frontend **MUST** be updated to use these new addresses.

```
Deploy Script → Creates NEW Contracts → NEW Addresses → Update Frontend
```

---

## 🟢 Recommended: Automated Deployment

This handles everything for you:

```bash
# Deploy and auto-update frontend addresses
npx hardhat run scripts/deploy-and-update.js --network sepolia
```

**What it does:**

1. ✅ Deploys HiveToken
2. ✅ Deploys StakeHiveFarm
3. ✅ Transfers tokens to farm
4. ✅ Sets reward rate
5. ✅ **Automatically updates `frontend/utils/contract.js`**
6. ✅ Prints next steps

---

## 🔴 Manual Deployment (Not Recommended)

If you use the standard deploy script:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

**You MUST manually update addresses:**

### Option 1: Use the update script

```bash
node scripts/update-addresses.js 11155111 <HIVE_TOKEN_ADDRESS> <STAKE_FARM_ADDRESS>
```

### Option 2: Edit `frontend/utils/contract.js` manually

```javascript
export const ADDRESS_MAP = {
  11155111: {
    HIVE_TOKEN: "0xYOUR_NEW_TOKEN_ADDRESS",
    STAKE_HIVE: "0xYOUR_NEW_FARM_ADDRESS",
  },
};
```

---

## 🔍 Current Deployed Addresses

### Sepolia Testnet (Chain ID: 11155111)

- **HiveToken**: `0x359863fB0ca4E4be77daD9dFFBB0BbdA94690cCC`
- **StakeHiveFarm**: `0x3531D47A28Aa87Bd5F9eaD3D2d8Fe07Ce16C8DDc`

View on Etherscan:

- [HiveToken](https://sepolia.etherscan.io/address/0x359863fB0ca4E4be77daD9dFFBB0BbdA94690cCC)
- [StakeHiveFarm](https://sepolia.etherscan.io/address/0x3531D47A28Aa87Bd5F9eaD3D2d8Fe07Ce16C8DDc)

### Hardhat Local (Chain ID: 31337)

Addresses are ephemeral and reset each time you run a script:

- **HiveToken**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **StakeHiveFarm**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

---

## 🐛 Troubleshooting

### "Available Balance: 0.00 HIVE" but MetaMask shows tokens

**Cause**: Contract address mismatch

**Solution**:

1. Open browser console (F12)
2. Look for log: `💰 Fetching balance from HIVE token at: 0x...`
3. Compare this address with MetaMask token address
4. If different, either:
   - Update MetaMask with new address, OR
   - Redeploy contracts and update frontend

### Frontend not recognizing new contracts

**Solution**:

1. Restart the frontend dev server
2. Hard refresh browser (Ctrl+Shift+R)
3. Reconnect MetaMask wallet

### How to get tokens after deploying

```bash
# Edit scripts/transfer-tokens.js:
# - Update recipientAddress to your wallet
# - Update hiveTokenAddress to newly deployed address
# - Update transferAmount if needed

npx hardhat run scripts/transfer-tokens.js --network sepolia
```

---

## 📂 Key Files

- `frontend/utils/contract.js` - Address mapping (update this!)
- `scripts/deploy-and-update.js` - Automated deployment (recommended)
- `scripts/deploy.js` - Standard deployment (manual update required)
- `scripts/update-addresses.js` - Helper to update frontend addresses
- `scripts/transfer-tokens.js` - Transfer tokens to your account

---

## 💡 Best Practices

1. ✅ Use `deploy-and-update.js` for all deployments
2. ✅ Commit address changes to git
3. ✅ Document deployed addresses in this file or README
4. ✅ Test on local Hardhat first before deploying to Sepolia
5. ❌ Don't manually edit `deploy.js` - use `deploy-and-update.js`
6. ❌ Don't forget to transfer tokens after deployment
7. ❌ Don't commit `.env` file with private keys

---

## 🔗 Related Documentation

- [Main README](../README.md)
- [Hardhat Config](../hardhat.config.js)
- [Contract Address Map](../frontend/utils/contract.js)
