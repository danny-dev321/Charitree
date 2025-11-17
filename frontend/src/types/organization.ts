/**
 * Tree Planter Organization Types
 */

export interface TreePlanterOrganization {
  id: string;
  name: string;
  description: string;
  walletAddress: string;
  website?: string;
  location: string;
  verified: boolean;
  projectsCompleted: number;
}

export interface Proposal {
  id: number;
  description: string;
  budget: bigint;
  budgetMDev: number;
  beneficiary: string;
  approver: string;
  votes: bigint;
  executed: boolean;
  organization?: TreePlanterOrganization;
}

export interface CreateProposalParams {
  description: string;
  budget: bigint;
  beneficiary: string;
  approver: string;
}

