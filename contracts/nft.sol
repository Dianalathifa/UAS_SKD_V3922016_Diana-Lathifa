//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

// Ganti impor ERC721 dan Ownable
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract abc is ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 public constant MAX_TOKENS = 10000;
    uint256 private constant TOKENS_RESERVED = 5;
    uint256 public price = 80000000000000000;
    uint256 public constant MAX_MINT_PER_TX = 10;

    bool public isSaleActive;
    uint256 public totalSupply;
    mapping(address => uint256) private mintedPerWallet;

    string public baseUri;
    string public baseExtension = ".json";

    constructor() ERC721("NFT Name", "SYMBOL") {
        //Base IPFS URI of the NFTs
        baseUri = "ipfs://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/";
        for (uint256 i = 1; i <= TOKENS_RESERVED; ++i) {
            _safeMint(msg.sender, i);
        }
        totalSupply = TOKENS_RESERVED;
    }

    //PUBLIC FUNCTIONS
    function mint(uint256 _numTokens) external payable {
        require(isSaleActive, "The sale is paused.");
        require(_numTokens <= MAX_MINT_PER_TX, "You can only mint a maximum of 10 NFTs per transaction.");
        require(mintedPerWallet[msg.sender] + _numTokens <= 10, "You can only mint 10 per wallet.");
        uint256 curTotalSupply = totalSupply;
        require(curTotalSupply + _numTokens <= MAX_TOKENS, "Exceeds 'MAX_TOKENS'");
        require(_numTokens * price <= msg.value, "Insufficient funds. You need more ETH!");

        for (uint256 i = 1; i <= _numTokens; ++i) {
            _safeMint(msg.sender, curTotalSupply + i);
        }
        mintedPerWallet[msg.sender] += _numTokens;
        totalSupply += _numTokens;
    }

    // OWNER ONLY FUNCTIONS
    function flipSaleState() external onlyOwner {
        isSaleActive = !isSaleActive;
    }

    function setBaseURI(string memory _baseUri) external onlyOwner {
        baseUri = _baseUri;
    }

    function setPrice(uint256 _price) external onlyOwner {
        price = _price;
    }

    function withdrawAll() external payable onlyOwner {
        uint256 balance = address(this).balance;
        uint256 balanceOne = balance * 70/ 100;
        uint256 balanceTwo = balance * 30/ 100;
        (bool transferOne, ) = payable(0xD340Cbd8E6Db506B4633C8c05965762FB408937c).call{value: balanceOne}("");
        (bool transferTwo, ) = payable(0xD340Cbd8E6Db506B4633C8c05965762FB408937c).call{value: balanceTwo}("");
        require(transferOne && transferTwo, "Transfer failed");

    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
            : "";
    }

    // INTERNAL FUNCTIONS
    function _baseURI() internal view virtual override returns (string memory) {
        return baseUri;
    }
}
