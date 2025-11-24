<template>
 <button 
            @click = "$emit('click')"
 :class="[
      'flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
      {
        'bg-hive-primary hover:bg-hive-primary-dark text-white': variant === 'primary',
        'bg-hive-accent hover:bg-hive-accent-dark text-white': variant === 'accent',
        'bg-gray-200 hover:bg-gray-300 text-gray-800': variant === 'secondary'
      }
    ]"            
  >
         <slot name="icon">
      <svg 
        v-if="showIcon"
        class="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    </slot>
            <!-- Dynamic Content -->
             
            <span v-if ="!$slots.default">
              <template v-if="displayMode === 'wallet'">
                {{ account ? shortenAddress(account) : 'Connect Wallet' }}
              </template>
              <template v-else-if="displayMode === 'text'">
                <span class="text-hive-accent">●</span> 
                <span>{{ networkName }}</span>
              </template>
              <template v-else-if="displayMode === 'custom'">
                {{ dynamicContent }}
              </template>
            </span>

           </button>
 </template>
 <script setup>
import { computed } from 'vue'
const props = defineProps({
  variant: {
    type: String,
    default: 'primary', // 'primary' | 'accent' | 'secondary'
    validator: (value) => ['primary', 'accent', 'secondary'].includes(value)
  },
  // Display Modes
  displayMode: {
      type: String,
      default: 'wallet',
      validator: (value) => ['wallet', 'text', 'custom'].includes(value)
    },
   account: {
      type: String,
      default: ''
    },
  defaultText: {
    type: String,
    default: 'Connect Wallet'
  },
  networkName: {
    type: String,
    default: 'Sepolia'
  },
  dynamicContent: [String, Number],
  //Icon Options
   variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'accent', 'secondary'].includes(value)
    },
    showIcon: {
      type: Boolean,
      default: false
    },
})
// Convert addr to string explicitly (safe even if already a string)
const shortenAddress = (addr) => {
  const addressStr = String(addr || ''); // Force string conversion
  return addressStr 
    ? `${addressStr.substring(0, 6)}...${addressStr.substring(addressStr.length - 4)}`
    : '';
};
</script>
  
 


