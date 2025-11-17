import { useState, useEffect } from 'react';
import type { WalletProvider } from '../types/wallet';

/**
 * Hook to detect available EVM wallets
 * Checks for MetaMask, Talisman, and generic injected wallets
 */
export function useWalletDetection() {
  const [availableWallets, setAvailableWallets] = useState<WalletProvider[]>([]);

  useEffect(() => {
    const detectWallets = () => {
      const wallets: WalletProvider[] = [];

      // Check for MetaMask
      if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
        wallets.push({
          name: 'MetaMask',
          icon: '🦊',
          installed: true,
          provider: window.ethereum,
        });
      }

      // Check for Talisman (EVM mode)
      if (typeof window.talismanEth !== 'undefined') {
        wallets.push({
          name: 'Talisman',
          icon: '🔮',
          installed: true,
          provider: window.talismanEth,
        });
      }

      // Check for generic injected provider (if not MetaMask or Talisman)
      if (
        typeof window.ethereum !== 'undefined' &&
        !window.ethereum.isMetaMask &&
        !window.ethereum.isTalisman &&
        wallets.length === 0
      ) {
        wallets.push({
          name: 'Injected Wallet',
          icon: '💼',
          installed: true,
          provider: window.ethereum,
        });
      }

      return wallets;
    };

    setAvailableWallets(detectWallets());
  }, []);

  return availableWallets;
}

