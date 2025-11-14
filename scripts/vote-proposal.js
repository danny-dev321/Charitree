import hre from "hardhat";

// ============================================
// CONTRACT ADDRESSES - UPDATE AFTER DEPLOYMENT
// ============================================
const DAO_ADDRESS = '0x718c18F91ECB572d6ec96bf2d0F2573DaA8a2C50'; // Moonbase

// ============================================
// VOTING PARAMETERS - CUSTOMIZE AS NEEDED
// ============================================
const PROPOSAL_ID = 0; // Which proposal to vote on

async function main() {
  // Get ethers from the network connection
  const connection = await hre.network.connect();
  const ethers = connection.ethers;

  // Get the signer (should be a DAO member)
  const [signer] = await ethers.getSigners();
  console.log(`Voting from account: ${signer.address}`);

  // Create instance of the CTDAO contract
  const CTDAO = await ethers.getContractFactory('CTDAO');
  const dao = await CTDAO.attach(DAO_ADDRESS);

  // Check if the signer is a DAO member
  const isMember = await dao.members(signer.address);
  if (!isMember) {
    console.error('Error: You are not a DAO member!');
    process.exit(1);
  }

  // Proposal ID to vote on (from constant at top of file)
  const proposalId = PROPOSAL_ID;
  
  // Get proposal details before voting
  const proposal = await dao.proposals(proposalId);
  console.log('\nProposal Details:');
  console.log(`- ID: ${proposalId}`);
  console.log(`- Description: ${proposal.description}`);
  console.log(`- Budget: ${ethers.formatEther(proposal.budget)} DEV`);
  console.log(`- Beneficiary: ${proposal.beneficiary}`);
  console.log(`- Approver: ${proposal.approver}`);
  console.log(`- Current Votes: ${proposal.votes}`);
  console.log(`- Executed: ${proposal.executed}`);

  if (proposal.executed) {
    console.error('Error: Proposal has already been executed!');
    process.exit(1);
  }

  console.log('\nCasting vote...');
  
  // Vote on the proposal
  const tx = await dao.vote(proposalId);
  
  // Wait for transaction to be mined
  console.log('Waiting for transaction confirmation...');
  await tx.wait();
  console.log('Transaction confirmed! Vote cast successfully.');

  // Get updated proposal details
  const updatedProposal = await dao.proposals(proposalId);
  console.log(`\nUpdated Votes: ${updatedProposal.votes}`);
  
  // Check if proposal has enough votes to execute
  try {
    const memberNr = await dao.memberNr();
    console.log(`Total DAO Members: ${memberNr}`);
    
    if (updatedProposal.votes >= memberNr) {
      console.log('\n✅ Proposal has enough votes to be executed!');
    } else {
      console.log(`\n⏳ Proposal needs ${memberNr - updatedProposal.votes} more vote(s) to be executed.`);
    }
  } catch (error) {
    console.log('\nNote: memberNr is not accessible (contract needs redeployment with public memberNr)');
    console.log('✅ Vote was successfully cast! Check execution requirements manually.');
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

