import type { WalletType, EVMProvider } from '../types/wallet';

/**
 * Get the appropriate wallet provider based on wallet type
 */
export function getWalletProvider(walletType: WalletType): {
  provider: EVMProvider;
  name: string;
} {
  switch (walletType) {
    case 'metamask':
      if (!window.ethereum?.isMetaMask) {
        throw new Error(
          'MetaMask is not installed. Please install it from https://metamask.io'
        );
      }
      return { provider: window.ethereum, name: 'MetaMask' };

    case 'talisman':
      if (!window.talismanEth) {
        throw new Error(
          'Talisman is not installed. Please install it from https://talisman.xyz'
        );
      }
      return { provider: window.talismanEth, name: 'Talisman' };

    case 'injected':
      if (!window.ethereum) {
        throw new Error('No wallet detected. Please install MetaMask or Talisman.');
      }
      return { provider: window.ethereum, name: 'Injected Wallet' };

    default:
      throw new Error('Unsupported wallet type');
  }
}

/**
 * Setup event listeners for wallet events
 */
export function setupWalletEventListeners(
  onAccountsChanged: (accounts: string[]) => void,
  onChainChanged: () => void,
  onDisconnect: () => void
): () => void {
  if (typeof window.ethereum === 'undefined') {
    return () => {}; // No cleanup needed
  }

  window.ethereum.on('accountsChanged', onAccountsChanged);
  window.ethereum.on('chainChanged', onChainChanged);
  window.ethereum.on('disconnect', onDisconnect);

  // Return cleanup function
  return () => {
    window.ethereum?.removeListener('accountsChanged', onAccountsChanged);
    window.ethereum?.removeListener('chainChanged', onChainChanged);
    window.ethereum?.removeListener('disconnect', onDisconnect);
  };
}

