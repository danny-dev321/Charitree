import hre from "hardhat";

// ============================================
// CONTRACT ADDRESSES - UPDATE AFTER DEPLOYMENT
// ============================================
const TOKEN_ADDRESS = '0x86657f4c3E85fcE82E17FABfddEcc6C65E854e69'; // Moonbase
const TREASURY_ADDRESS = '0x499C6cC024d91D3cc497D4197d41b24122c6BFf9'; // Moonbase
const DAO_ADDRESS = '0x718c18F91ECB572d6ec96bf2d0F2573DaA8a2C50'; // Moonbase

async function main() {
  // Get ethers from the network connection
  const connection = await hre.network.connect();
  const ethers = connection.ethers;

  // Get the signer
  const [signer] = await ethers.getSigners();
  console.log(`Checking status for account: ${signer.address}\n`);

  // Create contract instances
  const CTToken = await ethers.getContractFactory('CTToken');
  const CTTreasury = await ethers.getContractFactory('CTTreasury');
  const CTDAO = await ethers.getContractFactory('CTDAO');

  const token = await CTToken.attach(TOKEN_ADDRESS);
  const treasury = await CTTreasury.attach(TREASURY_ADDRESS);
  const dao = await CTDAO.attach(DAO_ADDRESS);

  // ===== TOKEN INFO =====
  console.log('═══════════════════════════════════════');
  console.log('CTToken Information');
  console.log('═══════════════════════════════════════');
  console.log(`Contract Address: ${TOKEN_ADDRESS}`);
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
  console.log(`Contract Address: ${TREASURY_ADDRESS}`);
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
  console.log(`Contract Address: ${DAO_ADDRESS}`);
  const isMember = await dao.members(signer.address);
  console.log(`You are a DAO member: ${isMember ? 'YES ✓' : 'NO ✗'}`);
  const memberNr = await dao.memberNr();
  console.log(`Total Members: ${memberNr}`);
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
      console.log(`  Approver: ${proposal.approver}`);
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

