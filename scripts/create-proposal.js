import hre from "hardhat";

async function main() {
  // Get ethers from the network connection
  const connection = await hre.network.connect();
  const ethers = connection.ethers;

  // Get the signer (should be a DAO member)
  const [signer] = await ethers.getSigners();
  console.log(`Creating proposal from account: ${signer.address}`);

  // Create instance of the CTDAO contract
  const CTDAO = await ethers.getContractFactory('CTDAO');

  // Connect to the deployed contract (replace with your deployed address)
  const daoAddress = '0xD28195b340f83f25617DA505585F723E55D06639'; // Moonbase address
  const dao = await CTDAO.attach(daoAddress);

  // Check if the signer is a DAO member
  const isMember = await dao.members(signer.address);
  if (!isMember) {
    console.error('Error: You are not a DAO member!');
    process.exit(1);
  }

  // Proposal details
  const description = 'Build a School in Rural Village';
  const budget = ethers.parseEther('5.0'); // 5 DEV
  const beneficiary = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Replace with actual beneficiary
  
  console.log('Creating proposal...');
  console.log(`Description: ${description}`);
  console.log(`Budget: ${ethers.formatEther(budget)} DEV`);
  console.log(`Beneficiary: ${beneficiary}`);
  
  // Create the proposal
  const tx = await dao.createProposal(description, budget, beneficiary);
  
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

