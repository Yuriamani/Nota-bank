// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title PropertyOracle
 * @dev Provides property validation and price feed services
 */
contract PropertyOracle is Ownable, Pausable {
    struct PropertyData {
        bool isValidated;
        uint256 lastUpdated;
        uint256 value;
        string validationData; // IPFS hash containing validation details
    }

    // Mapping from property ID to validation data
    mapping(string => PropertyData) private _propertyData;
    
    // Authorized validators
    mapping(address => bool) private _validators;

    event PropertyValidated(string indexed propertyId, uint256 value);
    event ValidatorAdded(address indexed validator);
    event ValidatorRemoved(address indexed validator);
    event PropertyValueUpdated(string indexed propertyId, uint256 newValue);

    modifier onlyValidator() {
        require(_validators[msg.sender], "Not authorized validator");
        _;
    }

    constructor() {
        _validators[msg.sender] = true;
        emit ValidatorAdded(msg.sender);
    }

    /**
     * @dev Add a new validator
     * @param validator Address of the validator
     */
    function addValidator(address validator) external onlyOwner {
        require(validator != address(0), "Invalid address");
        require(!_validators[validator], "Already a validator");
        
        _validators[validator] = true;
        emit ValidatorAdded(validator);
    }

    /**
     * @dev Remove a validator
     * @param validator Address of the validator
     */
    function removeValidator(address validator) external onlyOwner {
        require(_validators[validator], "Not a validator");
        
        _validators[validator] = false;
        emit ValidatorRemoved(validator);
    }

    /**
     * @dev Validate a property and set its initial value
     * @param propertyId Unique identifier of the property
     * @param value Initial property value
     * @param validationData IPFS hash containing validation details
     */
    function validateProperty(
        string memory propertyId,
        uint256 value,
        string memory validationData
    ) external onlyValidator whenNotPaused {
        require(value > 0, "Invalid value");
        require(bytes(propertyId).length > 0, "Invalid property ID");
        
        _propertyData[propertyId] = PropertyData({
            isValidated: true,
            lastUpdated: block.timestamp,
            value: value,
            validationData: validationData
        });

        emit PropertyValidated(propertyId, value);
    }

    /**
     * @dev Update property value
     * @param propertyId Unique identifier of the property
     * @param newValue Updated property value
     */
    function updatePropertyValue(
        string memory propertyId,
        uint256 newValue
    ) external onlyValidator whenNotPaused {
        require(_propertyData[propertyId].isValidated, "Property not validated");
        require(newValue > 0, "Invalid value");

        _propertyData[propertyId].value = newValue;
        _propertyData[propertyId].lastUpdated = block.timestamp;

        emit PropertyValueUpdated(propertyId, newValue);
    }

    /**
     * @dev Get property validation data
     * @param propertyId Unique identifier of the property
     */
    function getPropertyData(string memory propertyId) external view returns (
        bool isValidated,
        uint256 lastUpdated,
        uint256 value,
        string memory validationData
    ) {
        PropertyData memory data = _propertyData[propertyId];
        return (
            data.isValidated,
            data.lastUpdated,
            data.value,
            data.validationData
        );
    }

    /**
     * @dev Check if an address is a validator
     * @param validator Address to check
     */
    function isValidator(address validator) external view returns (bool) {
        return _validators[validator];
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}