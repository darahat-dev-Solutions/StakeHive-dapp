<template>
         <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex items-center space-x-4">
            <div class="p-3 rounded-lg bg-yellow-50">
              <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">{{ cardNameData }}</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{  cardValueData }} <span class="text-gray-500 text-lg">{{ tokenNameData }}</span>
              </p>
            </div>
          </div>
        </div>
</template>
<script setup>
import { computed } from 'vue';
// Import composable
import { useWalletStore } from '@/stores/walletStore';
const wallet = useWalletStore();
const props = defineProps({
    cardNameData: {
        type: String,
        default: '',
        required: true,
    },
    cardValueData: {
        type: Number,
        default: 0,
        required: true,
    },
    cardIconData: {
        type: String,
        default: '',
        required: true,
    },
    tokenNameData: {
        type: String,
        default: 'HIVE',
        required: true,
    }
})

</script>