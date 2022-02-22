import { task } from "hardhat/config";

task("mint", "Mint NFTs.")
  .addParam("contract", "The NFT contract address.")
  .addParam("quantity", "The number of NFT to be minted.")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;
    const { contract, quantity } = taskArgs;

    console.log("Minting NFTs...");
    const gentrees = await ethers.getContractAt("Gentrees", contract);
    const tx = await gentrees.mint(quantity, {
      value: ethers.utils.parseEther(process.env.MINT_PRICE!).mul(quantity),
    });
    await tx.wait();
    console.log("Done!");
  });
