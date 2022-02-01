# NFT Marketplace

![alt text](https://github.com/rafael-abuawad/nft-marketplace/blob/main/public/screenshot.png "Screenshot of the home page")

This project is a digital art (ERC-721) marketplace with Next.js, Tailwind, Solidity, Hardhat, Ethers.js, and IPFS. Although the project is just a demo, is fully functional with a clean and responsive UI, and all the basic stuff like buy, sell, and collect.

## Tech stack
 - [TailwindCSS](https://tailwindcss.com/)
 - [Hardhat](https://hardhat.org/)
 - [Ethers](https://docs.ethers.io/v5/)
 - [NextJS](https://nextjs.org/)
 - [React](https://reactjs.org/)

## Features
- Home page with all the NFT listed for sale on the marketplace.
- Mint and list NFTs on the marketplace.
- Buy and collect NFTs.
- Check the NFTs your created.

## Installation

1. [Install Node](https://nodejs.org/en/), if you haven't already.

2. Clone the repository.

    ```bash
    git clone https://github.com/rafael-abuawad/nft-marketplace.git
    ```

3. Install the Next (React) client and Hardhat dependencies.

    ```bash
    yarn install
    ```
    or 

    ```bash
    npm install 
    ```

4. If you want to be able to deploy to testnets, do the following.

    Set your WEB3_INFURA_PROJECT_ID, and PRIVATE_KEY environment variables.

    You can get a WEB3_INFURA_PROJECT_ID by getting a free trial of Infura. At the moment, it does need to be infura with brownie. If you get lost, follow the instructions at https://ethereumico.io/knowledge-base/infura-api-key-guide/. You can find your PRIVATE_KEY from your ethereum wallet like metamask.

    You'll also need testnet ETH. You can get ETH into your wallet by using the faucet for the appropriate
    testnet. For Kovan, a faucet is available at https://linkfaucet.protofire.io/kovan.

    You can add your environment variables to a .env file. You can use the .env_example in this repo 
    as a template, just fill in the values and rename it to '.env'. 

    Here is what your .env should look like:

    ```bash
    export WEB3_INFURA_PROJECT_ID=<PROJECT_ID>
    export PRIVATE_KEY=<PRIVATE_KEY>
    ```
   
5. Config hardhat account(s) following instructions here:
       https://hardhat.org/config/#configuration

6. Import the account to MetaMask using their private key(s)
