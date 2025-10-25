import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Zap, ArrowRight, CheckCircle } from 'lucide-react'

const About = () => {
  const benefits = [
    "Secure blockchain-based property tokenization",
    "Immutable loan records on Hedera network",
    "Trustless smart contract execution",
    "Transparent and verifiable transactions",
    "Automated collateral management",
    "Global accessibility and 24/7 availability"
  ]

  const processSteps = [
    {
      step: 1,
      title: "Tokenization",
      description: "Property owners tokenize their real estate assets on Hedera",
      icon: Shield
    },
    {
      step: 2,
      title: "Loan Request",
      description: "Borrowers request loans using tokenized properties as collateral",
      icon: Zap
    },
    {
      step: 3,
      title: "Approval & Funding",
      description: "Lenders review and approve loans through smart contracts",
      icon: CheckCircle
    },
    {
      step: 4,
      title: "Repayment or Default",
      description: "Automatic execution of repayment or collateral transfer",
      icon: Lock
    }
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-6">
            About <span className="gradient-text">Hedera Property Loans</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Revolutionizing property financing through blockchain technology and smart contracts
          </p>
        </motion.div>

        {/* How It Works */}
        <section className="mb-20">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A complete ecosystem for tokenized property loans on Hedera
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.step}
                  className="glass-card p-6 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-16 h-16 bg-gradient-hedera rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={32} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-hedera-purple mb-2">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-300 text-sm">{step.description}</p>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-20">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Key Benefits</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Why choose our platform for your property financing needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="glass-card p-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Shield className="text-hedera-purple mr-3" size={28} />
                Security & Trust
              </h3>
              <ul className="space-y-3">
                {benefits.slice(0, 3).map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle size={20} className="text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="glass-card p-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Zap className="text-hedera-blue mr-3" size={28} />
                Innovation & Efficiency
              </h3>
              <ul className="space-y-3">
                {benefits.slice(3).map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle size={20} className="text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Hedera Network */}
        <section className="mb-20">
          <motion.div
            className="glass-card p-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 bg-gradient-hedera rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-white font-bold text-2xl">H</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Built for <span className="gradient-text">Hedera Network</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Leveraging Hedera Hashgraph's fast, fair, and secure consensus algorithm 
              for enterprise-grade blockchain applications
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-hedera-purple">Fast</h3>
                <p className="text-gray-300">Sub-second finality with high throughput</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-hedera-blue">Fair</h3>
                <p className="text-gray-300">Fair ordering and low-cost transactions</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-green-400">Secure</h3>
                <p className="text-gray-300">Asynchronous Byzantine fault tolerance</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="glass-card p-12 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the future of property financing with blockchain technology
            </p>
            <motion.a
              href="/dashboard"
              className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Launch Dashboard</span>
              <ArrowRight size={20} />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About
