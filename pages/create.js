import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { create as IpfsHttpClient } from 'ipfs-http-client';
import Web3Modal from 'web3modal';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { nftAddress, marketplaceAddress } from '../config';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Marketplace from '../artifacts/contracts/Marketplace.sol/Marketplace.json';

const client = IpfsHttpClient('https://ipfs.infura.io:5001/api/v0');

export default function Create() {
  const [fileUrl, setFileUrl] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { name, description, price } = form;

    if (name && description && price && fileUrl) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [fileUrl, form]);

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (err) {
      console.log(err);
    }
  }

  async function createMarketItem() {
    const { name, description, price } = form;
    if (!name && !description && !price && !fileUrl) return;

    try {
      const data = JSON.stringify({
        name,
        description,
        price,
        image: fileUrl,
      });
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      uploadMarketItem(url);
    } catch (err) {
      console.log(err);
    }
  }

  async function uploadMarketItem(url) {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    setLoading(true);

    // Mint the NFT
    const nft = new ethers.Contract(nftAddress, NFT.abi, signer);
    let transaction = await nft.safeMint(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    let price = ethers.utils.parseUnits(form.price, 'ether');

    const marketplace = new ethers.Contract(
      marketplaceAddress,
      Marketplace.abi,
      signer
    );
    let entranceFee = await marketplace.getEntranceFee();
    entranceFee = entranceFee.toString();

    let minimunListingPrice = await marketplace.getMinimunListingPrice();
    minimunListingPrice = minimunListingPrice.toString();

    price =
      BigInt(price) > BigInt(minimunListingPrice) ? price : minimunListingPrice;

    transaction = await marketplace.createMarketItem(
      price,
      tokenId,
      nftAddress,
      {
        value: entranceFee,
      }
    );
    await transaction.wait();
    setLoading(false);
    router.push('/');
  }

  return (
    <div>
      <Head>
        <title>CollectCreate Assetion - Metaverse Marketplace</title>
        <meta
          name="description"
          content="Building a digital art marketplace with Next.js, Tailwind, Solidity, Hardhat, Ethers.js, and IPFS. "
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h1 className="pb-3 text-gray-600 text-xl sm:text-2xl">Create Asset</h1>
        <div className="flex flex-col w-full md:max-w-[500px] space-y-6">
          <input
            type="text"
            className="border border-gray-300 p-3 rounded-lg"
            placeholder="Asset Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <textarea
            type="text"
            className="border border-gray-300 p-3 rounded-lg"
            placeholder="Asset Description"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <input
            type="number"
            className="border border-gray-300 p-3 rounded-lg "
            placeholder="Asset Price (MATIC)"
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            type="file"
            className="
              border border-gray-300 p-3 rounded-lg w-full text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border file:border-black
              file:text-sm file:font-semibold
              file:bg-white file:text-black
              hover:file:bg-black hover:file:text-white
              hover:file:cursor-pointer
             "
            onChange={onChange}
            required
          />

          {fileUrl && (
            <div className="relative aspect-w-1 aspect-h-1 rounded-xl">
              <img
                className="absolute w-full h-full rounded-xl shadow-lg"
                src={fileUrl}
              />
            </div>
          )}
          {!fileUrl && (
            <div className="border border-gray-300 p-3 py-6 text-center rounded-lg w-full">
              <p className="text-gray-400">No file selected yet...</p>
            </div>
          )}
          <button
            className="
              py-3 rounded-lg border font-semibold border-black
              hover:bg-black hover:text-white cursor-pointer
              disabled:border-gray-300 disabled:text-gray-400
              disabled:hover:border-gray-300 disabled:hover:text-gray-400
            "
            onClick={createMarketItem}
            disabled={!valid}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
