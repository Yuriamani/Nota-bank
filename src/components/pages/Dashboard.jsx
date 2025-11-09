import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Building2, Plus, AlertCircle } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import LoanCard from '../components/LoanCard'
import LoanRequestModal from '../components/LoanRequestModal'
import Toast from '../components/Toast'
import ContractService from '../services/ContractService'
import WalletService from '../services/WalletService'
import TransactionService from '../services/TransactionService'

const contractService = ContractService.getInstance();
const walletService = WalletService.getInstance();
const transactionService = TransactionService.getInstance();

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loans, setLoans] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    checkWalletConnection();
    loadDashboardData();
  }, [walletConnected]);

  const checkWalletConnection = async () => {
    try {
      const connected = walletService.isConnected();
      setWalletConnected(connected);
      if (connected) {
        const accountInfo = await walletService.getAccountInfo();
        setWalletAddress(accountInfo.accountId);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      showToast('Failed to check wallet connection', 'error');
    }
  };

  const loadDashboardData = async () => {
    if (!walletConnected) return;
    setIsLoading(true);
    try {
      // Load properties
      const propertyCount = await contractService.getProperty('count');
      const propertiesData = [];
      for (let i = 1; i <= propertyCount; i++) {
        const property = await contractService.getProperty(i);
        if (property.owner === walletAddress) {
          propertiesData.push({
            id: i,
            ...property
          });
        }
      }
      setProperties(propertiesData);

      // Load loans
      const loanCount = await contractService.getLoan('count');
      const loansData = [];
      for (let i = 1; i <= loanCount; i++) {
        const loan = await contractService.getLoan(i);
        if (loan.borrower === walletAddress || loan.status === 'pending') {
          loansData.push({
            id: i,
            ...loan
          });
        }
      }
      setLoans(loansData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };
  const [activeTab, setActiveTab] = useState('borrower')
  const [showLoanModal, setShowLoanModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)

  const userLoans = loans.filter(loan => loan.borrower === walletAddress)
  const availableLoans = loans.filter(loan => loan.status === 'pending')

  const handleRequestLoan = async (propertyId, amount, duration) => {
    try {
      showToast('Processing loan request...', 'loading');
      const txResponse = await contractService.requestLoan(propertyId, amount, duration);
      
      await transactionService.trackTransaction(txResponse,
        () => {
          showToast('Loan request submitted successfully', 'success');
          loadDashboardData();
          setShowLoanModal(false);
          setSelectedProperty(null);
        },
        (error) => {
          showToast('Transaction failed: ' + error, 'error');
        }
      );
    } catch (error) {
      console.error('Error requesting loan:', error);
      showToast('Failed to request loan: ' + error.message, 'error');
    }
  }

  const handleApproveLoan = async (loanId) => {
    try {
      showToast('Processing loan approval...', 'loading');
      const loan = loans.find(l => l.id === loanId);
      const txResponse = await contractService.approveLoan(loanId, loan.amount);
      
      await transactionService.trackTransaction(txResponse,
        () => {
          showToast('Loan approved successfully', 'success');
          loadDashboardData();
        },
        (error) => {
          showToast('Transaction failed: ' + error, 'error');
        }
      );
    } catch (error) {
      console.error('Error approving loan:', error);
      showToast('Failed to approve loan: ' + error.message, 'error');
    }
  }

  const handleRepayLoan = async (loanId) => {
    try {
      showToast('Processing loan repayment...', 'loading');
      const loan = loans.find(l => l.id === loanId);
      const txResponse = await contractService.repayLoan(loanId, loan.amount);
      
      await transactionService.trackTransaction(txResponse,
        () => {
          showToast('Loan repaid successfully', 'success');
          loadDashboardData();
        },
        (error) => {
          showToast('Transaction failed: ' + error, 'error');
        }
      );
    } catch (error) {
      console.error('Error repaying loan:', error);
      showToast('Failed to repay loan: ' + error.message, 'error');
    }
  }

  const handleClaimCollateral = async (loanId) => {
    try {
      showToast('Processing collateral claim...', 'loading');
      const txResponse = await contractService.claimCollateral(loanId);
      
      await transactionService.trackTransaction(txResponse,
        () => {
          showToast('Collateral claimed successfully', 'success');
          loadDashboardData();
        },
        (error) => {
          showToast('Transaction failed: ' + error, 'error');
        }
      );
    } catch (error) {
      console.error('Error claiming collateral:', error);
      showToast('Failed to claim collateral: ' + error.message, 'error');
    }
  }

  const openLoanModal = (property) => {
    setSelectedProperty(property)
    setShowLoanModal(true)
  }

  if (!walletConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="glass-card p-12 text-center max-w-md mx-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AlertCircle size={64} className="text-yellow-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
          <p className="text-gray-300 mb-6">
            Please connect your wallet to access the dashboard
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          />
        ))}
        
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-300">
            Welcome back! Manage your properties and loans
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="glass-card p-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('borrower')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                activeTab === 'borrower'
                  ? 'bg-white/20 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <User size={20} />
              <span>Borrower</span>
            </button>
            <button
              onClick={() => setActiveTab('lender')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                activeTab === 'lender'
                  ? 'bg-white/20 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Building2 size={20} />
              <span>Lender</span>
            </button>
          </div>
        </motion.div>

        {/* Borrower View */}
        {activeTab === 'borrower' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Your Properties */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Properties</h2>
                <div className="text-sm text-gray-400">
                  {properties.length} tokenized assets
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  <div className="col-span-3 text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      <Building2 size={32} className="text-hedera-purple" />
                    </motion.div>
                    <p className="mt-4 text-gray-400">Loading properties...</p>
                  </div>
                ) : properties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <PropertyCard
                      property={property}
                      onRequestLoan={() => openLoanModal(property)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Your Loans */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Your Loans</h2>
              {isLoading ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    <Building2 size={32} className="text-hedera-purple" />
                  </motion.div>
                  <p className="mt-4 text-gray-400">Loading loans...</p>
                </div>
              ) : userLoans.length > 0 ? (
                <div className="space-y-4">
                  {userLoans.map((loan, index) => (
                    <motion.div
                      key={loan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <LoanCard
                        loan={loan}
                        property={properties.find(p => p.id === loan.propertyId)}
                        onRepay={handleRepayLoan}
                        onClaim={handleClaimCollateral}
                        isBorrower={true}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-8 text-center">
                  <Building2 size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">No loans found</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Request a loan against your properties to get started
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Lender View */}
        {activeTab === 'lender' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="text-2xl font-bold mb-6">Available Loan Requests</h2>
              {isLoading ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    <Building2 size={32} className="text-hedera-purple" />
                  </motion.div>
                  <p className="mt-4 text-gray-400">Loading available loans...</p>
                </div>
              ) : availableLoans.length > 0 ? (
                <div className="space-y-4">
                  {availableLoans.map((loan, index) => (
                    <motion.div
                      key={loan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <LoanCard
                        loan={loan}
                        property={properties.find(p => p.id === loan.propertyId)}
                        onApprove={handleApproveLoan}
                        onClaim={handleClaimCollateral}
                        isBorrower={false}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-8 text-center">
                  <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">No loan requests available</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Check back later for new loan opportunities
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Loan Request Modal */}
        {showLoanModal && (
          <LoanRequestModal
            property={selectedProperty}
            onRequestLoan={handleRequestLoan}
            onClose={() => {
              setShowLoanModal(false)
              setSelectedProperty(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard
