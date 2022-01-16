require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("hardhat-deploy");

module.exports = {
  solidity: "0.8.11",
  networks: {
    mainnet: {
      url: process.env.ETHERIUM_MAINNET_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    bsctestnet: {
      url: process.env.ETHERIUM_BSCTESTNET_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
  },
  etherscan: {
    apiKey: process.env.SCAN_API_KEY
  }
};