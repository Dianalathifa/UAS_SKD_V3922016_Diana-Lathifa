import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import EventCertificate from './contracts/EventCertificate.json';

const YourComponent = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'; // Replace with your contract address
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

  const handleMintCertificate = async () => {
    try {
      if (contract) {
        // Replace 'HOLDER_ADDRESS' with the Ethereum address of the holder
        await contract.mintCertificate('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
        console.log('NFT minted successfully!');
      } else {
        console.error('Contract not available.');
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };

  return (
    <div>
      <p>Connected Account: {account}</p>
      <button onClick={handleMintCertificate}>Mint NFT</button>
    </div>
  );
};

export default YourComponent;