import { ethers } from 'ethers';
import { defineStore } from 'pinia';
// import contract.js
import { ERC20_ABI, HIVE_TOKEN_ADDRESS, STAKE_HIVE_ABI, STAKE_HIVE_ADDRESS, getAddressesForChain } from '@/utils/contract.js';

export const useWalletStore = defineStore('wallet', {

  state: () => ({
    address: '',
    provider: null,
    account: '',
    isConnected: false,
    chainId: null,
    netWorkName: '',
    totalBalance: '0',
    pendingRewards: '0',
    stakedAmount: '0',
    signer: null,
    tokenBalance: null,
    stakingHistory: [], // Array of { timestamp, stakedAmount, rewards }
    loadingHistory: false,
    stakeHistory: [],
    rewardHistory: [],
    unstakeHistory: [],
    tokenContracts: {
      // Add your token contracts here
      HIVE: {
        address: HIVE_TOKEN_ADDRESS, // Replace with actual contract address
        abi: ERC20_ABI // ERC-20 ABI
      },
    },
    stakeHiveContracts: {
      // Add your token contracts here
      STAKEHIVE: {
        address: STAKE_HIVE_ADDRESS, // Replace with actual contract address
        abi: STAKE_HIVE_ABI // ERC-20 ABI
      },
    }
  }),
  actions: {
     
// stores/walletStore.js or composables/useWallet.js
 isMetaMaskInstalled() {
  if (typeof window === 'undefined') return false; // SSR guard
  return typeof window.ethereum !== 'undefined';
},

  
    async connectWallet() {

 

      const { $web3Provider, $ethers } = useNuxtApp();

      try {
        // this.provider = $web3Provider.provider;
        // const getNetWorkInfo = await this.provider.getNetwork();

        const web3Provider = $web3Provider.provider;
        const getNetWorkInfo = await web3Provider.getNetwork();
        this.provider = web3Provider;
        this.chainId = Number(getNetWorkInfo.chainId); // Ensure number
        this.netWorkName = getNetWorkInfo.name; // Access raw value
        
        // Dynamically update contract addresses based on chain
        const addrMap = getAddressesForChain(this.chainId);
        console.log(`🔗 Connected to chain ${this.chainId} (${this.netWorkName})`);
        console.log(`📍 Using addresses:`, addrMap);
        
        if (addrMap) {
          this.tokenContracts.HIVE.address = addrMap.HIVE_TOKEN;
          this.stakeHiveContracts.STAKEHIVE.address = addrMap.STAKE_HIVE;
          console.log(`✅ Updated HIVE token address to: ${addrMap.HIVE_TOKEN}`);
          console.log(`✅ Updated StakeHive farm address to: ${addrMap.STAKE_HIVE}`);
        }
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.account = accounts[0];
        this.isConnected = this.account.length > 0;
        this.signer =  $web3Provider.getSigner();
        // const { ethers } = $web3Provider;
        if (!this.signer) {
  console.warn("Signer is not set.");
  return;
}
        await this.loadStakingData();

      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    },
    async getWalletBalance(web3Provider) {
      // const { $ethers } = useNuxtApp();
        //  console.log("provider", this.provider);
        // console.log("netWorkName", this.netWorkName);
        // console.log("chainId", this.chainId);
        // console.log("account", this.account);
      try {
        const balanceBigNumber = await web3Provider.getBalance(this.account);
        this.totalBalance = ethers.formatEther(balanceBigNumber);

        console.log("totalBalance", this.totalBalance);
        // this.balance = $ethers.formatEther(balanceBigNumber);
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
        this.balance = '0'; // Fallback in case of error
      }
    },
    async getTokenBalance(web3Provider) {
      
       try {
         const tokenInfo = this.tokenContracts.HIVE;
         console.log(`💰 Fetching balance from HIVE token at: ${tokenInfo.address}`);
         console.log(`👤 For account: ${this.account}`);
         
         if (!web3Provider) {
           console.warn('⚠️ Provider not initialized');
           return;
         }
         
         const code = await web3Provider.getCode(tokenInfo.address);
         if (code === '0x') {
           console.error(`❌ No contract code at ${tokenInfo.address} on chain ${this.chainId}. Check network or address.`);
           this.tokenBalance = 'N/A';
           return;
         }
         console.log(`✅ Contract found at ${tokenInfo.address}`);
         
        //create  contract instance
        //  const tokenContract = new ethers.Contract(tokenInfo.address, tokenInfo.abi, this.signer);
         const tokenContract = new ethers.Contract(tokenInfo.address, tokenInfo.abi, web3Provider);

         // get token balance
        // console.log("tokenContract", tokenContract);

        const rawBalance = await tokenContract.balanceOf(this.account);
         console.log(`📊 Raw balance (wei): ${rawBalance.toString()}`);
         this.tokenBalance = ethers.formatEther(rawBalance);
         console.log(`💵 Formatted token balance: ${this.tokenBalance} HIVE`);


         
         
         
      } catch (error) {
        console.error("Error fetching token balance:", error);
        this.tokenBalance = '0';
      }
    },
 async fetchStakingHistory() {
  const { $web3Provider } = useNuxtApp(); // Get web3Provider from Nuxt context

   try {
      this.loadingHistory = true;

    const provider = $web3Provider.provider; // Extract the provider from Nuxt's injected object

     if (!this.account || !provider) {
      return []; // Return empty array instead of undefined
    }

    // Get contract details from your store for HIVE token and StakeHive contract
    const hiveTokenInfo = this.tokenContracts.HIVE;
    const stakeHiveInfo = this.stakeHiveContracts.STAKEHIVE;

    // Create contract instances with provider (read-only)
    const hiveToken = new ethers.Contract(hiveTokenInfo.address, hiveTokenInfo.abi, provider);
    const stakingContract = new ethers.Contract(stakeHiveInfo.address, stakeHiveInfo.abi, provider);

    // Get the current block number from the blockchain
    const currentBlock = await provider.getBlockNumber();

    // Set a safe starting block to reduce load (e.g., last 20k blocks ~ few days)
    const fromBlock = Math.max(currentBlock - 20000, 0);

    // Fetch all relevant staking-related events using contract filters
    const [stakeEvents, unstakeEvents, rewardEvents, transfersToStaking] = await Promise.all([
      stakingContract.queryFilter(stakingContract.filters.Staked(this.account), fromBlock, 'latest'), // Staked events
      stakingContract.queryFilter(stakingContract.filters.Unstaked(this.account), fromBlock, 'latest'), // Unstaked events
      stakingContract.queryFilter(stakingContract.filters.RewardPaid(this.account), fromBlock, 'latest'), // Reward paid events
      hiveToken.queryFilter(hiveToken.filters.Transfer(this.account, stakeHiveInfo.address), fromBlock, 'latest') // Fallback: direct token transfers to staking contract
    ]);

    // Helper function to normalize events into a consistent format
    const processEvents = async (events, type, key, source) => {
      return Promise.all(events.map(async (e) => {
        try {
          // Get block information - use provider to fetch block by number
          const block = await provider.getBlock(e.blockNumber);
          const blockTimestamp = block ? block.timestamp : Math.floor(Date.now() / 1000);
          
          return {
            type, // stake, unstake, reward
            amount: ethers.formatUnits(e.args[key], 18), // Format token amount to readable ether units
            timestamp: blockTimestamp * 1000, // Convert UNIX timestamp to milliseconds
            txHash: e.transactionHash, // Transaction hash for reference
            source // Source of the event: "staking-contract" or "erc20-transfer"
          };
        } catch (error) {
          console.error('Error processing event:', error, e);
          return {
            type,
            amount: ethers.formatUnits(e.args[key], 18),
            timestamp: Math.floor(Date.now() / 1000) * 1000, // Fallback to current time
            txHash: e.transactionHash,
            source
          };
        }
      }));
    };

    // Format all four event groups into a standard structure
    this.stakeHistory = await processEvents(stakeEvents, 'stake', 'amount', 'staking-contract');
    this.unstakeHistory = await processEvents(unstakeEvents, 'unstake', 'amount', 'staking-contract');
    this.rewardHistory = await processEvents(rewardEvents, 'reward', 'reward', 'staking-contract');
    this.fallbackStakeHistory = await processEvents(transfersToStaking, 'stake', 'value', 'erc20-transfer');

    // Combine all events into one list
    const combined = [...this.stakeHistory, ...this.unstakeHistory, ...this.rewardHistory, ...this.fallbackStakeHistory];

    // Remove duplicates using txHash + type and sort by timestamp ascending
    const uniqueSortedHistory = combined
      .filter((item, index, self) =>
        index === self.findIndex(t => t.txHash === item.txHash && t.type === item.type)
      )
      .sort((a, b) => a.timestamp - b.timestamp);

    // Update the store with the final cleaned and sorted history
    this.stakingHistory = uniqueSortedHistory;

     console.log("Fetched staking history:", this.stakingHistory); // Debug: Show staking history in console
 
     return this.stakingHistory; // Return the history for further use if needed

  } catch (error) {
    console.error("Error fetching staking history:", error); // Catch and log any errors
    this.stakingHistory = []; // Reset history on error
   } finally {
    this.loadingHistory = false; // Reset loading state
  }
},
   async loadStakingHistory() {
  try {
    // Directly return the result of fetchStakingHistory
    return await this.fetchStakingHistory();
  } catch (error) {
    console.error("Load error:", error);
    return [];
  }
},
  async getStakingData() {
     const { $web3Provider } = useNuxtApp();
    try {
      // Check if account is connected
      if (!this.account) {
        console.warn('No account connected. Skipping staking data fetch.');
        return;
      }
        const web3Provider = $web3Provider.provider;
        const stakeHiveInfo = this.stakeHiveContracts.STAKEHIVE;
        const stakeHiveContract  = new ethers.Contract(stakeHiveInfo.address, stakeHiveInfo.abi, web3Provider);
        const pendingRewards = await stakeHiveContract.getPendingRewards(this.account);
        this.pendingRewards = ethers.formatEther(pendingRewards);

        //Get Staked Info (struct with amount, rewardDebt, lastStakedTime)
        const stakerInfo = await stakeHiveContract.stakers(this.account);
        this.stakedAmount = ethers.formatEther(stakerInfo.amount);
        this.rewardDebt = ethers.formatEther(stakerInfo.rewardDebt);
        // console.log("web3Provider", web3Provider);
        
        // console.log("stakedAmount", this.stakedAmount);
        // console.log("rewardDebt", this.rewardDebt);
      }catch (error) {
        console.error("Error fetching staking data:", error);
      }
    },
    async stake(amountinEther) {
      console.log("amountinEther-------------------", amountinEther);
      const { $web3Provider } = useNuxtApp();
    

      // process.exit(0);
      try {
        const signer =  $web3Provider.getSigner(); // ✅ get the signer
        // const amount =  ethers.parseEther(`${amountinEther}`);
       
        const stakeHiveInfo = this.stakeHiveContracts.STAKEHIVE;

        const web3Provider = $web3Provider.provider;

        //approve token
        const tokenInfo = this.tokenContracts.HIVE;
        //create  contract instance
        const tokenContract = new ethers.Contract(tokenInfo.address, tokenInfo.abi, signer);
        const amount = ethers.parseUnits(amountinEther.toString(), 18);
        console.log("requested amountinEther:", amount);
        const approveTx = await tokenContract.approve(stakeHiveInfo.address , amount);
        await approveTx.wait(); // Wait for approval transaction to be mined
        console.log("Token approved for staking:", approveTx);

        const stakeHiveContract  = new ethers.Contract(stakeHiveInfo.address, stakeHiveInfo.abi, signer);   
        const tx = await stakeHiveContract.stake(amount);
        await tx.wait();
        console.log("Staking transaction sent:", tx);
        await this.loadStakingData();
        return tx;
        // await tx.wait();
       } catch (error) {
        console.error("Error staking:", error);
      }
    },
    async claimRewards() {
      try {
        const stakeHiveInfo = this.stakeHiveContracts.STAKEHIVE;
        const { $web3Provider } = useNuxtApp();
        const signer = $web3Provider.getSigner();
        const web3Provider = $web3Provider.provider;

        const stakeHiveContract  = new ethers.Contract(stakeHiveInfo.address, stakeHiveInfo.abi, signer);   
        const tx = await stakeHiveContract.claimRewards();
        console.log('Claiming tx sent:', tx.hash);
        await tx.wait();
        console.log('ClaimRewards tx confiremed:', tx);
       await this.loadStakingData();
        return tx;
      }catch (error) {
        console.error("Error claiming rewards:", error);
      }
    },
    async withdraw(amountinEther) {
      const { $web3Provider } = useNuxtApp();
    
      try {
          if (!amountinEther || Number(amountinEther) <= 0) {
      throw new Error("Invalid withdrawal amount");
        }
       //get Signer
        const signer = await $web3Provider.getSigner();
        const stakeHiveInfo = this.stakeHiveContracts.STAKEHIVE;

        const stakeHiveContract = new ethers.Contract(stakeHiveInfo.address, stakeHiveInfo.abi, signer);   

        //convert to wei
        const amount = ethers.parseUnits(amountinEther.toString(), 18);

        //check available balance
        const stakedInfo = await stakeHiveContract.stakers(this.account);

        if (stakedInfo.amount < amount) {
          throw new Error("Insufficient staked amount for withdrawal");
        }

        const tx = await stakeHiveContract.withdraw(amount);
        console.log('Withdraw tx sent:', tx.hash);
      //  wait for transaction confirmation (mined)
        const receipt  = await tx.wait();
         if (receipt.status !== 1) {
      throw new Error("Transaction failed on-chain");
    }
      await this.loadStakingData();
        return {
      hash: receipt.transactionHash,
      receipt,
      error: null

    };
      } catch (error) {
        
      }
    },
    async loadStakingData() {
             const { $web3Provider } = useNuxtApp();
        const web3Provider = $web3Provider.provider;

       await this.getWalletBalance(web3Provider); // <-- Fetch balance after connecting
        await this.getTokenBalance(web3Provider);
        await this.getStakingData();
    },

       

      async  transferHiveToken(toAddress, amountinEther){
        try {
          const { $web3Provider } = useNuxtApp();
          const signer = $web3Provider.getSigner();
          const tokenInfo = this.tokenContracts.HIVE;
          const tokenContract = new ethers.Contract(tokenInfo.address, tokenInfo.abi, signer);
          const amount = ethers.parseUnits(amountinEther.toString(), 18);
          const tx = await tokenContract.transfer(toAddress, amount);
          console.log("Transfer transaction sent:", tx.hash);
          const receipt = await tx.wait();
          if (receipt.status !== 1) {
            throw new Error("Transfer failed on-chain");
          }
          return {
            hash: tx.hash,
            receipt,
            error: null
          }

        } catch (error) {
          console.error("Error transferring HIVE tokens:", error);
          return {
      success: false,
      message: error.message,
    };
        }
    }
      
      
      
  }

})


// export const STAKE_HIVE_ADDRESS = '0x5d2a70eBDa668D72a96D181845a34387E54e16b9';
// HiveToken Deployed to
// export const HIVE_TOKEN_ADDRESS = '0x9CF7441b32C4b6d8b79A6dC73f0bBC3088250519';
// 453,555.20
 
// 610.0