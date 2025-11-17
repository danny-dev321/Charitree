import { BrowserProvider, Contract } from 'ethers';
import { CONTRACTS } from '../config/contracts';

/**
 * Check if an address is a DAO member
 */
export async function checkDAOMembership(
  provider: BrowserProvider,
  address: string
): Promise<boolean> {
  try {
    const daoContract = new Contract(
      CONTRACTS.DAO,
      ['function members(address) view returns (bool)'],
      provider
    );

    const isMember = await daoContract.members(address);
    return isMember;
  } catch (error) {
    console.error('Error checking DAO membership:', error);
    return false;
  }
}

