# Tokenmaster

## Technology Stack & Tools

- Solidity (Writing Smart Contracts & Tests)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)
- [MetaMask](https://metamask.io/)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/). Recommended to use the LTS version.
- Install [MetaMask](https://metamask.io/) on your browser.
- Install hardhat using the command npm install --save-dev hardhat

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
`$ npm install`

### 3. Run tests
`$ npx hardhat test`

### 4. Start Hardhat node
`$ In terminal 1:- npx hardhat node`

### 5. Run deployment script
In a separate terminal execute:
`$ npx hardhat run ./scripts/deploy.js --network localhost`(If executed all the events will be logged)

### 6. Start frontend
`$ npm run start`

###Possible problems
`$ 1)If contract is deployed but events are not rendered on page execute the folllowing:
`$ npx hardhat clean
`$ npx hardhat compile(Should show compiled solidity files as output)

`$2)If "TokenMaster not defined" error arises copy the abi from artifacts/contracts/TokenMaster.sol/TokenMaster.json into src/abis/TokenMaster.json

