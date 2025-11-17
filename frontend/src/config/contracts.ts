/**
 * Smart Contract Configuration
 * Moonbase Alpha Testnet Addresses
 */

export const CONTRACTS = {
  TOKEN: '0x86657f4c3E85fcE82E17FABfddEcc6C65E854e69',
  TREASURY: '0x499C6cC024d91D3cc497D4197d41b24122c6BFf9',
  DAO: '0x718c18F91ECB572d6ec96bf2d0F2573DaA8a2C50',
} as const;

export const NETWORK = {
  chainId: 1287, // Moonbase Alpha
  chainName: 'Moonbase Alpha',
  nativeCurrency: {
    name: 'DEV',
    symbol: 'DEV',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
  blockExplorerUrls: ['https://moonbase.moonscan.io/'],
} as const;

/**
 * Hardcoded Tree Planter Address for POC
 * TODO: Replace with proper tree planter registration system
 */
export const HARDCODED_TREE_PLANTER = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

