const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Marketplace', function () {
  it('Should mint, list and sell an item on the marketplace', async function () {
    const Marketplace = await hre.ethers.getContractFactory('Marketplace');
    const marketplace = await Marketplace.deploy();
    await marketplace.deployed();

    const NFT = await hre.ethers.getContractFactory('NFT');
    const nft = await NFT.deploy(marketplace.address);
    await nft.deployed();

    // Minting item
    let tx = await nft.safeMint(
      'https://ipfs.io/ipfs/QmWXJXRdExse2YHRY21Wvh4pjRxNRQcWVhcKw4DLVnqGqs/747'
    );
    tx.wait();

    // List item in the marketplace
    let entranceFee = await marketplace.getEntranceFee();
    entranceFee = entranceFee.toString();

    let price = await marketplace.getMinimunListingPrice();
    price = price.toString();

    const tokenId = 0;

    tx = await marketplace.createMarketItem(price, tokenId, nft.address, {
      value: entranceFee,
    });
    await tx.wait();

    // Buy market item
    const [owner, buyer] = await ethers.getSigners();
    tx = await marketplace
      .connect(buyer)
      .buyItem(tokenId, nft.address, { value: price });
    await tx.wait();

    // Check if the owner is the buyer addess
    expect(await nft.ownerOf(tokenId)).to.equal(buyer.address);
  });
});
