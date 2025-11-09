// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./PropertyToken.sol";
import "./PropertyOracle.sol";

/**
 * @title LoanManager
 * @dev Manages property-backed loans
 */
contract LoanManager is Pausable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _loanIds;

    struct Loan {
        uint256 propertyTokenId;
        address borrower;
        address lender;
        uint256 amount;
        uint256 duration;
        uint256 interestRate;
        uint256 startTime;
        uint256 lastPaymentTime;
        uint256 totalRepaid;
        LoanStatus status;
    }

    enum LoanStatus {
        REQUESTED,
        ACTIVE,
        REPAID,
        DEFAULTED
    }

    // Property token contract
    PropertyToken private _propertyToken;
    
    // Oracle contract
    PropertyOracle private _oracle;

    // Mapping from loan ID to Loan
    mapping(uint256 => Loan) private _loans;
    
    // Minimum loan duration (30 days)
    uint256 public constant MIN_LOAN_DURATION = 30 days;
    
    // Maximum loan duration (360 days)
    uint256 public constant MAX_LOAN_DURATION = 360 days;
    
    // Maximum loan-to-value ratio (75%)
    uint256 public constant MAX_LTV = 75;
    
    // Default grace period (7 days)
    uint256 public constant GRACE_PERIOD = 7 days;

    event LoanRequested(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 propertyTokenId,
        uint256 amount
    );
    event LoanApproved(
        uint256 indexed loanId,
        address indexed lender,
        uint256 amount
    );
    event LoanRepayment(
        uint256 indexed loanId,
        uint256 amount,
        uint256 remaining
    );
    event LoanCompleted(uint256 indexed loanId);
    event LoanDefaulted(uint256 indexed loanId);
    event CollateralClaimed(
        uint256 indexed loanId,
        uint256 indexed propertyTokenId,
        address indexed claimant
    );

    constructor(address propertyTokenAddress, address oracleAddress) {
        _propertyToken = PropertyToken(propertyTokenAddress);
        _oracle = PropertyOracle(oracleAddress);
    }

    /**
     * @dev Request a new loan
     * @param propertyTokenId Token ID of the collateral property
     * @param amount Requested loan amount
     * @param duration Loan duration in days
     */
    function requestLoan(
        uint256 propertyTokenId,
        uint256 amount,
        uint256 duration
    ) external whenNotPaused returns (uint256) {
        require(duration >= MIN_LOAN_DURATION, "Duration too short");
        require(duration <= MAX_LOAN_DURATION, "Duration too long");
        require(amount > 0, "Amount must be positive");

        // Verify property ownership
        require(
            _propertyToken.ownerOf(propertyTokenId) == msg.sender,
            "Not property owner"
        );

        // Get property details
        (
            string memory propertyData,
            uint256 valuation,
            bool isLocked,
            ,
            address propertyOwner
        ) = _propertyToken.getProperty(propertyTokenId);

        require(!isLocked, "Property already locked");
        require(propertyOwner == msg.sender, "Not property owner");

        // Check loan-to-value ratio
        require(
            amount * 100 <= valuation * MAX_LTV,
            "Loan amount exceeds maximum LTV"
        );

        // Create loan
        _loanIds.increment();
        uint256 newLoanId = _loanIds.current();

        _loans[newLoanId] = Loan({
            propertyTokenId: propertyTokenId,
            borrower: msg.sender,
            lender: address(0),
            amount: amount,
            duration: duration,
            interestRate: calculateInterestRate(amount, valuation, duration),
            startTime: 0,
            lastPaymentTime: 0,
            totalRepaid: 0,
            status: LoanStatus.REQUESTED
        });

        // Lock the property
        _propertyToken.lockProperty(propertyTokenId, newLoanId);

        emit LoanRequested(newLoanId, msg.sender, propertyTokenId, amount);
        return newLoanId;
    }

    /**
     * @dev Approve and fund a loan request
     * @param loanId ID of the loan to approve
     */
    function approveLoan(uint256 loanId) external payable whenNotPaused {
        Loan storage loan = _loans[loanId];
        
        require(loan.status == LoanStatus.REQUESTED, "Invalid loan status");
        require(loan.amount == msg.value, "Incorrect loan amount");
        require(loan.lender == address(0), "Loan already has lender");

        loan.lender = msg.sender;
        loan.startTime = block.timestamp;
        loan.lastPaymentTime = block.timestamp;
        loan.status = LoanStatus.ACTIVE;

        // Transfer funds to borrower
        payable(loan.borrower).transfer(msg.value);

        emit LoanApproved(loanId, msg.sender, msg.value);
    }

    /**
     * @dev Make a loan repayment
     * @param loanId ID of the loan
     */
    function repayLoan(uint256 loanId) external payable whenNotPaused {
        Loan storage loan = _loans[loanId];
        
        require(loan.status == LoanStatus.ACTIVE, "Loan not active");
        require(msg.sender == loan.borrower, "Not loan borrower");

        uint256 totalDue = calculateTotalDue(loanId);
        uint256 remaining = totalDue - loan.totalRepaid;
        
        require(msg.value <= remaining, "Payment exceeds remaining amount");

        loan.totalRepaid += msg.value;
        loan.lastPaymentTime = block.timestamp;

        // Transfer payment to lender
        payable(loan.lender).transfer(msg.value);

        emit LoanRepayment(loanId, msg.value, remaining - msg.value);

        // Check if loan is fully repaid
        if (loan.totalRepaid >= totalDue) {
            completeLoan(loanId);
        }
    }

    /**
     * @dev Claim collateral for defaulted loan
     * @param loanId ID of the defaulted loan
     */
    function claimCollateral(uint256 loanId) external whenNotPaused {
        Loan storage loan = _loans[loanId];
        
        require(loan.status == LoanStatus.ACTIVE, "Loan not active");
        require(msg.sender == loan.lender, "Not loan lender");
        require(
            block.timestamp > loan.startTime + loan.duration + GRACE_PERIOD,
            "Grace period not expired"
        );

        uint256 totalDue = calculateTotalDue(loanId);
        require(loan.totalRepaid < totalDue, "Loan not in default");

        loan.status = LoanStatus.DEFAULTED;
        
        // Transfer property token to lender
        _propertyToken.transferFrom(
            loan.borrower,
            loan.lender,
            loan.propertyTokenId
        );

        emit LoanDefaulted(loanId);
        emit CollateralClaimed(loanId, loan.propertyTokenId, loan.lender);
    }

    /**
     * @dev Calculate total amount due including interest
     * @param loanId ID of the loan
     */
    function calculateTotalDue(uint256 loanId) public view returns (uint256) {
        Loan storage loan = _loans[loanId];
        return loan.amount + (loan.amount * loan.interestRate * loan.duration) / (365 * 10000);
    }

    /**
     * @dev Calculate interest rate based on LTV and duration
     * @param amount Loan amount
     * @param valuation Property valuation
     * @param duration Loan duration in days
     */
    function calculateInterestRate(
        uint256 amount,
        uint256 valuation,
        uint256 duration
    ) internal pure returns (uint256) {
        // Base rate: 5%
        uint256 baseRate = 500;
        
        // LTV factor: +0.5% for each 10% of LTV
        uint256 ltv = (amount * 100) / valuation;
        uint256 ltvFactor = (ltv * 50) / 1000;
        
        // Duration factor: +0.25% for each 30 days
        uint256 durationFactor = (duration * 25) / 30;
        
        return baseRate + ltvFactor + durationFactor;
    }

    /**
     * @dev Complete a fully repaid loan
     * @param loanId ID of the loan
     */
    function completeLoan(uint256 loanId) internal {
        Loan storage loan = _loans[loanId];
        loan.status = LoanStatus.REPAID;
        
        // Unlock the property
        _propertyToken.unlockProperty(loan.propertyTokenId);
        
        emit LoanCompleted(loanId);
    }

    /**
     * @dev Get loan details
     * @param loanId ID of the loan
     */
    function getLoan(uint256 loanId) external view returns (
        uint256 propertyTokenId,
        address borrower,
        address lender,
        uint256 amount,
        uint256 duration,
        uint256 interestRate,
        uint256 startTime,
        uint256 lastPaymentTime,
        uint256 totalRepaid,
        LoanStatus status
    ) {
        Loan memory loan = _loans[loanId];
        return (
            loan.propertyTokenId,
            loan.borrower,
            loan.lender,
            loan.amount,
            loan.duration,
            loan.interestRate,
            loan.startTime,
            loan.lastPaymentTime,
            loan.totalRepaid,
            loan.status
        );
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}