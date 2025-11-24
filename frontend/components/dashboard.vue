<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
    <!-- Hero Section -->
    <header
      class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-bold mb-4">HIVE Staking Platform</h1>
        <p class="text-xl opacity-90 max-w-3xl mx-auto">
          Grow your HIVE tokens with secure staking and competitive rewards
        </p>
      </div>
    </header>

    <!-- Main Dashboard -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-10">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div
          class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500"
        >
          <h3 class="text-gray-500 text-sm font-medium">Available Balance</h3>
          <p class="text-2xl font-bold mt-2">
            {{ formatNumberShort(wallet.tokenBalance) }} HIVE
          </p>
        </div>
        <div
          class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
        >
          <h3 class="text-gray-500 text-sm font-medium">Staked Amount</h3>
          <p class="text-2xl font-bold mt-2">
            {{ formatNumberShort(wallet.stakedAmount) }} HIVE
          </p>
        </div>
        <div
          class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
        >
          <h3 class="text-gray-500 text-sm font-medium">Pending Rewards</h3>
          <p class="text-2xl font-bold mt-2">
            {{ formatNumberShort(wallet.pendingRewards) }} HIVE
          </p>
        </div>
      </div>

      <!-- Action Panels with Tabs -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm',
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>
        <div class="p-6">
          <div v-show="activeTab === 'stake'">
            <amountToStake
              :formatedtokenBalance="wallet.tokenBalance"
              :wallet="wallet"
            />
          </div>
          <div v-show="activeTab === 'transfer'">
            <transferHive
              :formatedtokenBalance="wallet.tokenBalance"
              :wallet="wallet"
            />
          </div>
          <div v-show="activeTab === 'withdraw'">
            <withdrawHive
              :formatedStakedAmount="wallet.stakedAmount"
              :wallet="wallet"
            />
          </div>
          <div v-show="activeTab === 'claim'">
            <claimReward
              :formatedPendingRewards="wallet.pendingRewards"
              :wallet="wallet"
            />
          </div>
        </div>
      </div>
      <!-- Stats/Charts Section -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <rewardChart :wallet="wallet" />
      </div>
    </main>
  </div>
</template>
<script setup>
import { useWalletStore } from "@/stores/walletStore";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const wallet = useWalletStore();
const txStatus = ref(null);
const tabs = [
  { id: "stake", name: "Stake Tokens" },
  { id: "transfer", name: "Transfer" },
  { id: "withdraw", name: "Withdraw" },
  { id: "claim", name: "Claim Rewards" },
];
const activeTab = ref("stake");

let intervalId;

// Auto-load when connected
watch(
  () => wallet.isConnected,
  (connected) => {
    if (connected) wallet.loadStakingData();
  },
  { immediate: true }
);
// Auto-refresh logic

onMounted(() => {
  // Initial fetch
  if (typeof window !== "undefined") {
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

function formatNumberShort(value) {
  const num = Number(value);
  if (isNaN(num)) return value;

  const absNum = Math.abs(num);
  //  if (absNum >= 1e27) return (num / 1e27).toFixed(2) + 'Oc'; // Octillion
  if (absNum >= 1e24) return (num / 1e24).toFixed(2) + "Sp"; // Septillion
  if (absNum >= 1e21) return (num / 1e21).toFixed(2) + "Sx"; // Sextillion
  if (absNum >= 1e18) return (num / 1e18).toFixed(2) + "Qi"; // Quintillion
  if (absNum >= 1e15) return (num / 1e15).toFixed(2) + "Qa"; // Quadrillion
  if (absNum >= 1e12) return (num / 1e12).toFixed(2) + "T"; // Trillion
  if (absNum >= 1e9) return (num / 1e9).toFixed(2) + "B"; // Billion
  if (absNum >= 1e6) return (num / 1e6).toFixed(2) + "M"; // Million
  if (absNum >= 1e3) return (num / 1e3).toFixed(2) + "K"; // Thousand

  return num.toFixed(2); // Optional: always show 2 decimals
}

// Auto-hide tx status after 5 seconds
watch(
  txStatus,
  (newVal) => {
    if (newVal) {
      setTimeout(() => {
        txStatus.value = null;
      }, 5000);
    }
  },
  { deep: true }
);
</script>
