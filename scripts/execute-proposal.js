import hre from "hardhat";

async function main() {
  // Get ethers from the network connection
  const connection = await hre.network.connect();
  const ethers = connection.ethers;

  // Get the signer (should be a DAO member)
  const [signer] = await ethers.getSigners();
  console.log(`Executing proposal from account: ${signer.address}`);

  // Create instance of the CTDAO contract
  const CTDAO = await ethers.getContractFactory('CTDAO');

  // Connect to the deployed contract (replace with your deployed address)
  const daoAddress = '0x718c18F91ECB572d6ec96bf2d0F2573DaA8a2C50'; // Moonbase address - NEW
  const dao = await CTDAO.attach(daoAddress);

  // Check if the signer is a DAO member
  const isMember = await dao.members(signer.address);
  if (!isMember) {
    console.error('Error: You are not a DAO member!');
    process.exit(1);
  }

  // Proposal ID to execute (you can change this)
  const proposalId = 0; // Execute the first proposal
  
  // Get proposal details
  const proposal = await dao.proposals(proposalId);
  const memberNr = await dao.memberNr();
  
  console.log('\nProposal Details:');
  console.log(`- ID: ${proposalId}`);
  console.log(`- Description: ${proposal.description}`);
  console.log(`- Budget: ${ethers.formatEther(proposal.budget)} DEV`);
  console.log(`- Votes: ${proposal.votes} / ${memberNr} required`);
  console.log(`- Executed: ${proposal.executed}`);

  // Check if proposal can be executed
  if (proposal.executed) {
    console.error('Error: Proposal has already been executed!');
    process.exit(1);
  }

  if (proposal.votes < memberNr) {
    console.error(`Error: Not enough votes! Needs ${memberNr - proposal.votes} more vote(s).`);
    process.exit(1);
  }

  // Get treasury balance to check if there's enough budget
  const treasuryAddress = await dao.cTTreasuryAddress();
  const CTTreasury = await ethers.getContractFactory('CTTreasury');
  const treasury = await CTTreasury.attach(treasuryAddress);
  const treasuryBalance = await treasury.getBalance();
  
  console.log(`\nTreasury Balance: ${ethers.formatEther(treasuryBalance)} DEV`);
  
  if (treasuryBalance < proposal.budget) {
    console.error('Error: Treasury does not have enough funds for this project!');
    process.exit(1);
  }

  console.log('\nExecuting proposal...');
  
  // Execute the proposal
  const tx = await dao.executeProposal(proposalId);
  
  // Wait for transaction to be mined
  console.log('Waiting for transaction confirmation...');
  const receipt = await tx.wait();
  console.log('Transaction confirmed! Proposal executed successfully.');

  // Get updated proposal details
  const updatedProposal = await dao.proposals(proposalId);
  console.log(`\n✅ Proposal Status: ${updatedProposal.executed ? 'EXECUTED' : 'PENDING'}`);
  console.log('A new CTProject contract has been created for this charity project!');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

