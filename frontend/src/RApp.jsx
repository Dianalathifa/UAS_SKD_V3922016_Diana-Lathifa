// src/App.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import EventCertificate from './contracts/EventCertificate.json';
import NFTCard from './NFTCard';
import NFTDetailsPage from './NFTDetailPage';

function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [tokenId, setTokenId] = useState(1);
  const [newHolderName, setNewHolderName] = useState('');

  console.log(EventCertificate.abi)

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
          const eventCertificateContract = new ethers.Contract(
            contractAddress,
            EventCertificate.abi,
            signer
          );

          const currentAccount = await signer.getAddress();

          setContract(eventCertificateContract);
          setAccount(currentAccount);
        } else {
          console.error('MetaMask not detected. Please install MetaMask.');
        }
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    };

    init();
  }, []);

  const handleTokenIdChange = (e) => {
    setTokenId(e.target.value);
  };

  const handleNewHolderNameChange = (e) => {
    setNewHolderName(e.target.value);
  };

  console.log(contract, account, tokenId, newHolderName)

  const handleMintCertificate = async () => {
    try {
      if (contract && newHolderName) {
        await contract.mintCertificate(newHolderName);
        console.log('NFT minted successfully!');
      } else {
        console.error('Contract or holder name not available.');
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      const permissions = await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [
          {
            eth_accounts: {},
          },
        ],
      });

      console.log('Wallet permissions granted:', permissions);
      // You can now proceed with the requested permissions
    } catch (error) {
      console.error('Error requesting wallet permissions:', error.message);
      // Handle error or inform the user
    }
  };

  return (
    <Router>
      <div className="App">
        <h1>NFT React App</h1>
        <p>Connected Account: {account}</p>

        <Routes>
          <Route path="/" element={<NFTCard contract={contract} tokenId={tokenId} />} />
          <Route
            path="/details/:tokenId"
            element={<NFTDetailsPage contract={contract} />}
          />
        </Routes>

        <div>
          <label>
            Token ID:
            <input type="number" value={tokenId} onChange={handleTokenIdChange} />
          </label>
        </div>

        <div>
          <label>
            Holder Name:
            <input type="text" value={newHolderName} onChange={handleNewHolderNameChange} />
          </label>
        </div>

        <button onClick={handleMintCertificate}>Mint NFT</button>
        <button onClick={requestPermissions}>Request Wallet Permissions</button>
      </div>
    </Router>
  );
}

export default App;