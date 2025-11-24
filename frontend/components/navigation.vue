<template>
  <div>
    <nav class="bg-hive-dark text-white shadow-lg fixed w-full z-10">
      <!-- Mobile Menu Button (Hamburger) -->
      <div
        class="container mx-auto px-4 py-3 flex justify-between items-center md:hidden"
      >
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <svg
            class="w-8 h-8 text-hive-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          <span class="text-xl font-bold">StakeHive</span>
        </NuxtLink>

        <button @click="toggleMobileMenu" class="p-2 focus:outline-none">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Desktop & Mobile Menu -->
      <div class="container mx-auto px-4">
        <div
          :class="{
            hidden: !mobileMenuOpen,
            'md:flex': true,
            'md:items-center': true,
            'md:justify-between': true,
            'py-3': true,
          }"
        >
          <!-- Left Side - Logo & Links -->
          <div class="flex items-center space-x-2">
            <NuxtLink to="/" class="hidden md:flex items-center space-x-2">
              <svg
                class="w-8 h-8 text-hive-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              <span class="text-xl font-bold">StakeHive</span>
            </NuxtLink>

            <div class="hidden md:flex space-x-1 ml-10">
              <NuxtLink
                to="/"
                class="px-3 py-2 rounded-md text-sm font-medium hover:bg-hive-dark-light"
                >Dashboard</NuxtLink
              >
              <!-- <NuxtLink to="/stake" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-hive-dark-light">Stake</NuxtLink>
            <NuxtLink to="/rewards" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-hive-dark-light">Rewards</NuxtLink>
            <NuxtLink to="/docs" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-hive-dark-light">Docs</NuxtLink> -->
            </div>
          </div>

          <!-- Right Side - Wallet & Network -->
          <div class="flex items-center space-x-4">
            <div
              class="hidden md:block px-3 py-1 bg-hive-dark-light rounded-full text-xs"
            >
              <span class="text-hive-accent">●</span>
              <span>Sepolia</span>
            </div>
            <ButtonComponent
              displayMode="wallet"
              variant="primary"
              :showIcon="true"
              @click="handleConnect"
              :account="wallet.account"
            />
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu Dropdown -->
    <div
      :class="{
        hidden: !mobileMenuOpen,
        'md:hidden': true,
        'bg-hive-dark-light': true,
      }"
    >
      <div class="px-3 py-4 border-t border-hive-dark">
        <div class="flex items-center justify-between">
          <span class="text-sm"
            >Network: <span class="text-hive-accent">Sepoliad</span></span
          >
          <button class="text-hive-primary text-sm font-medium">Switch</button>
          <ButtonComponent
            displayMode="wallet"
            variant="primary"
            :showIcon="true"
            @click="handleConnect"
            :account="wallet.account"
          />
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div
      v-if="showMetaMaskPrompt"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <h2 class="text-xl font-semibold mb-4">MetaMask Not Detected</h2>
        <p class="mb-4 text-gray-600">
          To use this app, you need to install the MetaMask extension in your
          browser.
        </p>
        <div class="flex justify-end space-x-3">
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Install MetaMask
          </a>
          <button
            @click="showMetaMaskPrompt = false"
            class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ButtonComponent from "@/components/buttonComponent.vue";
import { ref } from "vue";
// Import composable
import { useWalletStore } from "@/stores/walletStore";
const wallet = useWalletStore();
// Mobile menu state
const mobileMenuOpen = ref(false);
const errorMessage = ref(null);
const showMetaMaskPrompt = ref(false);

const handleConnect = async () => {
  if (!wallet.isMetaMaskInstalled()) {
    showMetaMaskPrompt.value = true;
    return;
  } else {
    try {
      const account = await wallet.connectWallet();
      console.log("Connected to:", wallet.account);
      errorMessage.value = null;
    } catch (err) {
      errorMessage.value = err.message;
    }
  }
};
// Toggle mobile menu
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

// Shorten wallet address for display
const shortenAddress = (addr) => {
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};
</script>

<style>
/* Hive color palette */
:root {
  --hive-dark: #1a202c;
  --hive-dark-light: #2d3748;
  --hive-primary: #4f46e5;
  --hive-primary-dark: #4338ca;
  --hive-accent: #10b981;
}

.bg-hive-dark {
  background-color: var(--hive-dark);
}
.bg-hive-dark-light {
  background-color: var(--hive-dark-light);
}
.bg-hive-primary {
  background-color: var(--hive-primary);
}
.bg-hive-primary-dark {
  background-color: var(--hive-primary-dark);
}
.text-hive-primary {
  color: var(--hive-primary);
}
.text-hive-accent {
  color: var(--hive-accent);
}
.hover\:bg-hive-dark-light:hover {
  background-color: var(--hive-dark-light);
}
.hover\:bg-hive-dark:hover {
  background-color: var(--hive-dark);
}
.border-hive-dark {
  border-color: var(--hive-dark);
}
</style>
