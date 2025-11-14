import hre from "hardhat";

async function main() {
  // Get ethers from the network connection
  const connection = await hre.network.connect();
  const ethers = connection.ethers;

  // Get the signer
  const [signer] = await ethers.getSigners();
  console.log(`Checking DAO membership for: ${signer.address}\n`);

  // Create instance of the CTDAO contract
  const CTDAO = await ethers.getContractFactory('CTDAO');

  // Connect to the deployed contract
  const daoAddress = '0x09E6431D1185e0fCB46EcbB3917B84492614C49f'; // Moonbase address
  const dao = await CTDAO.attach(daoAddress);

  console.log(`DAO Contract: ${daoAddress}\n`);

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

