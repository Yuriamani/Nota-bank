import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Building2, Plus, AlertCircle } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import LoanCard from '../components/LoanCard'
import LoanRequestModal from '../components/LoanRequestModal'

const Dashboard = ({ 
  properties, 
  loans, 
  walletConnected, 
  walletAddress, 
  onRequestLoan, 
  onApproveLoan, 
  onRepayLoan, 
  onClaimCollateral 
}) => {
  const [activeTab, setActiveTab] = useState('borrower')
  const [showLoanModal, setShowLoanModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)

  const userLoans = loans.filter(loan => loan.borrower === walletAddress)
  const availableLoans = loans.filter(loan => loan.status === 'pending')

  const handleRequestLoan = (propertyId, amount, duration) => {
    onRequestLoan(propertyId, amount, duration)
    setShowLoanModal(false)
    setSelectedProperty(null)
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
                {properties.map((property, index) => (
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
              {userLoans.length > 0 ? (
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
                        onRepay={() => onRepayLoan(loan.id)}
                        onClaim={() => onClaimCollateral(loan.id)}
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
              {availableLoans.length > 0 ? (
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
                        onApprove={() => onApproveLoan(loan.id)}
                        onClaim={() => onClaimCollateral(loan.id)}
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
