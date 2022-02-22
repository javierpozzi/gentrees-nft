import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Gentrees } from "../typechain";

describe("Gentrees", function () {
  let gentreesContract: Gentrees;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let accounts: SignerWithAddress[];

  before(async () => {
    accounts = await ethers.getSigners();
    [owner, addr1] = accounts;
  });

  beforeEach(async function () {
    const Gentrees = await ethers.getContractFactory("Gentrees");
    gentreesContract = await Gentrees.deploy("ipfs://FAKE_URI/");
  });

  describe("Mint", function () {
    it("Should increase the balance of the minter after minting", async function () {
      const mintPrice = await gentreesContract.mintPrice();
      const balanceBeforeMint = await gentreesContract.balanceOf(addr1.address);
      await gentreesContract.connect(addr1).mint(1, {
        value: mintPrice,
      });
      const balanceAfterMint = await gentreesContract.balanceOf(addr1.address);
      expect(balanceAfterMint.sub(balanceBeforeMint)).to.be.equal(1);
    });

    it("Should mint multiple NFTs", async function () {
      const mintAmount = await gentreesContract.maxNFTMint();
      const mintPrice = await gentreesContract.mintPrice();
      const balanceBeforeMint = await gentreesContract.balanceOf(addr1.address);
      await gentreesContract.connect(addr1).mint(mintAmount, {
        value: mintPrice.mul(mintAmount),
      });
      const balanceAfterMint = await gentreesContract.balanceOf(addr1.address);
      expect(balanceAfterMint.sub(balanceBeforeMint)).to.be.equal(mintAmount);
    });

    it("Should not mint 0 NFTs", async function () {
      await expect(
        gentreesContract.connect(addr1).mint(0, {
          value: 0,
        })
      ).to.be.revertedWith("Cannot mint 0 NFTs");
    });

    it("Should not mint more NFTs that the maximum allowed", async function () {
      const mintPrice = await gentreesContract.mintPrice();
      const mintMaxAmount = await gentreesContract.maxNFTMint();
      const exceededAmount = mintMaxAmount.add(1);
      await expect(
        gentreesContract.connect(addr1).mint(exceededAmount, {
          value: mintPrice.mul(exceededAmount),
        })
      ).to.be.revertedWith("Exceeded max number of NFTs that can be minted");
    });

    it("Should not mint if the transaction value is incorrect", async function () {
      const mintPrice = await gentreesContract.mintPrice();
      const mintAmount = await gentreesContract.maxNFTMint();
      await expect(
        gentreesContract.connect(addr1).mint(mintAmount, {
          value: mintPrice.mul(mintAmount).add(1),
        })
      ).to.be.revertedWith("Incorrect mint value");
      await expect(
        gentreesContract.connect(addr1).mint(mintAmount, {
          value: mintPrice.mul(mintAmount).sub(1),
        })
      ).to.be.revertedWith("Incorrect mint value");
      await expect(
        gentreesContract.connect(addr1).mint(mintAmount, {
          value: 0,
        })
      ).to.be.revertedWith("Incorrect mint value");
    });
  });

  describe("Withdraw", function () {
    it("Should withdraw contract balance to owner", async function () {
      const mintPrice = await gentreesContract.mintPrice();
      await gentreesContract.connect(addr1).mint(1, {
        value: mintPrice,
      });
      const balanceBefore = await owner.getBalance();
      const tx = await gentreesContract.connect(owner).withdraw();
      const receipt = await tx.wait();
      const balanceAfter = await owner.getBalance();
      const gasCost = receipt.effectiveGasPrice.mul(receipt.gasUsed);

      expect(balanceAfter.add(gasCost)).to.be.equal(
        balanceBefore.add(mintPrice)
      );
    });
    it("Should revert if not owner", async function () {
      await expect(
        gentreesContract.connect(addr1).withdraw()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
