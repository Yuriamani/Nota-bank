import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-400" />
      case 'error':
        return <XCircle size={20} className="text-red-400" />
      case 'warning':
        return <AlertCircle size={20} className="text-yellow-400" />
      case 'info':
        return <Info size={20} className="text-blue-400" />
      default:
        return <CheckCircle size={20} className="text-green-400" />
    }
  }

  const getColorClass = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/30'
      case 'error':
        return 'bg-red-500/20 border-red-500/30'
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30'
      case 'info':
        return 'bg-blue-500/20 border-blue-500/30'
      default:
        return 'bg-green-500/20 border-green-500/30'
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed top-4 right-4 z-50 glass-card p-4 border ${getColorClass()} max-w-sm`}
        initial={{ opacity: 0, x: 300, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 300, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-3">
          {getIcon()}
          <span className="text-white font-medium">{message}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Toast
