const hre = require("hardhat");

async function main() {

  const baseUrl = "ipfs://QmdMVVSzy2zALppnMPcDEH9mTwys2zJpJDHdpYqGe3YKdW";
  const DGITokenAddress = "0xeb0C4Dc6359D520a4e66F9FED394D5af4e701de0";
  
  const DoggerNFT = await hre.ethers.getContractFactory("DoggerNFT");
  const Dogger = await DoggerNFT.deploy(baseUrl, DGITokenAddress);

  await Dogger.deployed();

  console.log(
    `DogerPups NFTs contract deployed to ${Dogger.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
