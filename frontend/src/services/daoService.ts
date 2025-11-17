import { BrowserProvider, Contract } from 'ethers';
import type { Signer } from 'ethers';
import { CONTRACTS } from '../config/contracts';
import { CTDAO_ABI } from '../config/abis';
import type { CreateProposalParams } from '../types/organization';

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

/**
 * Create a new proposal
 */
export async function createProposal(
  signer: Signer,
  params: CreateProposalParams
): Promise<any> {
  const daoContract = new Contract(CONTRACTS.DAO, CTDAO_ABI, signer);
  
  return await daoContract.createProposal(
    params.description,
    params.budget,
    params.beneficiary,
    params.approver
  );
}

/**
 * Get proposal count
 */
export async function getProposalCount(provider: BrowserProvider): Promise<bigint> {
  const daoContract = new Contract(CONTRACTS.DAO, CTDAO_ABI, provider);
  return await daoContract.proposalCount();
}

/**
 * Get all proposals
 */
export async function getAllProposals(provider: BrowserProvider) {
  const daoContract = new Contract(CONTRACTS.DAO, CTDAO_ABI, provider);
  const count = await daoContract.proposalCount();
  
  const proposals = [];
  for (let i = 0; i < Number(count); i++) {
    const proposal = await daoContract.proposals(i);
    proposals.push({
      id: i,
      description: proposal.description,
      budget: proposal.budget,
      beneficiary: proposal.beneficiary,
      approver: proposal.approver,
      votes: proposal.votes,
      executed: proposal.executed,
    });
  }
  
  return proposals;
}

/**
 * Vote on a proposal
 */
export async function voteOnProposal(signer: Signer, proposalId: number): Promise<any> {
  const daoContract = new Contract(CONTRACTS.DAO, CTDAO_ABI, signer);
  return await daoContract.vote(proposalId);
}

/**
 * Execute a proposal
 */
export async function executeProposal(signer: Signer, proposalId: number): Promise<any> {
  const daoContract = new Contract(CONTRACTS.DAO, CTDAO_ABI, signer);
  return await daoContract.executeProposal(proposalId);
}

