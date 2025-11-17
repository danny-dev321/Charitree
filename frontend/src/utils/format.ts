import { formatEther, parseEther } from 'ethers';

/**
 * Convert DEV to mDEV (1 DEV = 1000 mDEV)
 * @param devAmount Amount in DEV (wei)
 * @returns Amount in mDEV as a number
 */
export function devToMDev(devAmount: bigint | string): number {
  const devString = typeof devAmount === 'string' ? devAmount : devAmount.toString();
  const devNum = parseFloat(formatEther(devString));
  return devNum * 1000;
}

/**
 * Convert mDEV to DEV (wei)
 * @param mdevAmount Amount in mDEV
 * @returns Amount in wei (bigint)
 */
export function mdevToDev(mdevAmount: number): bigint {
  const devAmount = mdevAmount / 1000;
  return parseEther(devAmount.toString());
}

/**
 * Format mDEV for display
 * @param mdevAmount Amount in mDEV
 * @returns Formatted string with mDEV suffix
 */
export function formatMDev(mdevAmount: number): string {
  return `${mdevAmount.toFixed(2)} mDEV`;
}

/**
 * Format address for display (0x1234...5678)
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

