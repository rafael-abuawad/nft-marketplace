require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: '.env.local' })

const privateKey = process.env.PRIVATE_KEY
const web3InfuraProjectId = process.env.WEB3_INFURA_PROJECT_ID

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
     url: `https://polygon-mumbai.infura.io/v3/${web3InfuraProjectId}`,
     accounts: [privateKey]
   }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
};
