const express = require('express');
const { ethers } = require('ethers');
const hardhat = require('hardhat'); // Import Hardhat
const TokenMasterABI = require('./src/abis/TokenMaster.json');
const config = require('./config'); // Your Hardhat config
const router = require('./routes/tickets');
const app = express();

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545'); // Change to your network if needed

// Hardhat initialization (make sure Hardhat is properly initialized)
// const TokenMaster = ethers.getContractFactory("TokenMaster");
// const tokenMaster = TokenMaster.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
// console.log(tokenMaster.address);
const contractAddress = config[31337].TokenMaster.address; // Update the chainId if necessary
const tokenMasterContract = new ethers.Contract(contractAddress, TokenMasterABI, provider);

// Make sure routes are used correctly
app.use(express.json());
app.use('/api', router);

// Example route to interact with contract
app.get('/contract-data', async (req, res) => {
  try {
    const ticketCount = await tokenMasterContract.getTicketCount();
    res.json({ ticketCount });
  } catch (error) {
    console.error('Error fetching contract data:', error);
    res.status(500).json({ error: 'Failed to fetch data from contract' });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
