import type { TreePlanterOrganization } from '../types/organization';

/**
 * Mock Tree Planter Organizations for POC
 * TODO: Replace with proper registration system in production
 */

export const MOCK_ORGANIZATIONS: TreePlanterOrganization[] = [
  {
    id: 'org-001',
    name: 'Green Earth Initiative',
    description: 'A global NGO focused on reforestation and ecosystem restoration in tropical regions.',
    walletAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    website: 'https://greenearth.example',
    location: 'Amazon Rainforest, Brazil',
    verified: true,
    projectsCompleted: 12,
  },
  {
    id: 'org-002',
    name: 'Trees for Tomorrow',
    description: 'Community-driven tree planting projects across Southeast Asia.',
    walletAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    website: 'https://treesfortomorrow.example',
    location: 'Southeast Asia',
    verified: true,
    projectsCompleted: 8,
  },
  {
    id: 'org-003',
    name: 'African Forest Foundation',
    description: 'Combating desertification through massive tree planting initiatives in Sub-Saharan Africa.',
    walletAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    website: 'https://africanforest.example',
    location: 'Sub-Saharan Africa',
    verified: true,
    projectsCompleted: 15,
  },
];

/**
 * Default organization for POC (hardcoded)
 * This is the organization that will be used for proposal creation
 */
export const DEFAULT_ORGANIZATION = MOCK_ORGANIZATIONS[0];

/**
 * Get organization by wallet address
 */
export function getOrganizationByAddress(address: string): TreePlanterOrganization | undefined {
  return MOCK_ORGANIZATIONS.find(
    (org) => org.walletAddress.toLowerCase() === address.toLowerCase()
  );
}

/**
 * Get organization by ID
 */
export function getOrganizationById(id: string): TreePlanterOrganization | undefined {
  return MOCK_ORGANIZATIONS.find((org) => org.id === id);
}