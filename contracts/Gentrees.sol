// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Gentrees is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    string private baseURI;
    uint256 public collectionSize = 1000;
    uint256 public mintPrice = 10000000000000000;
    uint256 public maxNFTMint = 10;

    constructor(string memory baseURI_) public ERC721("Gentrees", "GT") {
        baseURI = baseURI_;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function mint(uint256 numberOfNFTs) public payable {
        require(numberOfNFTs > 0, "Cannot mint 0 NFTs");
        require(
            numberOfNFTs <= maxNFTMint,
            "Exceeded max number of NFTs that can be minted"
        );
        require(
            totalSupply() + numberOfNFTs <= collectionSize,
            "Mint would exceed max supply of NFTs"
        );
        require(mintPrice * numberOfNFTs == msg.value, "Incorrect mint value");

        for (uint256 i = 0; i < numberOfNFTs; i++) {
            uint256 mintIndex = totalSupply();
            _safeMint(msg.sender, mintIndex);
        }
    }

    function setMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        (bool sent, bytes memory data) = payable(msg.sender).call{
            value: balance
        }("");
        require(sent, "Failed to withdraw");
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
