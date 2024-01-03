// src/NFTCard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

const NFTCard = ({ contract, tokenId }) => {
  const [nftDetails, setNFTDetails] = useState(null);

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
      fetchNFTDetails();
    }
  }, [contract, tokenId]);

  return (
    <div>
      <h3>NFT Details</h3>
      {nftDetails ? (
        <div>
          <Link to={`/details/${tokenId}`}>View Details</Link>
          {/* ... (unchanged code) */}
        </div>
      ) : (
        <p>Loading NFT details...</p>
      )}
    </div>
  );
};

export default NFTCard;