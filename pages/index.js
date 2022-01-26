import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import Head from 'next/head';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Marketplace from '../artifacts/contracts/Marketplace.sol/Marketplace.json';
import { nftAddress, marketplaceAddress } from '../config';
import NFTCard from '../components/NFTCard';

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNfts();
  }, []);

  async function loadNfts() {
    setLoading(true);
    const provider = new ethers.providers.JsonRpcProvider();
    const nft = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketplace = new ethers.Contract(
      marketplaceAddress,
      Marketplace.abi,
      provider
    );

    let items = await marketplace.listAllItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenURI = await nft.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        return {
          ...i,
          tokenId: i.tokenId.toNumber(),
          itemId: i.itemId.toNumber(),
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          price: ethers.utils.formatUnits(i.price.toString(), 'ether'),
        };
      })
    );

    setLoading(false);
    setLoaded(true);
    setNfts(items);
  }

  async function buyNft(nft) {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const marketplace = new ethers.Contract(
      marketplaceAddress,
      Marketplace.abi,
      signer
    );

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await marketplace.buyItem(nft.itemId, nftAddress, {
      value: price,
    });
    await transaction.wait();
    loadNfts();
  }

  return (
    <div>
      <Head>
        <title>Metaverse Marketplace</title>
        <meta
          name="description"
          content="Building a digital art marketplace with Next.js, Tailwind, Solidity, Hardhat, Ethers.js, and IPFS. "
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h1 className="pb-3 text-gray-600 text-xl sm:text-2xl">
          Marketplace items
        </h1>
        <div>
          {loading && (
            <p className="pb-3 text-gray-600 text-xl sm:text-2xl">
              Items loading
            </p>
          )}
          {loaded && nfts.length === 0 && (
            <p className="pb-3 text-gray-600 text-xl sm:text-2xl">
              There are no Items in the marketplace
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gird-cols-6 gap-6">
            {nfts.map((nft) => (
              <NFTCard
                key={nft.itemId}
                nft={nft}
                showInfo
                showBuyBtn
                buyNft={() => buyNft(nft)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
