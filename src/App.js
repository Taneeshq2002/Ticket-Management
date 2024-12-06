import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Components
import Navigation from './components/Navigation'
import Sort from './components/Sort'
import Card from './components/Card'
import SeatChart from './components/SeatChart'
import TicketPage from './components/TicketPage';
// ABIs
import TokenMaster from './abis/TokenMaster.json'

// Config
import config from './config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [ownerAddress, setOwnerAddress] = useState(null);
  const [ownerBalance, setOwnerBalance] = useState(0);

  const [tokenMaster, setTokenMaster] = useState(null)
  const [occasions, setOccasions] = useState([])

  const [occasion, setOccasion] = useState({})
  const [toggle, setToggle] = useState(false)

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    const tokenMaster = new ethers.Contract(config[network.chainId].TokenMaster.address, TokenMaster, provider)
    setTokenMaster(tokenMaster)

    const totalOccasions = await tokenMaster.totalOccasions()
 
    
    const occasions = []

    for (var i = 1; i <= totalOccasions; i++) {
      const occasion = await tokenMaster.getOccasion(i)
      occasions.push(occasion)
    }
    console.log(occasions);
    
    setOccasions(occasions)

    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })
  }

  const loadOwnerBalance = async () => {
    try{
    const ownerAddress = await tokenMaster.owner();
    setOwnerAddress(ownerAddress);
    console.log(ownerAddress);
    
    const balance = await provider.getBalance(ownerAddress);
    setOwnerBalance(ethers.utils.formatEther(balance));
    }catch (error) {
      console.error("Error loading owner balance:", error);
    }
  };

  useEffect(() => {
    loadBlockchainData()
    loadOwnerBalance();
  }, [])

  return (
    <Router>
      <div>
        {/* Navigation */}
        <header>
          <Navigation
            account={account}
            setAccount={setAccount}
            tokenMaster={tokenMaster}
            provider={provider}
          />
          <h2 className="header__title">
            <strong>Event</strong> Tickets
          </h2>
        </header>

        {/* Routes and Content */}
        <Routes>
        <Route path="/tickets" element={<TicketPage />} /> {/* Route to TicketPage */}
          <Route path="/" element={
            <>
              {/* Sort component to filter the events */}
              <Sort />

              {/* Display event cards */}
              <div className="cards">
                {occasions.map((occasion, index) => (
                  <Card
                    occasion={occasion}
                    id={index + 1}
                    tokenMaster={tokenMaster}
                    provider={provider}
                    account={account}
                    toggle={toggle}
                    setToggle={setToggle}
                    setOccasion={setOccasion}
                    key={index}
                  />
                ))}
              </div>

              {/* Show SeatChart if toggle is true */}
              {toggle && (
                <SeatChart
                  occasion={occasion}
                  tokenMaster={tokenMaster}
                  provider={provider}
                  setToggle={setToggle}
                />
              )}
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;