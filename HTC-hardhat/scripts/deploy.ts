import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const HotelToken = await ethers.getContractFactory("HotelToken");
  const token = await HotelToken.deploy();
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("HotelToken (HTC) deployed to:", address);

  // Mint 10000 HTC to deployer wallet to start with
  const mintTx = await token.mint(deployer.address, ethers.parseEther("10000"));
  await mintTx.wait();
  console.log("Minted 10000 HTC to:", deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
