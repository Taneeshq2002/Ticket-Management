import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

// Components
import Navigation from './Navigation';

// ABIs
import TokenMaster from '../abis/TokenMaster.json';

// Config
import config from '../config.json';
import TicketQRCode from './TicketQRCode';

function TicketPage() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [tokenMaster, setTokenMaster] = useState(null)

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    const tokenMaster = new ethers.Contract(config[31337].TokenMaster.address, TokenMaster, provider)
    setTokenMaster(tokenMaster)
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

  const fetchUserTickets = async () => {
    if (!account || !provider || !tokenMaster) return;

    try {
      const signer = provider.getSigner();
      const contract = tokenMaster.connect(signer);
      try{

        const ticketsFromChain = await contract.getTicketsByOwner(account);
        const formattedTickets = ticketsFromChain.map((ticket) => ({
          ticketId: ticket.ticketId.toString(),
          occasionId: ticket.occasionId.toString(),
          seatNumber: ticket.seatNumber.toString(),
          seller:ticket.seller.toString()
        }));
  
        setTickets(formattedTickets);
      }
      catch(err){
        console.log(err);
        
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
  }, [account,provider,tokenMaster]);

  return (
    <div>

      <div className="tickets">
        <h3>Your Tickets:</h3>
        {tickets.length > 0 ? (
          tickets.map((ticket, index) => (
            <div key={index} className="ticket">
              {/* <p><strong>Ticket ID:</strong> {ticket.ticketId}</p>
              <p><strong>Event ID:</strong> {ticket.occasionId}</p>
              <p><strong>Seat Number:</strong> {ticket.seatNumber}</p> */}
              <TicketQRCode ticket={ticket} />
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
