// src/NFTDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import EventCertificate from './contracts/EventCertificate.json';
import NFTCard from './NFTCard';

const NFTDetailsPage = ({ contract }) => {
  const [nftDetails, setNFTDetails] = useState(null);
  const { tokenId } = useParams();

  useEffect(() => {
    const fetchNFTDetails = async () => {
      try {
        const details = await contract.getNFTDetails(tokenId);
        setNFTDetails(details);
      } catch (error) {
        console.error('Error fetching NFT details:', error.message);
      }
    };

    if (contract) {
      // fetchNFTDetails();
    }
  }, [contract, tokenId]);

  return (
    <div>
      <h2>NFT Details</h2>
      <NFTCard contract={contract} tokenId={tokenId} />

      {nftDetails && (
        <div>
          <p>Event Name: {nftDetails.eventName}</p>
          <p>Event Description: {nftDetails.eventDescription}</p>
          <p>Event Time: {nftDetails.eventTime}</p>
          <p>Name Holder: {nftDetails.nameHolder}</p>
        </div>
      )}
    </div>
  );
};

export default NFTDetailsPage;