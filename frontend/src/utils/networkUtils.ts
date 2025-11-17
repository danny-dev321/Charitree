import { BrowserProvider } from 'ethers';
import type { Eip1193Provider } from 'ethers';
import { NETWORK } from '../config/contracts';
import type { EVMProvider } from '../types/wallet';

/**
 * Switch to Moonbase Alpha network or add it if not present
 */
export async function switchToMoonbaseAlpha(ethProvider: EVMProvider): Promise<void> {
  try {
    await ethProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${NETWORK.chainId.toString(16)}` }],
    });
  } catch (switchError: any) {
    // Error code 4902 means the chain hasn't been added yet
    if (switchError.code === 4902) {
      await addMoonbaseAlphaNetwork(ethProvider);
    } else {
      throw switchError;
    }
  }
}

/**
 * Add Moonbase Alpha network to wallet
 */
async function addMoonbaseAlphaNetwork(ethProvider: EVMProvider): Promise<void> {
  await ethProvider.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: `0x${NETWORK.chainId.toString(16)}`,
        chainName: NETWORK.chainName,
        nativeCurrency: NETWORK.nativeCurrency,
        rpcUrls: NETWORK.rpcUrls,
        blockExplorerUrls: NETWORK.blockExplorerUrls,
      },
    ],
  });
}

/**
 * Check if currently on Moonbase Alpha network
 */
export async function isOnMoonbaseAlpha(provider: BrowserProvider): Promise<boolean> {
  const network = await provider.getNetwork();
  return Number(network.chainId) === NETWORK.chainId;
}

/**
 * Request account access from wallet
 */
export async function requestAccounts(ethProvider: EVMProvider): Promise<void> {
  await ethProvider.request({ method: 'eth_requestAccounts' });
}

/**
 * Create ethers BrowserProvider from EVM provider
 */
export function createWeb3Provider(ethProvider: EVMProvider): BrowserProvider {
  return new BrowserProvider(ethProvider as Eip1193Provider);
}

