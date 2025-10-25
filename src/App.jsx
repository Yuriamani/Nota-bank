import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Toast from './components/Toast'

function App() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [toast, setToast] = useState(null)
  
  // Mock data for the demo
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: "Apartment A",
      location: "Downtown District",
      value: 250000,
      tokenId: "0x1234...5678",
      image: "🏢"
    },
    {
      id: 2,
      name: "Plot 17",
      location: "Suburban Area",
      value: 180000,
      tokenId: "0x9876...5432",
      image: "🏘️"
    },
    {
      id: 3,
      name: "Commercial Space B",
      location: "Business District",
      value: 450000,
      tokenId: "0xabcd...efgh",
      image: "🏬"
    }
  ])

  const [loans, setLoans] = useState([
    {
      id: 1,
      propertyId: 1,
      borrower: "0x1234...5678",
      amount: 100000,
      duration: 12,
      status: "pending",
      interestRate: 5.5,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      propertyId: 2,
      borrower: "0x9876...5432",
      amount: 75000,
      duration: 24,
      status: "approved",
      interestRate: 6.0,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const connectWallet = () => {
    if (!walletConnected) {
      const mockAddress = `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`
      setWalletAddress(mockAddress)
      setWalletConnected(true)
      showToast('Wallet connected successfully!', 'success')
    } else {
      setWalletConnected(false)
      setWalletAddress('')
      showToast('Wallet disconnected', 'info')
    }
  }

  const requestLoan = (propertyId, amount, duration) => {
    const newLoan = {
      id: loans.length + 1,
      propertyId,
      borrower: walletAddress,
      amount: parseInt(amount),
      duration: parseInt(duration),
      status: "pending",
      interestRate: 5.5 + Math.random() * 2,
      createdAt: new Date().toISOString()
    }
    setLoans([...loans, newLoan])
    showToast('✅ Loan Requested Successfully', 'success')
    return newLoan
  }

  const approveLoan = (loanId) => {
    setLoans(loans.map(loan => 
      loan.id === loanId ? { ...loan, status: "approved" } : loan
    ))
    showToast('✅ Loan Approved', 'success')
  }

  const repayLoan = (loanId) => {
    setLoans(loans.map(loan => 
      loan.id === loanId ? { ...loan, status: "repaid" } : loan
    ))
    showToast('✅ Loan Repaid', 'success')
  }

  const claimCollateral = (loanId) => {
    setLoans(loans.map(loan => 
      loan.id === loanId ? { ...loan, status: "defaulted" } : loan
    ))
    showToast('❌ Loan Defaulted – Collateral Transferred', 'error')
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar 
          walletConnected={walletConnected}
          walletAddress={walletAddress}
          onConnectWallet={connectWallet}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/dashboard" 
            element={
              <Dashboard 
                properties={properties}
                loans={loans}
                walletConnected={walletConnected}
                walletAddress={walletAddress}
                onRequestLoan={requestLoan}
                onApproveLoan={approveLoan}
                onRepayLoan={repayLoan}
                onClaimCollateral={claimCollateral}
              />
            } 
          />
          <Route path="/about" element={<About />} />
        </Routes>
        
        {/* Toast Notifications */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </Router>
  )
}

export default App
