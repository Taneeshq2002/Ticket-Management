// routes/tickets.js
const express = require('express');
const { ethers } = require('ethers');
const TokenMasterABI = require('../src/abis/TokenMaster.json'); // Update the path
const config = require('../config'); // Update the path

const router = express.Router();

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545'); // Update with your provider
const contractAddress = config[31337].TokenMaster.address; // Replace 31337 with your chainId if needed
const tokenMasterContract = new ethers.Contract(contractAddress, TokenMasterABI, provider);

// Endpoint to fetch tickets for a user
router.get('/user-tickets/:address', async (req, res) => {
  try {
    const userAddress = req.params.address;

    // Call the contract method to get tickets owned by the user
    const tickets = await tokenMasterContract.getTicketsByOwner(userAddress);

    res.json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tickets',
    });
  }
});

module.exports = router;
