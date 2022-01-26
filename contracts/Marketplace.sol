// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract Marketplace is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _itemIdCounter;
    Counters.Counter private _itemsSold;
    uint256 private _entranceFee = 0.0000025 ether;
    uint256 private _minListingPrice = 0.00005 ether;

    struct MarketItem {
        uint256 itemId;
        uint256 tokenId;
        uint256 price;
        address payable owner;
        address payable seller;
        bool sold;
    }

    mapping(uint256 => MarketItem) _idToMarketItem;

    constructor() {}

    event MarketItemMinted(
        uint256 itemId,
        uint256 indexed tokenId,
        uint256 price,
        address owner,
        address seller,
        bool sold
    );

    function getEntranceFee() public view returns (uint256) {
        return _entranceFee;
    }

    function setEntranceFee(uint256 entranceFee) public onlyOwner {
        _entranceFee = entranceFee;
    }

    function getMinimunListingPrice() public view returns (uint256) {
        return _minListingPrice;
    }

    function setMinimunListingPrice(uint256 minListingPrice) public onlyOwner {
        _minListingPrice = minListingPrice;
    }

    function createMarketItem(
        uint256 price,
        uint256 tokenId,
        address nftContract
    ) public payable nonReentrant returns (uint256) {
        require(
            msg.value == _entranceFee,
            'You must pay the entrance fee to list your item in the market'
        );
        require(
            price >= _minListingPrice,
            'You must pay the minimun listing price'
        );

        uint256 itemId = _itemIdCounter.current();
        _itemIdCounter.increment();

        // Minting Item
        address marketplace = address(this);
        IERC721(nftContract).transferFrom(msg.sender, marketplace, tokenId);

        // Maps the item to the marketplace
        _idToMarketItem[itemId] = MarketItem(
            itemId,
            tokenId,
            price,
            payable(address(0)), // owner
            payable(msg.sender), // seller
            false // sold
        );

        emit MarketItemMinted(
            itemId,
            tokenId,
            price,
            payable(address(0)), // owner
            payable(msg.sender), // seller
            false // sold
        );

        return itemId;
    }

    function buyItem(uint256 itemId, address nftContract)
        public
        payable
        nonReentrant
        returns (uint256)
    {
        require(itemId < _itemIdCounter.current(), "The item doesn't exists");

        MarketItem memory item = _idToMarketItem[itemId];
        address marketplace = address(this);
        require(
            ERC721(nftContract).isApprovedForAll(item.seller, marketplace) ==
                true,
            'The Marketplace is not allowed to sell the NFT'
        );
        require(msg.value == item.price, 'You must pay the market item price');

        ERC721(nftContract).safeTransferFrom(
            marketplace,
            msg.sender,
            item.tokenId
        );

        _idToMarketItem[itemId].owner = payable(msg.sender);
        _idToMarketItem[itemId].seller.transfer(msg.value);
        _idToMarketItem[itemId].sold = true;

        _itemsSold.increment();
        return item.itemId;
    }

    function listAllItems() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIdCounter.current();
        uint256 itemCount = totalItemCount - _itemsSold.current();
        uint256 index = 0;
        MarketItem[] memory items = new MarketItem[](itemCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            MarketItem storage currentItem = _idToMarketItem[i];
            if (currentItem.sold == false) {
                items[index] = currentItem;
                index++;
            }
        }

        return items;
    }

    function listMyItems() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIdCounter.current();
        uint256 itemCount = 0;
        uint256 index = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            MarketItem storage currentItem = _idToMarketItem[i];
            if (currentItem.owner == msg.sender) {
                itemCount++;
            }
        }

        index = 0;
        MarketItem[] memory items = new MarketItem[](itemCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            MarketItem storage currentItem = _idToMarketItem[i];
            if (currentItem.owner == msg.sender) {
                items[index] = currentItem;
                index++;
            }
        }

        return items;
    }

    function listMyCreatedItems() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIdCounter.current();
        uint256 itemCount = 0;
        uint256 index = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            MarketItem storage currentItem = _idToMarketItem[i];
            if (currentItem.seller == msg.sender) {
                itemCount++;
            }
        }

        index = 0;
        MarketItem[] memory items = new MarketItem[](itemCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            MarketItem storage currentItem = _idToMarketItem[i];
            if (currentItem.seller == msg.sender) {
                items[index] = currentItem;
                index++;
            }
        }

        return items;
    }
}
