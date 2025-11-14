import hre from "hardhat";

// ============================================
// CONTRACT ADDRESSES - UPDATE AFTER DEPLOYMENT
// ============================================
const DAO_ADDRESS = '0x718c18F91ECB572d6ec96bf2d0F2573DaA8a2C50'; // Moonbase

async function main() {
  // Get ethers from the network connection
  const connection = await hre.network.connect();
  const ethers = connection.ethers;

  // Get the signer
  const [signer] = await ethers.getSigners();
  console.log(`Checking DAO membership for: ${signer.address}\n`);

  // Create instance of the CTDAO contract
  const CTDAO = await ethers.getContractFactory('CTDAO');
  const dao = await CTDAO.attach(DAO_ADDRESS);

  console.log(`DAO Contract: ${DAO_ADDRESS}\n`);

  // Check membership
  const isMember = await dao.members(signer.address);
  console.log(`Is ${signer.address} a member? ${isMember}`);

  // Check memberNr
  const memberNr = await dao.memberNr();
  console.log(`Total members: ${memberNr}`);

  // Check treasury address
  const treasuryAddress = await dao.cTTreasuryAddress();
  console.log(`Linked Treasury: ${treasuryAddress}`);

  // Check proposal count
  const proposalCount = await dao.proposalCount();
  console.log(`Total Proposals: ${proposalCount}`);

  console.log('\n--- Suggested Fix ---');
  if (!isMember) {
    console.log('You are not a DAO member. This might be because:');
    console.log('1. The wrong address was used during deployment');
    console.log('2. The initialMembers parameter was not properly set');
    console.log('\nYou can verify the deployment parameters in:');
    console.log('  ignition/deployments/chain-1287/deployed_addresses.json');
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

