import hre from "hardhat";

async function main() {
  // Get ethers from the network connection
  const connection = await hre.network.connect();
  const ethers = connection.ethers;

  // Get the signer (deployer account)
  const [signer] = await ethers.getSigners();
  console.log(`Donating from account: ${signer.address}`);

  // Create instance of the CTTreasury contract
  const CTTreasury = await ethers.getContractFactory('CTTreasury');

  // Connect to the deployed contract (replace with your deployed address)
  const treasuryAddress = '0x1a6176CdAC1744F4a6AF9ED35316790D33D01b4B'; // Moonbase address
  const treasury = await CTTreasury.attach(treasuryAddress);

  // Donation amount (1 DEV token)
  const donationAmount = ethers.parseEther('0.1');
  
  console.log(`Donating ${ethers.formatEther(donationAmount)} DEV to the treasury...`);
  
  // Make a donation
  const tx = await treasury.donate({ value: donationAmount });
  
  // Wait for transaction to be mined
  console.log('Waiting for transaction confirmation...');
  await tx.wait();
  console.log('Transaction confirmed!');

  // Check treasury balance
  const balance = await treasury.getBalance();
  console.log(`Treasury balance: ${ethers.formatEther(balance)} DEV`);

  // Check how many CTT tokens the donor received
  const CTToken = await ethers.getContractFactory('CTToken');
  const tokenAddress = await treasury.cTokenAddress();
  const token = await CTToken.attach(tokenAddress);
  const tokenBalance = await token.balanceOf(signer.address);
  console.log(`Your CTT token balance: ${ethers.formatEther(tokenBalance)} CTT`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

