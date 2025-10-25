import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, DollarSign, Plus, Building2 } from 'lucide-react'

const PropertyCard = ({ property, onRequestLoan }) => {
  return (
    <motion.div
      className="glass-card p-6 hover:bg-white/15 transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-hedera rounded-lg flex items-center justify-center">
            <span className="text-2xl">{property.image}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold">{property.name}</h3>
            <div className="flex items-center text-gray-400 text-sm">
              <MapPin size={14} className="mr-1" />
              {property.location}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Property Value</span>
          <span className="text-2xl font-bold text-green-400">
            ${property.value.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Token ID</span>
          <span className="text-sm font-mono text-gray-300">
            {property.tokenId}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-400">
          <Building2 size={16} className="mr-2" />
          Tokenized Asset
        </div>
        <motion.button
          onClick={() => onRequestLoan(property)}
          className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={16} />
          <span>Request Loan</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default PropertyCard
