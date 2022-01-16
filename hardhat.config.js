require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("hardhat-deploy");

module.exports = {
  solidity: {
    version: "0.8.11",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    mainnet: {
      url: process.env.ETHERIUM_MAINNET_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    rinkeby: {
      url: process.env.ETHERIUM_RINKEBY_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    bsc: {
      url: process.env.BSC_MAINNET_URL,
      accounts: [process.env.PRIVATE_KEY],
      gasLimit: 8000000,
      network_id: "56",
      confirmations: 7,
      skipDryRun: true
    },
    bsctestnet: {
      url: process.env.BSC_TESTNET_URL,
      accounts: [process.env.PRIVATE_KEY],
      gasLimit: 8000000,
      network_id: "97",
      confirmations: 7,
      skipDryRun: true
    },
  },
  etherscan: {
    apiKey: process.env.SCAN_API_KEY
  }
};