// Wallet types for ChariTree

export interface WalletProvider {
  name: string;
  icon: string;
  installed: boolean;
  provider?: any;
}

export interface WalletState {
  isConnected: boolean;
  selectedWallet: string | null;
  account: string | null;
  isDAOMember: boolean;
  isConnecting: boolean;
  error: string | null;
}

export type WalletType = 'metamask' | 'talisman' | 'injected';

// EVM provider interface (MetaMask, Talisman EVM, etc.)
export interface EVMProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
  isMetaMask?: boolean;
  isTalisman?: boolean;
}

declare global {
  interface Window {
    ethereum?: any;
    talismanEth?: any;
  }
}

