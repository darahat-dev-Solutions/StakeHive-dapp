<template>
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Withdraw HIVE</h3>
            <div class="space-y-4">
              <div>
                <label for="withdraw-amount" class="block text-sm font-medium text-gray-700 mb-2">Amount to Withdraw</label>
                <div class="relative rounded-md shadow-sm">
                  <input
                    v-model="withdrawAmount"
                    type="number"
                    id="withdraw-amount"
                    class="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0.0"
                    min="0"
                    :max="wallet?.stakedAmount"
                    step="any"
                  >
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span class="text-gray-500 text-sm">HIVE</span>
                  </div>
                </div>
                <div class="flex justify-between mt-2">
                  <p class="text-xs text-gray-500">Staked: {{ formatedStakedAmount }} HIVE</p>
                  <button 
                    @click="withdrawAmount = wallet?.stakedAmount"
                    class="text-xs text-purple-600 hover:text-purple-800"
                  >
                    Max
                  </button>
                </div>
              </div>
              <button
                @click="withdraw"
                :disabled="isWithdrawing || !wallet?.isConnected || !withdrawAmount || Number(withdrawAmount) <= 0"
                class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-base font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                <svg v-if="isWithdrawing" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isWithdrawing ? 'Processing...' : 'Withdraw Tokens' }}
              </button>
            </div>
          </div>
</template>
<script setup>
import { ref } from 'vue';

const isWithdrawing = ref(false);
const txStatus = ref(null);
const withdrawAmount = ref('');
const props = defineProps({
  wallet: {
    type: Object,
    required: true
    },
  formatedStakedAmount: {
    type: Number,
    default: 0
  }
});

const withdraw  = async () => {
  if (!withdrawAmount.value || Number(withdrawAmount.value) <= 0) return;
  isWithdrawing.value = true;
  txStatus.value = null;
  try {
    const result = await props.wallet.withdraw(withdrawAmount.value);
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
</script>