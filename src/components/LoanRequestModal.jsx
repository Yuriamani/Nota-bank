import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, DollarSign, Clock, Building2 } from 'lucide-react'

const LoanRequestModal = ({ property, onRequestLoan, onClose }) => {
  const [amount, setAmount] = useState('')
  const [duration, setDuration] = useState('12')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (amount && duration && property) {
      onRequestLoan(property.id, amount, duration)
    }
  }

  const maxLoanAmount = property ? Math.floor(property.value * 0.8) : 0

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-card p-8 max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-hedera rounded-lg flex items-center justify-center">
                <Building2 size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Request Loan</h2>
                <p className="text-sm text-gray-400">{property?.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Property Info */}
          {property && (
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Property Value</div>
                  <div className="font-bold text-green-400">
                    ${property.value.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Max Loan</div>
                  <div className="font-bold text-blue-400">
                    ${maxLoanAmount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Loan Amount (USD)
              </label>
              <div className="relative">
                <DollarSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter loan amount"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hedera-purple focus:border-transparent"
                  max={maxLoanAmount}
                  min="1000"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Maximum: ${maxLoanAmount.toLocaleString()} (80% of property value)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Loan Duration (Months)
              </label>
              <div className="relative">
                <Clock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-hedera-purple focus:border-transparent appearance-none"
                  required
                >
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="18">18 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                </select>
              </div>
            </div>

            {/* Loan Summary */}
            {amount && (
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-medium mb-3">Loan Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Principal</span>
                    <span>${parseInt(amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Interest Rate</span>
                    <span>5.5% - 7.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration</span>
                    <span>{duration} months</span>
                  </div>
                  <div className="flex justify-between font-medium border-t border-white/10 pt-2">
                    <span>Estimated Monthly Payment</span>
                    <span className="text-green-400">
                      ${Math.round((parseInt(amount) * 1.065) / parseInt(duration)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary"
                disabled={!amount || parseInt(amount) > maxLoanAmount}
              >
                Request Loan
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default LoanRequestModal
