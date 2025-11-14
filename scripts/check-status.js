import hre from "hardhat";

async function main() {
  // Get ethers from the network connection
  const connection = await hre.network.connect();
  const ethers = connection.ethers;

  // Get the signer
  const [signer] = await ethers.getSigners();
  console.log(`Checking status for account: ${signer.address}\n`);

  // Contract addresses (replace with your deployed addresses)
  const tokenAddress = '0x26da1019FdA9c138480b277aADFF34b09178e76B'; // Moonbase
  const treasuryAddress = '0x1a6176CdAC1744F4a6AF9ED35316790D33D01b4B'; // Moonbase
  const daoAddress = '0xD28195b340f83f25617DA505585F723E55D06639'; // Moonbase

  // Create contract instances
  const CTToken = await ethers.getContractFactory('CTToken');
  const CTTreasury = await ethers.getContractFactory('CTTreasury');
  const CTDAO = await ethers.getContractFactory('CTDAO');

  const token = await CTToken.attach(tokenAddress);
  const treasury = await CTTreasury.attach(treasuryAddress);
  const dao = await CTDAO.attach(daoAddress);

  // ===== TOKEN INFO =====
  console.log('═══════════════════════════════════════');
  console.log('CTToken Information');
  console.log('═══════════════════════════════════════');
  console.log(`Contract Address: ${tokenAddress}`);
  const tokenName = await token.name();
  const tokenSymbol = await token.symbol();
  console.log(`Token: ${tokenName} (${tokenSymbol})`);
  const myTokenBalance = await token.balanceOf(signer.address);
  console.log(`Your Balance: ${ethers.formatEther(myTokenBalance)} CTT`);
  const tokenOwner = await token.owner();
  console.log(`Owner: ${tokenOwner}`);

  // ===== TREASURY INFO =====
  console.log('\n═══════════════════════════════════════');
  console.log('CTTreasury Information');
  console.log('═══════════════════════════════════════');
  console.log(`Contract Address: ${treasuryAddress}`);
  const treasuryBalance = await treasury.getBalance();
  console.log(`Treasury Balance: ${ethers.formatEther(treasuryBalance)} DEV`);
  const exchangeRate = await treasury.exchangeRate();
  console.log(`Exchange Rate: ${ethers.formatEther(exchangeRate)} DEV per CTT`);
  const treasuryOwner = await treasury.owner();
  console.log(`Owner: ${treasuryOwner}`);
  const linkedDAO = await treasury.cDAOAddress();
  console.log(`Linked DAO: ${linkedDAO}`);

  // ===== DAO INFO =====
  console.log('\n═══════════════════════════════════════');
  console.log('CTDAO Information');
  console.log('═══════════════════════════════════════');
  console.log(`Contract Address: ${daoAddress}`);
  const isMember = await dao.members(signer.address);
  console.log(`You are a DAO member: ${isMember ? 'YES ✓' : 'NO ✗'}`);
  try {
    const memberNr = await dao.memberNr();
    console.log(`Total Members: ${memberNr}`);    
  } catch (error) {
    console.log(`memberNr is not public (or other error: ${error.message})`);    
  }

  const proposalCount = await dao.proposalCount();
  console.log(`Total Proposals: ${proposalCount}`);

  // List all proposals
  if (proposalCount > 0n) {
    console.log('\n─────────────────────────────────────');
    console.log('Proposals:');
    console.log('─────────────────────────────────────');
    
    for (let i = 0n; i < proposalCount; i++) {
      const proposal = await dao.proposals(i);
      console.log(`\nProposal #${i}:`);
      console.log(`  Description: ${proposal.description}`);
      console.log(`  Budget: ${ethers.formatEther(proposal.budget)} DEV`);
      console.log(`  Beneficiary: ${proposal.beneficiary}`);
      console.log(`  Votes: ${proposal.votes} / ${memberNr}`);
      console.log(`  Status: ${proposal.executed ? '✓ EXECUTED' : '⏳ PENDING'}`);
    }
  }

  console.log('\n═══════════════════════════════════════\n');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

