import Image from 'next/image';

export default function NFTCard({ nft, showInfo, showBuyBtn, buyNft }) {
  const flatBottom = showInfo ? 'hover:scale-105' : 'rounded-b-none';
  return (
    <div key={nft.itemId} className="border border-gray-300 rounded-xl">
      <div className="relative aspect-w-1 aspect-h-1 rounded-xl">
        <img
          className={`absolute w-full h-full rounded-xl shadow-lg ease-in-out duration-150 ${flatBottom}`}
          src={nft.image}
          lazy
        />
      </div>
      {showInfo && (
        <div className="space-y-1 p-3 text-gray-600">
          <p className="text-xl">{nft.name}</p>
          <p className="truncate">{nft.description}</p>
        </div>
      )}
      <div className="flex justify-between p-3 rounded-b-xl items-center bg-black text-white">
        <p className="font-semibold">{nft.price} ETH</p>
        {showBuyBtn && (
          <button
            className="px-4 rounded-lg border border-white hover:bg-white hover:text-black"
            onClick={buyNft}
          >
            BUY
          </button>
        )}
      </div>
    </div>
  );
}
