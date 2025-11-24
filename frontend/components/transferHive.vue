<template>
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
  <h3 class="text-lg font-semibold text-gray-900 mb-6">Transfer HIVE</h3>
  <div class="space-y-4">
    <div>
      <label for="recipient-address" class="block text-sm font-medium text-gray-700 mb-2">Recipient Address</label>
      <input
        v-model="recipient"
        id="recipient-address"
        type="text"
        class="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        placeholder="0x..."
      >
    </div>
    
    <div>
      <label for="transfer-amount" class="block text-sm font-medium text-gray-700 mb-2">Amount to Transfer</label>
      <div class="relative rounded-md shadow-sm">
        <input
          v-model="amount"
          type="number"
          id="transfer-amount"
          class="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="0.0"
          min="0"
          :max="props.tokenBalance"
          step="any"
        >
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span class="text-gray-500 text-sm">HIVE</span>
        </div>
      </div>
      <div class="flex justify-between mt-2">
        <p class="text-xs text-gray-500">Available: {{ formatedtokenBalance }} HIVE</p>
        <button 
          @click="amount = wallet.tokenBalance"
          class="text-xs text-blue-600 hover:text-blue-800"
        >
          Max
        </button>
      </div>
    </div>
    
    <button
      @click="handleTransfer"
      :disabled="isTransferring || !wallet?.isConnected || !recipient || !amount || Number(amount) <= 0"
      class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-base font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
    >
      <svg v-if="isTransferring" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {{ isTransferring ? 'Processing...' : 'Transfer HIVE' }}
    </button>

    <div v-if="txHash" class="mt-4 p-3 bg-green-50 rounded-lg">
      <p class="text-sm text-green-800">
        Transfer successful! 
        <a :href="`https://etherscan.io/tx/${txHash}`" target="_blank" class="text-blue-600 hover:underline">
          View on Explorer
        </a>
      </p>
    </div>
  </div>
</div>
</template>
<script setup>
const isTransferring = ref(false);
 const recipient = ref('');
const amount = ref('');
const txHash = ref('');
const props = defineProps({
    wallet: {
        type: Object,
        required: true
    },
    formatedtokenBalance: {
        type: Number,
        default: 0
    }


});
async function handleTransfer() {
  const result = await props.wallet.transferHiveToken(recipient.value, amount.value);
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
</script>
<!-- 37.30K HIVE -->
 <!-- 0x23598b8f84Fe400303a517E5aFE7B6f9aEc3c28a -->