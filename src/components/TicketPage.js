import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

// Components
import Navigation from './Navigation';

// ABIs
import TokenMaster from '../abis/TokenMaster.json';

// Config
import config from '../config.json';

function TicketPage() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [tickets, setTickets] = useState([]);

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();

    // Listen for account changes
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });

    // Automatically set the first connected account
    const accounts = await provider.listAccounts();
    if (accounts.length > 0) {
      setAccount(ethers.utils.getAddress(accounts[0]));
    }
  };

  const fetchUserTickets = async (userAddress) => {
    try {
      const response = await axios.get(`/api/user-tickets/${userAddress}`);
      if (response.data.success) {
        setTickets(response.data.tickets);
      } else {
        console.error('Failed to fetch tickets:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  useEffect(() => {
    if (account) {
      fetchUserTickets(account);
    }
  }, [account]);

  return (
    <div>

      <div className="tickets">
        <h3>Your Tickets:</h3>
        {tickets.length > 0 ? (
          tickets.map((ticket, index) => (
            <div key={index} className="ticket">
              <p><strong>Ticket ID:</strong> {ticket.ticketId}</p>
              <p><strong>Event ID:</strong> {ticket.occasionId}</p>
              <p><strong>Seat Number:</strong> {ticket.seatNumber}</p>
            </div>
          ))
        ) : (
          <p>You have not purchased any tickets yet.</p>
        )}
      </div>
    </div>
  );
}

export default TicketPage;
