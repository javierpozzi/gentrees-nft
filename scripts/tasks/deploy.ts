import { task } from "hardhat/config";

task("deploy", "Deploy NFT contract.")
  .addParam("metadatacid", "The IPFS CID of the metadata folder.")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;
    const { metadatacid } = taskArgs;

    console.log(`Deploying Gentrees contract to ${hre.network.name}...`);
    const Gentrees = await ethers.getContractFactory("Gentrees");

    const gentrees = await Gentrees.deploy(`ipfs://${metadatacid}/`);

    await gentrees.deployed();
    console.log("Gentrees deployed to:", gentrees.address);
  });
