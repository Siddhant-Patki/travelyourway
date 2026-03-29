import { ethers } from "hardhat";

// Edit these values before running
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const RECIPIENT_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const AMOUNT = "2000"; // Amount of HTC to mint

async function main() {
  const [deployer] = await ethers.getSigners();

  const HotelToken = await ethers.getContractFactory("HotelToken");
  const token = HotelToken.attach(CONTRACT_ADDRESS);

  console.log(`Minting ${AMOUNT} HTC to ${RECIPIENT_ADDRESS}...`);
  const tx = await token.mint(RECIPIENT_ADDRESS, ethers.parseEther(AMOUNT));
  await tx.wait();

  console.log(`Done! Minted ${AMOUNT} HTC to ${RECIPIENT_ADDRESS}`);
  console.log(`Tx hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
