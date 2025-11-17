import { BrowserProvider, Contract } from 'ethers';
import type { Signer } from 'ethers';
import { CONTRACTS } from '../config/contracts';
import { CTTreasury_ABI, CTToken_ABI } from '../config/abis';

/**
 * Get treasury balance
 */
export async function getTreasuryBalance(provider: BrowserProvider): Promise<bigint> {
  const treasuryContract = new Contract(CONTRACTS.TREASURY, CTTreasury_ABI, provider);
  return await treasuryContract.getBalance();
}

/**
 * Get user's CTT token balance
 */
export async function getUserTokenBalance(
  provider: BrowserProvider,
  userAddress: string
): Promise<bigint> {
  const tokenContract = new Contract(CONTRACTS.TOKEN, CTToken_ABI, provider);
  return await tokenContract.balanceOf(userAddress);
}

/**
 * Get CTT token address from treasury
 */
export async function getTokenAddress(provider: BrowserProvider): Promise<string> {
  const treasuryContract = new Contract(CONTRACTS.TREASURY, CTTreasury_ABI, provider);
  return await treasuryContract.cTokenAddress();
}

/**
 * Donate DEV tokens to treasury
 */
export async function donate(signer: Signer, amount: bigint): Promise<any> {
  const treasuryContract = new Contract(CONTRACTS.TREASURY, CTTreasury_ABI, signer);
  return await treasuryContract.donate({ value: amount });
}

/**
 * Get exchange rate (DEV per CTT)
 */
export async function getExchangeRate(provider: BrowserProvider): Promise<bigint> {
  const treasuryContract = new Contract(CONTRACTS.TREASURY, CTTreasury_ABI, provider);
  return await treasuryContract.exchangeRate();
}

