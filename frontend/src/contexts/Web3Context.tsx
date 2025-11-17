import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { BrowserProvider } from 'ethers';
import type { WalletType } from '../types/wallet';
import { useWalletDetection } from '../hooks/useWalletDetection';
import { getWalletProvider, setupWalletEventListeners } from '../services/walletService';
import { checkDAOMembership } from '../services/daoService';
import {
  createWeb3Provider,
  requestAccounts,
  isOnMoonbaseAlpha,
  switchToMoonbaseAlpha,
} from '../utils/networkUtils';
import {
  saveWalletPreference,
  getSavedWalletPreference,
  clearWalletPreference,
} from '../utils/walletStorage';

interface Web3ContextType {
  // Connection state
  provider: BrowserProvider | null;
  signer: any | null;
  account: string | null;
  isConnected: boolean;
  isDAOMember: boolean;
  isConnecting: boolean;
  error: string | null;

  // Available wallets
  availableWallets: ReturnType<typeof useWalletDetection>;
  selectedWallet: string | null;

  // Actions
  connectWallet: (walletType: WalletType) => Promise<void>;
  disconnect: () => void;
  refreshDAOMembership: () => Promise<boolean>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  // State
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<any | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isDAOMember, setIsDAOMember] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  // Detect available wallets
  const availableWallets = useWalletDetection();

  // Refresh DAO membership status
  const refreshDAOMembership = useCallback(async (): Promise<boolean> => {
    if (!provider || !account) return false;

    const isMember = await checkDAOMembership(provider, account);
    setIsDAOMember(isMember);
    return isMember;
  }, [provider, account]);

  // Connect to wallet
  const connectWallet = async (walletType: WalletType) => {
    setIsConnecting(true);
    setError(null);

    try {
      // Get the wallet provider
      const { provider: ethProvider, name } = getWalletProvider(walletType);

      // Request account access FIRST
      await requestAccounts(ethProvider);

      // Create a temporary provider to check network
      const tempProvider = createWeb3Provider(ethProvider);
      const onCorrectNetwork = await isOnMoonbaseAlpha(tempProvider);
      
      // Switch network if needed BEFORE creating the final provider
      if (!onCorrectNetwork) {
        await switchToMoonbaseAlpha(ethProvider);
        // Wait a moment for the network switch to complete
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // NOW create the Web3 provider after network is confirmed correct
      const web3Provider = createWeb3Provider(ethProvider);

      // Get signer and address
      const signer = await web3Provider.getSigner();
      const address = await signer.getAddress();

      // Update state
      setProvider(web3Provider);
      setSigner(signer);
      setAccount(address);
      setSelectedWallet(name);

      // Save preference
      saveWalletPreference(walletType);

      console.log(`Connected to ${name}:`, address);
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setError(error.message || 'Failed to connect wallet');
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setIsDAOMember(false);
    setSelectedWallet(null);
    setError(null);
    clearWalletPreference();
    console.log('Wallet disconnected');
  }, []);

  // Check DAO membership when account/provider changes
  useEffect(() => {
    if (account && provider) {
      refreshDAOMembership();
    }
  }, [account, provider, refreshDAOMembership]);

  // Setup wallet event listeners
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== account) {
        // Reconnect with the same wallet type
        const savedWallet = getSavedWalletPreference();
        if (savedWallet) {
          connectWallet(savedWallet).catch(console.error);
        }
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    const handleDisconnect = () => {
      disconnect();
    };

    const cleanup = setupWalletEventListeners(
      handleAccountsChanged,
      handleChainChanged,
      handleDisconnect
    );

    return cleanup;
  }, [account, disconnect]);

  // Auto-reconnect on page load if previously connected
  useEffect(() => {
    const savedWallet = getSavedWalletPreference();
    if (savedWallet && availableWallets.length > 0 && !account) {
      connectWallet(savedWallet).catch((err) => {
        console.error('Auto-reconnect failed:', err);
        // Clear the saved preference if auto-reconnect fails
        clearWalletPreference();
      });
    }
  }, [availableWallets, account]);

  const value = {
    provider,
    signer,
    account,
    isConnected: !!account,
    isDAOMember,
    isConnecting,
    error,
    availableWallets,
    selectedWallet,
    connectWallet,
    disconnect,
    refreshDAOMembership,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
