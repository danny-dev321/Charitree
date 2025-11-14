import hre from "hardhat";

// ============================================
// CONTRACT ADDRESSES - UPDATE AFTER DEPLOYMENT
// ============================================
const DAO_ADDRESS = '0x718c18F91ECB572d6ec96bf2d0F2573DaA8a2C50'; // Moonbase

// ============================================
// PROPOSAL PARAMETERS - CUSTOMIZE AS NEEDED
// ============================================
const PROPOSAL_DESCRIPTION = 'Build a School in Rural Village';
const PROPOSAL_BUDGET_DEV = '5.0'; // In DEV tokens
const BENEFICIARY_ADDRESS = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Replace with actual beneficiary

async function main() {
  // Get ethers from the network connection
  const connection = await hre.network.connect();
  const ethers = connection.ethers;

  // Get the signer (should be a DAO member)
  const [signer] = await ethers.getSigners();
  console.log(`Creating proposal from account: ${signer.address}`);

  // Create instance of the CTDAO contract
  const CTDAO = await ethers.getContractFactory('CTDAO');
  const dao = await CTDAO.attach(DAO_ADDRESS);

  // Check if the signer is a DAO member
  const isMember = await dao.members(signer.address);
  if (!isMember) {
    console.error('Error: You are not a DAO member!');
    process.exit(1);
  }

  // Proposal details (from constants at top of file)
  const description = PROPOSAL_DESCRIPTION;
  const budget = ethers.parseEther(PROPOSAL_BUDGET_DEV);
  const beneficiary = BENEFICIARY_ADDRESS;
  const approver = signer.address; // The person who will approve fund release (usually project manager or DAO member)
  
  console.log('Creating proposal...');
  console.log(`Description: ${description}`);
  console.log(`Budget: ${ethers.formatEther(budget)} DEV`);
  console.log(`Beneficiary: ${beneficiary}`);
  console.log(`Approver: ${approver}`);
  
  // Create the proposal (requires 4 parameters)
  const tx = await dao.createProposal(description, budget, beneficiary, approver);
  
  // Wait for transaction to be mined
  console.log('Waiting for transaction confirmation...');
  const receipt = await tx.wait();
  console.log('Transaction confirmed!');

  // Get the proposal ID from the event
  const proposalCount = await dao.proposalCount();
  const proposalId = proposalCount - 1n;
  console.log(`Proposal created with ID: ${proposalId}`);

  // Retrieve proposal details
  const proposal = await dao.proposals(proposalId);
  console.log('\nProposal Details:');
  console.log(`- ID: ${proposalId}`);
  console.log(`- Description: ${proposal.description}`);
  console.log(`- Budget: ${ethers.formatEther(proposal.budget)} DEV`);
  console.log(`- Beneficiary: ${proposal.beneficiary}`);
  console.log(`- Votes: ${proposal.votes}`);
  console.log(`- Executed: ${proposal.executed}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

