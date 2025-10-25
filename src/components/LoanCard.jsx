import React from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Clock, User, CheckCircle, XCircle, AlertTriangle, Building2 } from 'lucide-react'

const LoanCard = ({ loan, property, onApprove, onRepay, onClaim, isBorrower }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-400" />
      case 'approved':
        return <CheckCircle size={16} className="text-green-400" />
      case 'repaid':
        return <CheckCircle size={16} className="text-blue-400" />
      case 'defaulted':
        return <XCircle size={16} className="text-red-400" />
      default:
        return <AlertTriangle size={16} className="text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'repaid':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'defaulted':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Approval'
      case 'approved':
        return 'Approved'
      case 'repaid':
        return 'Repaid'
      case 'defaulted':
        return 'Defaulted'
      default:
        return 'Unknown'
    }
  }

  const canApprove = !isBorrower && loan.status === 'pending'
  const canRepay = isBorrower && loan.status === 'approved'
  const canClaim = !isBorrower && loan.status === 'approved'

  return (
    <motion.div
      className="glass-card p-6 hover:bg-white/15 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-hedera rounded-lg flex items-center justify-center">
            <Building2 size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">
              {property ? property.name : 'Property'}
            </h3>
            <div className="flex items-center text-gray-400 text-sm">
              <User size={14} className="mr-1" />
              {loan.borrower}
            </div>
          </div>
        </div>
        
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(loan.status)}`}>
          {getStatusIcon(loan.status)}
          <span className="text-sm font-medium">{getStatusText(loan.status)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-sm text-gray-400 mb-1">Loan Amount</div>
          <div className="text-xl font-bold text-green-400">
            ${loan.amount.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Duration</div>
          <div className="text-xl font-bold">
            {loan.duration} months
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Interest Rate</div>
          <div className="text-xl font-bold">
            {loan.interestRate.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Property Value</div>
          <div className="text-xl font-bold">
            ${property ? property.value.toLocaleString() : 'N/A'}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Created: {new Date(loan.createdAt).toLocaleDateString()}
        </div>
        
        <div className="flex space-x-2">
          {canApprove && (
            <motion.button
              onClick={() => onApprove(loan.id)}
              className="btn-primary text-sm px-4 py-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Approve Loan
            </motion.button>
          )}
          
          {canRepay && (
            <motion.button
              onClick={() => onRepay(loan.id)}
              className="btn-primary text-sm px-4 py-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Repay Loan
            </motion.button>
          )}
          
          {canClaim && (
            <motion.button
              onClick={() => onClaim(loan.id)}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-sm px-4 py-2 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Claim Collateral
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default LoanCard
