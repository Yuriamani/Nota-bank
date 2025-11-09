// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title PropertyToken
 * @dev Implements property tokenization using HTS (Hedera Token Service)
 */
contract PropertyToken is ERC721, Pausable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Property {
        string propertyData; // IPFS hash containing property details
        uint256 valuation;
        bool isLocked;
        uint256 activeLoanId;
        address owner;
    }

    // Mapping from token ID to Property
    mapping(uint256 => Property) private _properties;
    
    // Mapping from token ID to approved loan manager
    mapping(uint256 => address) private _loanManagers;
    
    // Address of the loan manager contract
    address public loanManagerContract;

    event PropertyTokenized(uint256 indexed tokenId, address indexed owner, uint256 valuation);
    event PropertyLocked(uint256 indexed tokenId, uint256 indexed loanId);
    event PropertyUnlocked(uint256 indexed tokenId);
    event PropertyValuationUpdated(uint256 indexed tokenId, uint256 newValuation);

    constructor() ERC721("NotaBank Property Token", "NBPT") {}
    
    /**
     * @dev Set the loan manager contract address
     * @param _loanManager Address of the loan manager contract
     */
    function setLoanManagerContract(address _loanManager) external onlyOwner {
        require(_loanManager != address(0), "Invalid address");
        loanManagerContract = _loanManager;
    }

    /**
     * @dev Tokenize a new property
     * @param propertyData IPFS hash containing property details
     * @param valuation Initial property valuation
     */
    function tokenizeProperty(
        string memory propertyData,
        uint256 valuation
    ) external returns (uint256) {
        require(valuation > 0, "Valuation must be positive");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        
        _properties[newTokenId] = Property({
            propertyData: propertyData,
            valuation: valuation,
            isLocked: false,
            activeLoanId: 0,
            owner: msg.sender
        });

        emit PropertyTokenized(newTokenId, msg.sender, valuation);
        return newTokenId;
    }

    /**
     * @dev Lock property for a loan (only callable by loan manager)
     * @param tokenId Property token ID
     * @param loanId Associated loan ID
     */
    function lockProperty(uint256 tokenId, uint256 loanId) external {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(!_properties[tokenId].isLocked, "Property already locked");
        require(msg.sender == loanManagerContract, "Only loan manager can lock");

        _properties[tokenId].isLocked = true;
        _properties[tokenId].activeLoanId = loanId;
        
        emit PropertyLocked(tokenId, loanId);
    }

    /**
     * @dev Unlock property after loan completion (only callable by loan manager)
     * @param tokenId Property token ID
     */
    function unlockProperty(uint256 tokenId) external {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(_properties[tokenId].isLocked, "Property not locked");
        require(msg.sender == loanManagerContract, "Only loan manager can unlock");

        _properties[tokenId].isLocked = false;
        _properties[tokenId].activeLoanId = 0;
        
        emit PropertyUnlocked(tokenId);
    }

    /**
     * @dev Update property valuation
     * @param tokenId Property token ID
     * @param newValuation Updated property value
     */
    function updateValuation(uint256 tokenId, uint256 newValuation) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(newValuation > 0, "Valuation must be positive");

        _properties[tokenId].valuation = newValuation;
        
        emit PropertyValuationUpdated(tokenId, newValuation);
    }

    /**
     * @dev Set approved loan manager for a token
     * @param tokenId Property token ID
     * @param loanManager Address of loan manager contract
     */
    function setLoanManager(uint256 tokenId, address loanManager) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        _loanManagers[tokenId] = loanManager;
    }

    /**
     * @dev Get property details
     * @param tokenId Property token ID
     */
    function getProperty(uint256 tokenId) external view returns (
        string memory propertyData,
        uint256 valuation,
        bool isLocked,
        uint256 activeLoanId,
        address propertyOwner
    ) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        Property memory property = _properties[tokenId];
        return (
            property.propertyData,
            property.valuation,
            property.isLocked,
            property.activeLoanId,
            property.owner
        );
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override whenNotPaused {
        require(!_properties[tokenId].isLocked, "Token is locked");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        if (to != address(0)) {
            _properties[tokenId].owner = to;
        }
    }
}