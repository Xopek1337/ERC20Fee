const network = hre.network.name;
const fs = require('fs');
const {
  ethers: {
    BigNumber,
  },
} = require("hardhat");

async function main() {
  const totalSupply = await BigNumber.from("12884901889000000000000000000");

  const dir = './networks/';
  const fileName = 'FeeToken_' + `${network}.json`;
  const data = JSON.parse(await fs.readFileSync(dir + fileName, { encoding: 'utf8' }));

  try {
    await hre.run('verify:verify', {
      address: data.feeToken,
      constructorArguments: [process.env.OWNER_TOKENS, process.env.WALLET, process.env.TOKEN_NAME, process.env.TOKEN_SYMBOL, totalSupply],
      contract: 'contracts/FeeToken.sol:FeeToken',
    });
  } catch (e) {
    console.log(e);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
