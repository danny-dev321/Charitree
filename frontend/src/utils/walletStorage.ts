import type { WalletType } from '../types/wallet';

const STORAGE_KEY = 'selectedWallet';

/**
 * Save selected wallet to localStorage
 */
export function saveWalletPreference(walletType: WalletType): void {
  localStorage.setItem(STORAGE_KEY, walletType);
}

/**
 * Get saved wallet preference from localStorage
 */
export function getSavedWalletPreference(): WalletType | null {
  return localStorage.getItem(STORAGE_KEY) as WalletType | null;
}

/**
 * Clear saved wallet preference from localStorage
 */
export function clearWalletPreference(): void {
  localStorage.removeItem(STORAGE_KEY);
}

