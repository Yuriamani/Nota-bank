require("@nomicfoundation/hardhat-toolbox");
require("@hashgraph/hardhat-hethers");
require("dotenv").config();

// Export a functional config to avoid module loading race conditions (fixes TypeError)
module.exports = async function (hardhatConfig) {
  // Use a constant object to return the config cleanly
  return {
    solidity: {
      version: "0.8.17",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    },
    
    networks: {
      testnet: {
        url: process.env.HEDERA_TESTNET_ENDPOINT || "https://testnet.hashio.io/api",
        accounts: process.env.HEDERA_PRIVATE_KEY ? [process.env.HEDERA_PRIVATE_KEY] : [],
        chainId: 296, // Hedera testnet chain ID
      },
      mainnet: {
        url: process.env.HEDERA_MAINNET_ENDPOINT || "https://mainnet.hashio.io/api",
        accounts: process.env.HEDERA_PRIVATE_KEY ? [process.env.HEDERA_PRIVATE_KEY] : [],
        chainId: 295, // Hedera mainnet chain ID
      },
      local: {
        url: "http://127.0.0.1:7546",
        accounts: process.env.HEDERA_PRIVATE_KEY ? [process.env.HEDERA_PRIVATE_KEY] : [],
        chainId: 298, // Hedera local node
      }
    },
    
    defaultNetwork: "testnet",
    
    paths: {
      sources: "./smart-contract",
      tests: "./test",
      cache: "./cache",
      artifacts: "./artifacts"
    },
    
    mocha: {
      timeout: 120000 // 2 minutes for Hedera transactions
    }
  };
};