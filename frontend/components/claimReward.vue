<template>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Claim Rewards</h3>
            <div class="flex items-center justify-between mb-4">
              <p class="text-sm text-gray-500">Available rewards</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ formatedPendingRewards }} HIVE
              </p>
            </div>
            <button
              @click="claim"
              :disabled="isClaiming || !wallet?.isConnected || Number(wallet?.pendingRewards) <= 0"
              class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-base font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              <svg v-if="isClaiming" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isClaiming ? 'Processing...' : 'Claim Rewards' }}
            </button>
          </div>
</template>
<script setup>
import { ref } from 'vue';
const isClaiming = ref(false);
const txStatus = ref(null);
const props = defineProps({
  wallet: {
    type: Object,
    required: true
    },
  formatedPendingRewards: {
    type: Number,
    default: 0
  }
});
const claim = async () => {
  if (isClaiming.value || !props.wallet?.isConnected) return;
  
  try {
    isClaiming.value = true;
    txStatus.value = null;
    
    const tx = await props.wallet?.claimRewards();
    
    txStatus.value = {
      success: true,
      message: 'Rewards claimed successfully!',
      txHash: tx.hash
    };
    
    await props.wallet?.loadStakingData();
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
</script>