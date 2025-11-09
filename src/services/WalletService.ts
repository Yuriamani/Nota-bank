// import { HashConnect } from 'hashconnect';
// import { Client, AccountId, PrivateKey } from '@hashgraph/sdk';
// import config from '../config/web3.config.json';

// class WalletService {
//     private static instance: WalletService;
//     private hashConnect: HashConnect;
//     private client: Client | null = null;
//     private appMetadata = {
//         name: "NotaBank",
//         description: "Property-backed loans on Hedera",
//         icon: "https://notabank.com/logo.png"
//     };

//     private constructor() {
//         this.hashConnect = new HashConnect();
//         this.initializeHashConnect();
//     }

//     public static getInstance(): WalletService {
//         if (!WalletService.instance) {
//             WalletService.instance = new WalletService();
//         }
//         return WalletService.instance;
//     }

//     private async initializeHashConnect() {
//         try {
//             // Initialize HashConnect
//             let initData = await this.hashConnect.init(
//                 this.appMetadata,
//                 "testnet",
//                 false
//             );

//             // Attach event listeners
//             this.hashConnect.connectionStatusChange.on((state) => {
//                 console.log("Connection status changed:", state);
//             });

//             this.hashConnect.pairingEvent.on((data) => {
//                 console.log("Pairing event:", data);
//             });

//             return initData;
//         } catch (error) {
//             console.error("Failed to initialize HashConnect:", error);
//             throw error;
//         }
//     }

//     public async connectWallet(): Promise<string> {
//         try {
//             const state = await this.hashConnect.connect();
//             if (state.topic) {
//                 // Save the connection details
//                 localStorage.setItem('hashconnectTopic', state.topic);
//                 return state.accountIds[0];
//             }
//             throw new Error("Failed to connect wallet");
//         } catch (error) {
//             console.error("Failed to connect wallet:", error);
//             throw error;
//         }
//     }

//     public async disconnectWallet() {
//         try {
//             const topic = localStorage.getItem('hashconnectTopic');
//             if (topic) {
//                 await this.hashConnect.disconnect(topic);
//                 localStorage.removeItem('hashconnectTopic');
//             }
//         } catch (error) {
//             console.error("Failed to disconnect wallet:", error);
//             throw error;
//         }
//     }

//     public async signTransaction(transaction: any): Promise<any> {
//         try {
//             const topic = localStorage.getItem('hashconnectTopic');
//             if (!topic) {
//                 throw new Error("No wallet connection found");
//             }

//             const signedTransaction = await this.hashConnect.sendTransaction(
//                 topic,
//                 transaction
//             );

//             return signedTransaction;
//         } catch (error) {
//             console.error("Failed to sign transaction:", error);
//             throw error;
//         }
//     }

//     public isConnected(): boolean {
//         return !!localStorage.getItem('hashconnectTopic');
//     }

//     public async getAccountInfo(): Promise<any> {
//         try {
//             const topic = localStorage.getItem('hashconnectTopic');
//             if (!topic) {
//                 throw new Error("No wallet connection found");
//             }

//             const accountInfo = await this.hashConnect.getAccount(topic);
//             return accountInfo;
//         } catch (error) {
//             console.error("Failed to get account info:", error);
//             throw error;
//         }
//     }

//     public async getClient(): Promise<Client | null> {
//         if (this.client) {
//             return this.client;
//         }

//         try {
//             // Initialize client for testnet
//             const client = Client.forTestnet();
            
//             // If using sandbox account credentials
//             if (process.env.HEDERA_ACCOUNT_ID && process.env.HEDERA_PRIVATE_KEY) {
//                 const operatorId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
//                 // Handle both ECDSA and ED25519 private keys
//                 const operatorKey = process.env.HEDERA_PRIVATE_KEY.startsWith('0x') 
//                     ? PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY)
//                     : PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);
                
//                 client.setOperator(operatorId, operatorKey);
//             } else {
//                 // If no sandbox credentials, use HashConnect pairing for client operations
//                 const topic = localStorage.getItem('hashconnectTopic');
//                 if (topic) {
//                     const accountInfo = await this.hashConnect.getAccount(topic);
//                     if (accountInfo) {
//                         console.log("Using HashConnect paired account:", accountInfo.accountIds[0]);
//                     }
//                 }
//             }

//             this.client = client;
//             return client;
//         } catch (error) {
//             console.error("Failed to create client:", error);
//             return null;
//         }
//     }
// }

// export default WalletService;