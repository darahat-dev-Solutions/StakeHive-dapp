<template>
 

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <!-- Wallet Balance -->
        <smallCard
          cardNameData="Wallet Balance"
          :cardValueData="formattedWalletBalance"
          tokenNameData="ETH"
          cardIconData="ETH"
          />
        <!-- Token Balance -->

        <smallCard
          cardNameData="HIVE Balance"
          :cardValueData= formatNumberShort(wallet.tokenBalance)
          tokenNameData="HIVE"
          cardIconData="hive"
          />
        <!-- Staked Amount -->
        <smallCard
          cardNameData="Staked Amount"
          :cardValueData= formatNumberShort(wallet.stakedAmount)
          tokenNameData="HIVE"
          cardIconData="hive"
          />

        <!-- Pending Rewards -->
         <smallCard
          cardNameData="Pending Rewards"
          :cardValueData="wallet.pendingRewards"
          tokenNameData="HIVE"
          cardIconData="hive"
          />

      </div>
 
</template>
 

<script setup>
import { ref, watch, computed, onMounted,onBeforeUnmount } from 'vue';
import { ethers } from 'ethers';
import { useWalletStore } from '@/stores/walletStore';

const wallet = useWalletStore();
const stakeAmount = ref('10');
const isStaking = ref(false);
const isClaiming = ref(false);
const txStatus = ref(null);
const withdrawAmount = ref('0');
const isWithdrawing = ref(false);
const isTransferring = ref(false);
const recipient = ref('');
const amount = ref('');
const txHash = ref('');
let intervalId;

// Auto-load when connected
watch(() => wallet.isConnected, (connected) => {
  if (connected) wallet.loadStakingData();
 
}, { immediate: true });

async function handleTransfer() {
  const result = await wallet.transferHiveToken(recipient.value, amount.value);
  console.log(recipient.value, amount.value);
  console.log(result);
  if (result.success) {
    txHash.value = result.hash;
    recipient.value = '';
    amount.value = '';
  } else {
    alert('Error transferring tokens: ' + result.error);
  }
 }

// Auto-refresh logic
 
  onMounted(() => {
    // Initial fetch
    if (typeof window !== 'undefined') {

      wallet.getStakingData();

      // Refresh every second
      intervalId = setInterval(() => {
        wallet.getStakingData();
      }, 1000);

    }
  });

  onBeforeUnmount(() => {
    clearInterval(intervalId); // Clean up
  });
 
//formate all numbers
const formatNumber = (value) => {
  const num = Number(value);
  if (isNaN(num)) return '0';
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })
}
function formatNumberShort(value) {
  const num = Number(value);
  if (isNaN(num)) return value;

  const absNum = Math.abs(num);
//  if (absNum >= 1e27) return (num / 1e27).toFixed(2) + 'Oc'; // Octillion
  if (absNum >= 1e24) return (num / 1e24).toFixed(2) + 'Sp'; // Septillion
  if (absNum >= 1e21) return (num / 1e21).toFixed(2) + 'Sx'; // Sextillion
  if (absNum >= 1e18) return (num / 1e18).toFixed(2) + 'Qi'; // Quintillion
  if (absNum >= 1e15) return (num / 1e15).toFixed(2) + 'Qa'; // Quadrillion
  if (absNum >= 1e12) return (num / 1e12).toFixed(2) + 'T';  // Trillion
  if (absNum >= 1e9)  return (num / 1e9).toFixed(2) + 'B';   // Billion
  if (absNum >= 1e6)  return (num / 1e6).toFixed(2) + 'M';   // Million
  if (absNum >= 1e3)  return (num / 1e3).toFixed(2) + 'K';   // Thousand

  return num.toFixed(2); // Optional: always show 2 decimals
}
const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};
// Formatted values
const formattedWalletBalance = computed(() => {
  return Number(wallet.totalBalance).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });
});

const formattedStakedAmount = computed(() => {
  return Number(wallet.stakedAmount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });
});

const formattedPendingRewards = computed(() => {
  return Number(wallet.pendingRewards).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });
});

const stake = async () => {
  if (!stakeAmount.value || isStaking.value || !wallet.isConnected) return;
  
  try {
    isStaking.value = true;
    txStatus.value = null;
    const amount = stakeAmount.value.toString();
    // const amount = ethers.parseUnits(stakeAmount.value.toString(), 18);
    const tx = await wallet.stake(amount);
    
    txStatus.value = {
      success: true,
      message: 'Staking transaction successful!',
      txHash: tx.hash
    };
    
    await wallet.loadStakingData();
  } catch (error) {
    console.error('Staking failed:', error);
    txStatus.value = {
      success: false,
      message: error.message || 'Staking transaction failed',
      txHash: null
    };
  } finally {
    isStaking.value = false;
  }
};

const claim = async () => {
  if (isClaiming.value || !wallet.isConnected) return;
  
  try {
    isClaiming.value = true;
    txStatus.value = null;
    
    const tx = await wallet.claimRewards();
    
    txStatus.value = {
      success: true,
      message: 'Rewards claimed successfully!',
      txHash: tx.hash
    };
    
    await wallet.loadStakingData();
  } catch (error) {
    console.error('Claim failed:', error);
    txStatus.value = {
      success: false,
      message: error.message || 'Claim transaction failed',
      txHash: null
    };
  } finally {
    isClaiming.value = false;
  }
};
const withdraw  = async () => {
  if (!withdrawAmount.value || Number(withdrawAmount.value) <= 0) return;
  isWithdrawing.value = true;
  txStatus.value = null;
  try {
    const result = await wallet.withdraw(withdrawAmount.value);
    console.log('Withdraw result:',result);
     if (result.error) {
      throw new Error(result.error);
    }
    txStatus.value = {
      success: true,
      message: 'Withdrawal  successful!',
      txHash: result.hash
    }
        withdrawAmount.value = '';  // Clear input after successful withdrawal

  } catch (error) {
console.error("Withdrawal error:", error);
    throw error;
    
  } finally {
    isWithdrawing.value = false;
  }
}
// Auto-hide tx status after 5 seconds
watch(txStatus, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      txStatus.value = null;
    }, 5000);
  }
}, { deep: true });
</script>