import { ethers } from 'ethers'

const Navigation = ({ account, setAccount, tokenMaster, provider }) => {

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)
  }

  const withdrawalHandler = async () => {
    if (!account) return alert('Connect your wallet first.')

    const signer = provider.getSigner() // Get signer for transactions
    const contractWithSigner = tokenMaster.connect(signer)

    try {
      const transaction = await contractWithSigner.withdraw()
      await transaction.wait()
      alert('Funds withdrawn successfully!')
    } catch (error) {
      console.error('Withdrawal failed:', error)
      alert('Failed to withdraw funds. Make sure you are the contract owner.')
    }
  }

  return (
    <nav>
      <div className='nav__brand'>
        <h1>tokenmaster</h1>

        <input className='nav__search' type="text" placeholder='Find millions of experiences' />

        <ul className='nav__links'>
          <li><a href="/">Concerts</a></li>
          <li><a href="/">Sports</a></li>
          <li><a href="/">Arts & Theater</a></li>
          <li><a href="/">More</a></li>
        </ul>
      </div>

      {account&&tokenMaster ? (
        <div>
    
    <button
          type="button"
          className='nav__connect'
        >
          {account.slice(0, 6) + '...' + account.slice(38, 42)}
        </button>
        {account && (
      <button onClick={withdrawalHandler} className="nav__withdraw">Withdraw</button>
    )}
  </div>
        
      ) : (
        <div>
        <button
          type="button"
          className='nav__connect'
          onClick={connectHandler}
        >
          Connect
        </button>
        <button
        type="button"
        className="nav__withdraw"
        onClick={withdrawalHandler}
      >
        Withdraw Funds
      </button>
    </div>
      )}
    </nav>
  );
}

export default Navigation;