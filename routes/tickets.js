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
    console.log(userAddress);
    

    // Call the contract method to get tickets owned by the user
    const ticketData = await tokenMasterContract.getTicketsByOwner(userAddress);
    const tickets = ticketData.map(ticket => ({
      ticketId: ticket[0].toNumber(), // Assuming BigNumber values, convert to numbers
      occasionId: ticket[1].toNumber(),
      seatNumber: ticket[2].toNumber(),
      // eventDate: new Date(ticket[3] * 1000).toISOString(), // Convert Unix timestamp to ISO string
    }));
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
