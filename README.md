# Description

This repository contains an example of an erc-20 token with a fee.
The fee in the form of tokens goes to the wallet specified by the owner.

***

# Installation

bash  
```yarn install```

# Usage

## Compilation

```yarn hardhat compile```

## Run tests and coverage

```yarn hardhat coverage```

## Deploying contract

```npx hardhat run scripts/01_deploy_FeeToken.js --network `<your network>````

## Verify a contract

```npx hardhat run scripts/02_verify_FeeToken.js --network `<your network>````