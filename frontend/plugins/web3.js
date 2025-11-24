// plugins/web3.client.js (note .client.js for client-side only)
import { ethers } from 'ethers';

export default defineNuxtPlugin(() => {
  // Initialize provider as null for SSR safety
  let provider = null;
  let signer = null;

  // Client-side only initialization
  if (process.client && window.ethereum) {
    try {
      // Create provider
      provider = new ethers.BrowserProvider(window.ethereum);
      
      // Optional: Initialize signer right away
      const initSigner = async () => {
        signer = await provider.getSigner();
      };
      initSigner();

      // Handle chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

    } catch (error) {
      console.error('Error initializing Web3 provider:', error);
    }
  }

  return {
    provide: {
      web3Provider: {
        provider,       // The BrowserProvider instance
        ethers,         // Ethers library
        getSigner: () => signer || provider?.getSigner() // Safe signer access
      }
    }
  };
});